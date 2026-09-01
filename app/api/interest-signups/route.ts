import { NextResponse } from "next/server";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { interestSignups } from "@/lib/db/schema";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Backs the teen page's "Join the Group" widget (real count only — never
// fabricated, per claude-code-handoff-v8.md Part B6).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source")?.trim() ?? "";

  if (!source) {
    return NextResponse.json({ error: "A source is required." }, { status: 400 });
  }

  const [row] = await db
    .select({ count: count() })
    .from(interestSignups)
    .where(eq(interestSignups.source, source));

  return NextResponse.json({ count: row?.count ?? 0 });
}

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
