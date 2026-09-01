import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interestSignups } from "@/lib/db/schema";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  await db.insert(interestSignups).values({ email, source }).onConflictDoNothing();

  return NextResponse.json({ ok: true });
}
