import crypto from "node:crypto";

import { convertMarkdownToLexical, editorConfigFactory } from "@payloadcms/richtext-lexical";

import { fetchDriveFileContent } from "@/lib/google/drive";
import { getPayloadClient } from "@/lib/payload-client";
import {
  ParentContentParseError,
  parseAwarenessModuleSource,
  parsePainPointSource,
} from "@/lib/parent-content/parse";
import type { ContentBlock } from "@/lib/parent-content/frontmatter";
/**
 * Standalone webhook for the Parent Content sync pipeline (Pain Points +
 * Awareness Modules). Deliberately NOT a branch inside
 * app/api/webhooks/drive-content-sync/route.ts - separate endpoint, separate
 * secret, separate rate limiter, separate dedup logic, per
 * Research-Content-Pipeline-Handoff-v5.md. Only the generic Drive-fetch helper and the
 * Payload client are shared with that route.
 *
 * Writes DRAFTS into the Payload `pain-points` / `awareness-modules`
 * collections. Bobby reviews and publishes from /admin. The site-owned
 * `featured` flag is never touched on resync.
 *
 * There is no scheduled trigger for this route - see
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
 * Own module-level token-bucket rate limiter - separate state from the bible
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

type PayloadClient = Awaited<ReturnType<typeof getPayloadClient>>;

function blocksToMarkdown(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => (b.discriminant === "list" ? b.value.map((item) => `- ${item}`).join("\n") : b.value))
    .join("\n\n");
}

function sameJson(a: unknown, b: unknown): boolean {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

/** True when every key in `next` already matches the same key in `existing`. */
function fieldsUnchanged(existing: Record<string, unknown>, next: Record<string, unknown>): boolean {
  return Object.keys(next).every((key) => {
    const strip = (v: unknown) =>
      JSON.parse(JSON.stringify(v ?? null), (k, val) => (k === "id" ? undefined : val));
    return sameJson(strip(existing[key]), strip(next[key]));
  });
}

async function handlePainPointSync(
  payload: PayloadClient,
  fileId: string,
  fileName: string,
): Promise<SyncResult & { status: number }> {
  let raw: string;
  try {
    raw = await fetchDriveFileContent(fileId);
  } catch (err) {
    return { success: false, status: 502, error: `Drive fetch failed: ${err instanceof Error ? err.message : String(err)}` };
  }

  let source;
  try {
    const result = parsePainPointSource(raw);
    if (result.status === "skipped") {
      return { success: true, status: 200, noop: true, fileName, message: `Skipped: ${result.reason}` };
    }
    source = result.fields;
  } catch (err) {
    if (err instanceof ParentContentParseError) {
      return { success: false, status: 400, error: err.message };
    }
    throw err;
  }

  const editorConfig = await editorConfigFactory.default({ config: payload.config });
  const data = {
    slug: source.slugName,
    tag: source.tag,
    title: source.title,
    cardTeaser: source.cardTeaser,
    headline: source.headline,
    icon: source.icon,
    intro: source.intro,
    exampleScenario: source.exampleScenario,
    whatHappening: convertMarkdownToLexical({ editorConfig, markdown: blocksToMarkdown(source.whatHappening) }),
    backfires: source.backfires.map((b) => ({ title: b.title, body: b.body })),
    tries: source.tries.map((t) => ({ title: t.title, details: t.body })),
    support: source.support,
    crisis: source.crisis,
    deepDive: { href: source.deepDiveHref, label: source.deepDiveLabel },
    related: source.related.map((r) => ({ href: r.href, label: r.label })),
  };

  const existing = await payload.find({
    collection: "pain-points",
    where: { slug: { equals: source.slugName } },
    limit: 1,
    depth: 0,
    draft: true,
  });

  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as unknown as Record<string, unknown> & { id: string | number };
    if (fieldsUnchanged(doc, data)) {
      return { success: true, status: 200, noop: true, slug: source.slugName, message: "Fields unchanged, no draft saved" };
    }
    // `featured` is site-owned and is deliberately absent from `data`.
    await payload.update({
      collection: "pain-points",
      id: doc.id,
      data,
      draft: true,
    });
    return { success: true, status: 200, slug: source.slugName, action: "updated", status_value: "draft" };
  }

  await payload.create({
    collection: "pain-points",
    data: { ...data, featured: false, _status: "draft" },
    draft: true,
  });
  return { success: true, status: 200, slug: source.slugName, action: "created", status_value: "draft" };
}

async function handleAwarenessModuleSync(
  payload: PayloadClient,
  fileId: string,
  fileName: string,
): Promise<SyncResult & { status: number }> {
  let raw: string;
  try {
    raw = await fetchDriveFileContent(fileId);
  } catch (err) {
    return { success: false, status: 502, error: `Drive fetch failed: ${err instanceof Error ? err.message : String(err)}` };
  }

  let source;
  try {
    const result = parseAwarenessModuleSource(raw);
    if (result.status === "skipped") {
      return { success: true, status: 200, noop: true, fileName, message: `Skipped: ${result.reason}` };
    }
    source = result.fields;
  } catch (err) {
    if (err instanceof ParentContentParseError) {
      return { success: false, status: 400, error: err.message };
    }
    throw err;
  }

  const editorConfig = await editorConfigFactory.default({ config: payload.config });
  const data = {
    slug: source.slugName,
    tag: source.tag,
    title: source.title,
    cardTeaser: source.cardTeaser,
    headline: source.headline,
    icon: source.icon,
    intro: source.intro,
    sections: source.sections.map((s) => ({
      heading: s.heading,
      body: convertMarkdownToLexical({ editorConfig, markdown: blocksToMarkdown(s.body) }),
    })),
    crisis: source.crisis,
    related: source.related.map((r) => ({ href: r.href, label: r.label })),
  };

  const existing = await payload.find({
    collection: "awareness-modules",
    where: { slug: { equals: source.slugName } },
    limit: 1,
    depth: 0,
    draft: true,
  });

  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as unknown as Record<string, unknown> & { id: string | number };
    if (fieldsUnchanged(doc, data)) {
      return { success: true, status: 200, noop: true, slug: source.slugName, message: "Fields unchanged, no draft saved" };
    }
    await payload.update({ collection: "awareness-modules", id: doc.id, data, draft: true });
    return { success: true, status: 200, slug: source.slugName, action: "updated", status_value: "draft" };
  }

  await payload.create({
    collection: "awareness-modules",
    data: { ...data, _status: "draft" },
    draft: true,
  });
  return { success: true, status: 200, slug: source.slugName, action: "created", status_value: "draft" };
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
      result = await handlePainPointSync(await getPayloadClient(), fileId, fileName);
    } else if (MODULE_FILENAME_RE.test(fileName)) {
      result = await handleAwarenessModuleSync(await getPayloadClient(), fileId, fileName);
    } else {
      return jsonResponse({ success: false, error: `Unrecognized filename "${fileName}", expected PainPoint_*.md or Module_*.md` }, 400);
    }

    const { status, ...body } = result;
    return jsonResponse(body, status);
  } catch (err) {
    return jsonResponse({ success: false, error: err instanceof Error ? err.message : String(err) }, 500);
  }
}
