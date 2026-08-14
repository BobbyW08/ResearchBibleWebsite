import crypto from "node:crypto";

import { fetchDriveFileContent } from "@/lib/google/drive";
import {
  createBranch,
  getDefaultBranchSha,
  getFileContent,
  getFileSha,
  openPullRequest,
  putFile,
  updateFile,
} from "@/lib/github/contents";
import {
  BibleParseError,
  computeVersion,
  extractBody,
  extractChangelogEntry,
  extractTitle,
  stripPandocArtifacts,
} from "@/lib/research-bibles/parse";
import { parseBibleFile, serializeBibleFile, type BibleFrontmatter } from "@/lib/research-bibles/frontmatter";

export const runtime = "nodejs";

interface SyncPayload {
  fileId: string;
  fileName: string;
  folderKey: string;
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
  // Mirrors app/api/refresh/route.ts's exact auth pattern.
  const provided = request.headers.get("X-Webhook-Secret");
  const expected = process.env.WEBHOOK_SECRET;

  if (!provided || !expected) return false;

  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);
  if (providedBuf.length !== expectedBuf.length) return false;

  return crypto.timingSafeEqual(providedBuf, expectedBuf);
}

/**
 * Tiny in-memory token-bucket rate limiter.
 *
 * KNOWN LIMITATION: this state lives in a module-level variable, so it only
 * works within a single warm serverless instance and resets on cold starts
 * (Vercel can and will spin up multiple concurrent instances, each with its
 * own bucket). That means the effective global rate limit is
 * `instances * BUCKET_CAPACITY` refilling independently per instance, not a
 * true global limit. Acceptable here because this is a low-traffic internal
 * webhook (one Apps Script trigger, one Drive folder) — not a public
 * endpoint under adversarial load — but flagging explicitly rather than
 * silently pretending this is a real distributed rate limiter.
 */
const RATE_LIMIT_CAPACITY = 10;
const RATE_LIMIT_REFILL_PER_MS = 10 / (60 * 1000); // 10 tokens per minute
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

const BIBLE_FILENAME_RE = /^RB_.*\.md$/i;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function todayUtcIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

async function handleBibleSync(fileId: string, fileName: string): Promise<SyncResult & { status: number }> {
  let raw: string;
  try {
    raw = await fetchDriveFileContent(fileId);
  } catch (err) {
    return { success: false, status: 502, error: `Drive fetch failed: ${err instanceof Error ? err.message : String(err)}` };
  }

  let title: string;
  try {
    title = extractTitle(raw);
  } catch (err) {
    if (err instanceof BibleParseError) {
      return { success: false, status: 400, error: err.message };
    }
    throw err;
  }

  const slug = slugify(title);
  if (!slug) {
    return { success: false, status: 400, error: `Title "${title}" produced an empty slug` };
  }

  const changelogEntry = extractChangelogEntry(raw, fileName);
  const stripped = stripPandocArtifacts(raw);
  const cleanedBody = extractBody(stripped);

  const filePath = `content/research-bibles/${slug}/index.mdx`;

  // Dedup guard: hash of the cleaned body only, compared against the live
  // GitHub file's current body (if any).
  const existingRaw = await getFileContent(filePath, "main");
  const existingParsed = existingRaw ? parseBibleFile(existingRaw) : null;

  const newHash = crypto.createHash("sha256").update(cleanedBody, "utf-8").digest("hex");
  if (existingParsed) {
    const existingHash = crypto.createHash("sha256").update(existingParsed.body, "utf-8").digest("hex");
    if (newHash === existingHash) {
      return { success: true, status: 200, noop: true, slug, message: "Body unchanged — no PR opened" };
    }
  }

  const existingChangelogLength = existingParsed?.frontmatter.changelog.length ?? 0;
  const version = computeVersion(existingChangelogLength);

  const frontmatter: BibleFrontmatter = {
    title,
    version,
    lastUpdated: todayUtcIsoDate(),
    // Site-owned: default [] on first sync, otherwise leave whatever was
    // already set in Keystatic completely untouched.
    tags: existingParsed?.frontmatter.tags ?? [],
    noindex: existingParsed?.frontmatter.noindex ?? false,
    changelog: [
      ...(existingParsed?.frontmatter.changelog ?? []),
      { ...changelogEntry, prUrl: "" },
    ],
  };

  const fileContents = serializeBibleFile(frontmatter, cleanedBody);

  const branchName = `content-sync/bible-${slug}-${todayUtcIsoDate()}`;

  try {
    const baseSha = await getDefaultBranchSha();
    await createBranch(branchName, baseSha);

    const shaOnBranch = existingParsed ? await getFileSha(filePath, branchName) : null;
    await putFile(
      filePath,
      fileContents,
      `content-sync: update research bible "${title}" (${version})`,
      branchName,
      shaOnBranch ?? undefined,
    );

    const prUrl = await openPullRequest(
      `Content sync: ${title} (${version})`,
      `Automated content sync from Drive for research bible **${title}**.\n\n**Changelog entry:**\n- Date: ${changelogEntry.date}\n- ${changelogEntry.summary}\n\nReview the diff and merge to publish.`,
      branchName,
      "main",
    );

    // Follow-up commit on the same branch: fill in the real prUrl into the
    // changelog entry just written, now that the PR exists.
    frontmatter.changelog[frontmatter.changelog.length - 1].prUrl = prUrl;
    const finalContents = serializeBibleFile(frontmatter, cleanedBody);
    const shaAfterFirstCommit = await getFileSha(filePath, branchName);
    if (!shaAfterFirstCommit) {
      throw new Error("Could not read back file SHA after first commit — cannot make follow-up commit");
    }
    await updateFile(
      filePath,
      finalContents,
      `content-sync: fill in PR URL for "${title}" (${version})`,
      branchName,
      shaAfterFirstCommit,
    );

    return { success: true, status: 200, slug, version, prUrl, branch: branchName };
  } catch (err) {
    return {
      success: false,
      status: 502,
      error: `GitHub sync failed: ${err instanceof Error ? err.message : String(err)}`,
    };
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

    const { fileId, fileName, folderKey } = payload;
    if (!fileId || !fileName || !folderKey) {
      return jsonResponse({ success: false, error: "Missing fileId/fileName/folderKey" }, 400);
    }

    if (folderKey !== "researchBibles" || !BIBLE_FILENAME_RE.test(fileName)) {
      return jsonResponse({ success: false, error: "not yet supported" }, 400);
    }

    const result = await handleBibleSync(fileId, fileName);
    const { status, ...body } = result;
    return jsonResponse(body, status);
  } catch (err) {
    return jsonResponse({ success: false, error: err instanceof Error ? err.message : String(err) }, 500);
  }
}
