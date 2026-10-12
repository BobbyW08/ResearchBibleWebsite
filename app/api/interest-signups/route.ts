import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload-client";
import { appendSheetRow } from "@/lib/google/sheets";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SHEET_TAB = "Signups";

// Backs the Live Q&A "Show Interest" widget. `source` labels which widget
// captured the email so this route can be reused for other waitlists later.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const source = typeof body?.source === "string" ? body.source.trim() : "";

  if (!EMAIL_RE.test(email) || !source) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const payload = await getPayloadClient();

  // Dedup: if email+source already exists, treat as success without inserting.
  const { docs: existing } = await payload.find({
    collection: "interest-signups",
    where: {
      and: [{ email: { equals: email } }, { source: { equals: source } }],
    },
    limit: 1,
  });

  if (existing.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const doc = await payload.create({
    collection: "interest-signups",
    data: { email, source },
  });

  // Mirror to Google Sheet — best-effort, never fails the signup.
  const sheetId = process.env.INTEREST_SIGNUPS_SHEET_ID;
  if (sheetId) {
    try {
      await appendSheetRow(sheetId, SHEET_TAB, [
        email,
        source,
        new Date(doc.createdAt).toISOString(),
      ]);
    } catch (error) {
      console.error("Failed to mirror interest signup to Google Sheet:", error);
    }
  }

  return NextResponse.json({ ok: true });
}
