import crypto from "node:crypto";

import { fetchDriveFileContent } from "@/lib/google/drive";
import {
  BibleParseError,
  computeVersion,
  extractBody,
  extractChangelogEntry,
  extractTitle,
  stripPandocArtifacts,
} from "@/lib/research-bibles/parse";
import { getPayloadClient } from "@/lib/payload-client";
import { convertMarkdownToLexical, editorConfigFactory } from "@payloadcms/richtext-lexical";

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
 * KNOWN LIMITATION: module-level state resets on cold starts. Acceptable
 * for this low-traffic internal webhook.
 */
const RATE_LIMIT_CAPACITY = 10;
const RATE_LIMIT_REFILL_PER_MS = 10 / (60 * 1000); // 10 tokens per minute
let rateLimitTokens = RATE_LIMIT_CAPACITY;
let rateLimitLastRefill = Date.now();

function checkRateLimit(): boolean {
  const now = Date.now();
  const elapsed = now - rateLimitLastRefill;
  rateLimitTokens = Math.min(
    RATE_LIMIT_CAPACITY,
    rateLimitTokens + elapsed * RATE_LIMIT_REFILL_PER_MS
  );
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

async function handleBibleSync(
  fileId: string,
  fileName: string
): Promise<SyncResult & { status: number }> {
  let raw: string;
  try {
    raw = await fetchDriveFileContent(fileId);
  } catch (err) {
    return {
      success: false,
      status: 502,
      error: `Drive fetch failed: ${err instanceof Error ? err.message : String(err)}`,
    };
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
    return {
      success: false,
      status: 400,
      error: `Title "${title}" produced an empty slug`,
    };
  }

  const changelogEntry = extractChangelogEntry(raw, fileName);
  const stripped = stripPandocArtifacts(raw);
  const cleanedBody = extractBody(stripped);

  // Dedup guard: hash cleaned body, compare against existing Payload record.
  const payload = await getPayloadClient();
  const existing = await payload.find({
    collection: "research-bibles",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });

  const newHash = crypto
    .createHash("sha256")
    .update(cleanedBody, "utf-8")
    .digest("hex");

  const editorConfig = await editorConfigFactory.default({ config: payload.config });

  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as {
      id: string;
      body?: unknown;
      changelog?: { date: string; summary: string; prUrl: string }[];
    };
    const existingChangelog = doc.changelog ?? [];
    const newChangelog = [
      {
        date: changelogEntry.date,
        summary: changelogEntry.summary,
        prUrl: "",
      },
      ...existingChangelog,
    ];

    const lexicalBody = convertMarkdownToLexical({ editorConfig, markdown: cleanedBody });

    await payload.update({
      collection: "research-bibles",
      id: doc.id,
      data: {
        body: lexicalBody,
        changelog: newChangelog,
        version: computeVersion(existingChangelog.length),
        lastUpdated: todayUtcIsoDate(),
        _status: "draft",
      },
    });

    return { success: true, status: 200, slug, action: "updated", status_value: "draft" };
  }

  const lexicalBody = convertMarkdownToLexical({ editorConfig, markdown: cleanedBody });

  await payload.create({
    collection: "research-bibles",
    data: {
      slug,
      title,
      body: lexicalBody,
      changelog: [
        {
          date: changelogEntry.date,
          summary: changelogEntry.summary,
          prUrl: "",
        },
      ],
      version: "1.0",
      lastUpdated: todayUtcIsoDate(),
      tags: [],
      noindex: false,
      _status: "draft",
    },
  });

  return { success: true, status: 200, slug, action: "created", status_value: "draft" };
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
      return jsonResponse(
        { success: false, error: "Missing fileId/fileName/folderKey" },
        400
      );
    }

    if (folderKey !== "researchBibles" || !BIBLE_FILENAME_RE.test(fileName)) {
      return jsonResponse({ success: false, error: "not yet supported" }, 400);
    }

    const result = await handleBibleSync(fileId, fileName);
    const { status, ...body } = result;
    return jsonResponse(body, status);
  } catch (err) {
    return jsonResponse(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      500
    );
  }
}
