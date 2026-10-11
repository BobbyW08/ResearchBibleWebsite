import { NextResponse } from "next/server";
import { appendSheetRow } from "@/lib/google/sheets";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SHEET_TAB = "OrgInquiries";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const orgName = typeof body?.orgName === "string" ? body.orgName.trim() : "";
  const role = typeof body?.role === "string" ? body.role.trim() : "";
  const families = typeof body?.families === "string" ? body.families.trim() : "";
  const gap = typeof body?.gap === "string" ? body.gap.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!orgName || !role || !families || !gap || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const sheetId = process.env.INTEREST_SIGNUPS_SHEET_ID;
  if (sheetId) {
    try {
      await appendSheetRow(sheetId, SHEET_TAB, [
        new Date().toISOString(),
        email,
        orgName,
        role,
        families,
        gap,
      ]);
    } catch (error) {
      console.error("Failed to append org inquiry to Google Sheet:", error);
    }
  }

  return NextResponse.json({ ok: true });
}
