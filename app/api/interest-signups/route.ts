import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interestSignups } from "@/lib/db/schema";
import { appendSheetRow } from "@/lib/google/sheets";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SHEET_TAB = "Signups";

// Backs the Live Q&A "Show Interest" widget (components/marketing/services/
// interest-signup-widget.tsx) — a signal-of-interest capture, not a
// confirmation flow. `source` labels which widget captured the email so this
// route/table can be reused for other waitlists later.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const source = typeof body?.source === "string" ? body.source.trim() : "";

  if (!EMAIL_RE.test(email) || !source) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const inserted = await db
    .insert(interestSignups)
    .values({ email, source })
    .onConflictDoNothing()
    .returning({ createdAt: interestSignups.createdAt });

  // Mirror new signups to a Google Sheet so they're easy to monitor without
  // querying the DB directly. Best-effort only — the DB row is the source of
  // truth, so a Sheets outage (or the env var being unset) must never fail
  // the signup itself. Duplicates (onConflictDoNothing no-ops) are skipped
  // so resubmitting the same email+source doesn't add a second sheet row.
  const sheetId = process.env.INTEREST_SIGNUPS_SHEET_ID;
  if (inserted.length > 0 && sheetId) {
    try {
      await appendSheetRow(sheetId, SHEET_TAB, [email, source, inserted[0].createdAt.toISOString()]);
    } catch (error) {
      console.error("Failed to mirror interest signup to Google Sheet:", error);
    }
  }

  return NextResponse.json({ ok: true });
}
