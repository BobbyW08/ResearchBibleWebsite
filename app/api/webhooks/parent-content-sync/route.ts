import crypto from "node:crypto";

import { fetchDriveFileContent } from "@/lib/google/drive";
import { createBranch, getDefaultBranchSha, getFileContent, getFileSha, openPullRequest, putFile } from "@/lib/github/contents";
import {
  ParentContentParseError,
  parseAwarenessModuleSource,
  parsePainPointSource,
  type AwarenessModuleSourceFields,
  type PainPointSourceFields,
} from "@/lib/parent-content/parse";
import {
  parseAwarenessModuleYaml,
  parsePainPointYaml,
  serializeAwarenessModuleYaml,
  serializePainPointYaml,
  type AwarenessModuleYaml,
  type PainPointYaml,
} from "@/lib/parent-content/frontmatter";

/**
 * Standalone webhook for the Parent Content sync pipeline (Pain Points +
 * Awareness Modules). Deliberately NOT a branch inside
 * app/api/webhooks/drive-content-sync/route.ts — separate endpoint, separate
 * secret, separate rate limiter, separate dedup logic, per
 * Research-Content-Pipeline-Handoff-v5.md. Only the generic, content-agnostic
 * Drive-fetch and GitHub-REST helpers are shared with that route.
 *
 * There is no scheduled trigger for this route — see
 * parent_content_sync_setup.md. It behaves identically regardless of what
 * calls it; "manual-only" is a property of the (nonexistent) Apps Script
 * trigger, not of this code.
 */

export const runtime = "nodejs";

interface SyncPayload {
  fileId: string;
  fileName: string;
}

interface SyncResult {
  success: boolean;
  [key: string]: unknown;
}

function jsonResponse(body: SyncResult, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isAuthorized(request: Request): boolean {
  const provided = request.headers.get("X-Webhook-Secret");
  const expected = process.env.PARENT_CONTENT_WEBHOOK_SECRET;

  if (!provided || !expected) return false;

  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);
  if (providedBuf.length !== expectedBuf.length) return false;

  return crypto.timingSafeEqual(providedBuf, expectedBuf);
}

/**
 * Own module-level token-bucket rate limiter — separate state from the bible
 * route's, by virtue of living in its own file. Same known limitation as
 * that route: per-instance, not a true distributed limiter. Acceptable for
 * a manually-triggered, low-traffic internal webhook.
 */
const RATE_LIMIT_CAPACITY = 10;
const RATE_LIMIT_REFILL_PER_MS = 10 / (60 * 1000);
let rateLimitTokens = RATE_LIMIT_CAPACITY;
let rateLimitLastRefill = Date.now();

function checkRateLimit(): boolean {
  const now = Date.now();
  const elapsed = now - rateLimitLastRefill;
  rateLimitTokens = Math.min(RATE_LIMIT_CAPACITY, rateLimitTokens + elapsed * RATE_LIMIT_REFILL_PER_MS);
  rateLimitLastRefill = now;

  if (rateLimitTokens < 1) return false;
  rateLimitTokens -= 1;
  return true;
}

const PAIN_POINT_FILENAME_RE = /^PainPoint_.*\.md$/i;
const MODULE_FILENAME_RE = /^Module_.*\.md$/i;

function todayUtcIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Short random suffix so a second same-day resync of the same slug (e.g. a
 * correction made right after the first sync) never collides with an
 * already-created branch name. Without this, `createBranch` 409s on the
 * duplicate ref, the route 502s, and the corrected Drive content silently
 * never gets retried unless someone manually intervenes.
 */
function branchSuffix(): string {
  return crypto.randomBytes(3).toString("hex");
}

function hashFields(value: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(value), "utf-8").digest("hex");
}

function diffFieldNames(before: Record<string, unknown> | null, after: Record<string, unknown>): string[] {
  if (!before) return ["(new entry)"];
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const changed: string[] = [];
  for (const key of keys) {
    if (key === "featured") continue; // site-owned — never reported as a content change
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changed.push(key);
    }
  }
  return changed;
}

async function handlePainPointSync(fileId: string, fileName: string): Promise<SyncResult & { status: number }> {
  let raw: string;
  try {
    raw = await fetchDriveFileContent(fileId);
  } catch (err) {
    return { success: false, status: 502, error: `Drive fetch failed: ${err instanceof Error ? err.message : String(err)}` };
  }

  let source: PainPointSourceFields;
  try {
    const result = parsePainPointSource(raw);
    if (result.status === "skipped") {
      return { success: true, status: 200, noop: true, fileName, message: `Skipped — ${result.reason}` };
    }
    source = result.fields;
  } catch (err) {
    if (err instanceof ParentContentParseError) {
      return { success: false, status: 400, error: err.message };
    }
    throw err;
  }

  const filePath = `content/pain-points/${source.slugName}.yaml`;
  const existingRaw = await getFileContent(filePath, "main");
  const existingParsed = existingRaw ? parsePainPointYaml(existingRaw) : null;

  const newHash = hashFields(source);
  if (existingParsed) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- excluding the site-owned field from the comparison, not using it
    const { featured, ...existingComparable } = existingParsed;
    if (newHash === hashFields(existingComparable)) {
      return { success: true, status: 200, noop: true, slug: source.slugName, message: "Fields unchanged — no PR opened" };
    }
  }

  const finalData: PainPointYaml = { ...source, featured: existingParsed?.featured ?? false };
  const yamlContents = serializePainPointYaml(finalData);
  const changedFields = diffFieldNames(existingParsed as unknown as Record<string, unknown> | null, finalData as unknown as Record<string, unknown>);

  const branchName = `content-sync/parent-content-pain-point-${source.slugName}-${todayUtcIsoDate()}-${branchSuffix()}`;

  try {
    const baseSha = await getDefaultBranchSha();
    await createBranch(branchName, baseSha);

    const shaOnBranch = existingParsed ? await getFileSha(filePath, branchName) : null;
    await putFile(
      filePath,
      yamlContents,
      `content-sync: ${existingParsed ? "update" : "add"} pain point "${source.title}"`,
      branchName,
      shaOnBranch ?? undefined,
    );

    const prUrl = await openPullRequest(
      `Content sync: ${source.title} (pain point)`,
      `Automated content sync from Drive for pain point **${source.title}** (\`${source.slugName}\`).\n\n**Changed fields:** ${changedFields.join(", ")}\n\nReview the diff and merge to publish.`,
      branchName,
      "main",
    );

    return { success: true, status: 200, slug: source.slugName, prUrl, branch: branchName };
  } catch (err) {
    return { success: false, status: 502, error: `GitHub sync failed: ${err instanceof Error ? err.message : String(err)}` };
  }
}

async function handleAwarenessModuleSync(fileId: string, fileName: string): Promise<SyncResult & { status: number }> {
  let raw: string;
  try {
    raw = await fetchDriveFileContent(fileId);
  } catch (err) {
    return { success: false, status: 502, error: `Drive fetch failed: ${err instanceof Error ? err.message : String(err)}` };
  }

  let source: AwarenessModuleSourceFields;
  try {
    const result = parseAwarenessModuleSource(raw);
    if (result.status === "skipped") {
      return { success: true, status: 200, noop: true, fileName, message: `Skipped — ${result.reason}` };
    }
    source = result.fields;
  } catch (err) {
    if (err instanceof ParentContentParseError) {
      return { success: false, status: 400, error: err.message };
    }
    throw err;
  }

  const filePath = `content/awareness-modules/${source.slugName}.yaml`;
  const existingRaw = await getFileContent(filePath, "main");
  const existingParsed = existingRaw ? parseAwarenessModuleYaml(existingRaw) : null;

  const newHash = hashFields(source);
  if (existingParsed && newHash === hashFields(existingParsed)) {
    return { success: true, status: 200, noop: true, slug: source.slugName, message: "Fields unchanged — no PR opened" };
  }

  const finalData: AwarenessModuleYaml = { ...source };
  const yamlContents = serializeAwarenessModuleYaml(finalData);
  const changedFields = diffFieldNames(existingParsed as unknown as Record<string, unknown> | null, finalData as unknown as Record<string, unknown>);

  const branchName = `content-sync/parent-content-module-${source.slugName}-${todayUtcIsoDate()}-${branchSuffix()}`;

  try {
    const baseSha = await getDefaultBranchSha();
    await createBranch(branchName, baseSha);

    const shaOnBranch = existingParsed ? await getFileSha(filePath, branchName) : null;
    await putFile(
      filePath,
      yamlContents,
      `content-sync: ${existingParsed ? "update" : "add"} awareness module "${source.title}"`,
      branchName,
      shaOnBranch ?? undefined,
    );

    const prUrl = await openPullRequest(
      `Content sync: ${source.title} (awareness module)`,
      `Automated content sync from Drive for awareness module **${source.title}** (\`${source.slugName}\`).\n\n**Changed fields:** ${changedFields.join(", ")}\n\nReview the diff and merge to publish.`,
      branchName,
      "main",
    );

    return { success: true, status: 200, slug: source.slugName, prUrl, branch: branchName };
  } catch (err) {
    return { success: false, status: 502, error: `GitHub sync failed: ${err instanceof Error ? err.message : String(err)}` };
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    if (!isAuthorized(request)) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    if (!checkRateLimit()) {
      return jsonResponse({ success: false, error: "Rate limit exceeded" }, 429);
    }

    let payload: SyncPayload;
    try {
      payload = (await request.json()) as SyncPayload;
    } catch {
      return jsonResponse({ success: false, error: "Malformed JSON body" }, 400);
    }

    const { fileId, fileName } = payload;
    if (!fileId || !fileName) {
      return jsonResponse({ success: false, error: "Missing fileId/fileName" }, 400);
    }

    let result: SyncResult & { status: number };
    if (PAIN_POINT_FILENAME_RE.test(fileName)) {
      result = await handlePainPointSync(fileId, fileName);
    } else if (MODULE_FILENAME_RE.test(fileName)) {
      result = await handleAwarenessModuleSync(fileId, fileName);
    } else {
      return jsonResponse({ success: false, error: `Unrecognized filename "${fileName}" — expected PainPoint_*.md or Module_*.md` }, 400);
    }

    const { status, ...body } = result;
    return jsonResponse(body, status);
  } catch (err) {
    return jsonResponse({ success: false, error: err instanceof Error ? err.message : String(err) }, 500);
  }
}
