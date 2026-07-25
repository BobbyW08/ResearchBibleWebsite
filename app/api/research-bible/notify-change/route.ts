import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";

import { db } from "@/lib/db";
import { pendingReviews } from "@/lib/db/schema";
import { fetchDocAsHtml } from "@/lib/google/docs";
import { convertDocHtmlToMdx } from "@/lib/google/htmlToMdx";
import { buildDashboardJson, fetchSheetValues } from "@/lib/google/sheets";

export const runtime = "nodejs";

interface SyncConfigEntry {
  docId: string;
  sheetId: string;
  sheetTab: string;
}

interface NotifyPayload {
  topic: string;
  changedAt?: string;
}

function jsonResponse(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isAuthorized(request: Request): boolean {
  const provided = request.headers.get("Authorization")?.replace(/^Bearer\s+/, "");
  const expected = process.env.WEBHOOK_SECRET;
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

async function loadSyncConfig(): Promise<Record<string, SyncConfigEntry>> {
  const raw = await fs.readFile(
    path.join(process.cwd(), "content", "sync-config.json"),
    "utf-8",
  );
  return JSON.parse(raw) as Record<string, SyncConfigEntry>;
}

function splitFrontmatterAndImport(mdx: string): string {
  const headingIndex = mdx.search(/^##\s/m);
  if (headingIndex === -1) {
    throw new Error(
      "Existing .mdx file has no `##` heading — cannot locate where the body starts",
    );
  }
  return mdx.slice(0, headingIndex).trimEnd();
}

export async function POST(request: Request): Promise<Response> {
  if (!isAuthorized(request)) {
    return jsonResponse({ success: false, error: "Unauthorized" }, 401);
  }

  let payload: NotifyPayload;
  try {
    payload = (await request.json()) as NotifyPayload;
  } catch {
    return jsonResponse({ success: false, error: "Malformed JSON body" }, 400);
  }

  const { topic } = payload;
  if (!topic || typeof topic !== "string") {
    return jsonResponse({ success: false, error: "Missing `topic` field" }, 400);
  }

  const syncConfig = await loadSyncConfig();
  const topicConfig = syncConfig[topic];
  if (!topicConfig) {
    return jsonResponse(
      { success: false, error: `Unknown topic "${topic}" — not in sync-config.json` },
      400,
    );
  }

  // --- Convert Doc → MDX ---
  const mdxPath = path.join(process.cwd(), "content", "docs", `${topic}.mdx`);
  let existingMdx: string;
  try {
    existingMdx = await fs.readFile(mdxPath, "utf-8");
  } catch {
    return jsonResponse(
      {
        success: false,
        error: `No existing content/docs/${topic}.mdx — create it before enabling sync`,
      },
      500,
    );
  }

  const frontmatterAndImport = splitFrontmatterAndImport(existingMdx);

  let generatedMdx: string;
  try {
    const html = await fetchDocAsHtml(topicConfig.docId);
    generatedMdx = await convertDocHtmlToMdx(html, frontmatterAndImport);
  } catch (err) {
    return jsonResponse(
      {
        success: false,
        error: `Doc → MDX conversion failed: ${err instanceof Error ? err.message : String(err)}`,
      },
      500,
    );
  }

  // --- Convert Sheet → JSON ---
  const jsonPath = path.join(process.cwd(), "content", "data", `${topic}.json`);
  let existingData: Record<string, unknown>;
  try {
    existingData = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
  } catch {
    return jsonResponse(
      {
        success: false,
        error: `No existing content/data/${topic}.json — create it before enabling sync`,
      },
      500,
    );
  }

  let generatedJson: string;
  try {
    const rows = await fetchSheetValues(topicConfig.sheetId, topicConfig.sheetTab);
    if (rows.length < 2) {
      throw new Error("Sheet tab has no data rows below the header");
    }
    const updated = buildDashboardJson(existingData, rows);
    generatedJson = JSON.stringify(updated, null, 2);
  } catch (err) {
    return jsonResponse(
      {
        success: false,
        error: `Sheet → JSON conversion failed: ${err instanceof Error ? err.message : String(err)}`,
      },
      500,
    );
  }

  // --- Store pending review in database ---
  let reviewId: string;
  try {
    const [row] = await db
      .insert(pendingReviews)
      .values({ topic, generatedMdx, generatedJson })
      .returning({ id: pendingReviews.id });
    reviewId = row.id;
  } catch (err) {
    return jsonResponse(
      {
        success: false,
        error: `Database insert failed: ${err instanceof Error ? err.message : String(err)}`,
      },
      500,
    );
  }

  // --- Send email notification via Resend ---
  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL ?? "robwashburn8@gmail.com";

  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://localhost:3000";
      await resend.emails.send({
        from: "Research Bible <noreply@resend.dev>",
        to: notifyEmail,
        subject: `[Research Bible] ${topic.toUpperCase()} updated — review & publish`,
        html: `
          <p>The <strong>${topic}</strong> research bible was updated.</p>
          <p>A pending review has been queued. Visit your account to approve or reject the changes before they go live.</p>
          <p>
            <a href="${siteUrl}/account/pending-reviews/${reviewId}" style="
              display:inline-block;
              padding:10px 20px;
              background:#1B3A5C;
              color:#F5F3EC;
              border-radius:6px;
              text-decoration:none;
              font-weight:600;
            ">Review Changes</a>
          </p>
          <p style="color:#B8AE96;font-size:12px;">Review ID: ${reviewId}</p>
        `.trim(),
      });
    } catch {
      // Non-fatal — review is stored, email failure shouldn't 500 the webhook
    }
  }

  return jsonResponse({ success: true, topic, reviewId }, 200);
}
