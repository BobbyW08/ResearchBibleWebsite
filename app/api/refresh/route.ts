import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";

import { fetchDocAsHtml } from "@/lib/google/docs";
import { convertDocHtmlToMdx } from "@/lib/google/htmlToMdx";
import { buildDashboardJson, fetchSheetValues } from "@/lib/google/sheets";

export const runtime = "nodejs";

interface SyncConfigEntry {
  docId: string;
  sheetId: string;
  sheetTab: string;
}

interface RefreshPayload {
  type: "doc" | "sheet";
  topic: string;
  docId?: string;
  sheetId?: string;
}

interface RefreshResult {
  success: boolean;
  topic?: string;
  type?: string;
  error?: string;
}

function jsonResponse(body: RefreshResult, status: number): Response {
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

async function loadSyncConfig(): Promise<Record<string, SyncConfigEntry>> {
  const raw = await fs.readFile(path.join(process.cwd(), "content", "sync-config.json"), "utf-8");
  return JSON.parse(raw) as Record<string, SyncConfigEntry>;
}

function splitFrontmatterAndImport(mdx: string): string {
  // Everything up through the last `import ... from "...";` line that
  // precedes the first `##` heading is preserved verbatim; the rest is the
  // body we replace with the converted Doc content.
  const headingIndex = mdx.search(/^##\s/m);
  if (headingIndex === -1) {
    throw new Error("Existing .mdx file has no `##` heading — cannot locate where the body starts");
  }
  return mdx.slice(0, headingIndex).trimEnd();
}

export async function POST(request: Request): Promise<Response> {
  try {
    if (!isAuthorized(request)) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    let payload: RefreshPayload;
    try {
      payload = (await request.json()) as RefreshPayload;
    } catch {
      return jsonResponse({ success: false, error: "Malformed JSON body" }, 400);
    }

    const { type, topic } = payload;
    if ((type !== "doc" && type !== "sheet") || !topic) {
      return jsonResponse({ success: false, error: "Missing or invalid `type`/`topic`" }, 400);
    }

    const syncConfig = await loadSyncConfig();
    const topicConfig = syncConfig[topic];
    if (!topicConfig) {
      return jsonResponse({ success: false, topic, type, error: `Unknown topic "${topic}"` }, 400);
    }

    if (type === "doc") {
      if (payload.docId !== topicConfig.docId) {
        return jsonResponse({ success: false, topic, type, error: "docId does not match sync-config.json" }, 400);
      }

      const mdxPath = path.join(process.cwd(), "content", "docs", `${topic}.mdx`);
      let existingMdx: string;
      try {
        existingMdx = await fs.readFile(mdxPath, "utf-8");
      } catch {
        return jsonResponse(
          { success: false, topic, type, error: `No existing content/docs/${topic}.mdx to sync into` },
          500,
        );
      }

      const frontmatterAndImport = splitFrontmatterAndImport(existingMdx);

      let converted: string;
      try {
        const html = await fetchDocAsHtml(payload.docId);
        converted = await convertDocHtmlToMdx(html, frontmatterAndImport);
      } catch (err) {
        return jsonResponse(
          { success: false, topic, type, error: err instanceof Error ? err.message : String(err) },
          500,
        );
      }

      await fs.writeFile(mdxPath, converted, "utf-8");
      revalidatePath(`/docs/${topic}`);
      return jsonResponse({ success: true, topic, type }, 200);
    }

    // type === "sheet"
    if (payload.sheetId !== topicConfig.sheetId) {
      return jsonResponse({ success: false, topic, type, error: "sheetId does not match sync-config.json" }, 400);
    }

    const jsonPath = path.join(process.cwd(), "content", "data", `${topic}.json`);
    let existingData: Record<string, unknown>;
    try {
      existingData = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
    } catch {
      return jsonResponse(
        { success: false, topic, type, error: `No existing content/data/${topic}.json to sync into` },
        500,
      );
    }

    let updated: Record<string, unknown>;
    try {
      const rows = await fetchSheetValues(topicConfig.sheetId, topicConfig.sheetTab);
      if (rows.length < 2) {
        throw new Error("Sheet tab has no data rows below the header");
      }
      updated = buildDashboardJson(existingData, rows);
    } catch (err) {
      return jsonResponse(
        { success: false, topic, type, error: err instanceof Error ? err.message : String(err) },
        500,
      );
    }

    await fs.writeFile(jsonPath, `${JSON.stringify(updated, null, 2)}\n`, "utf-8");
    revalidatePath(`/dashboard/${topic}`);
    return jsonResponse({ success: true, topic, type }, 200);
  } catch (err) {
    return jsonResponse({ success: false, error: err instanceof Error ? err.message : String(err) }, 500);
  }
}
