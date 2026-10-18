import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";
import { checkRateLimit } from "@/lib/rate-limit";

const VALID_REASONS = ["harassment", "hate_speech", "spam", "privacy", "misinformation", "other"];

/**
 * POST /api/community/report
 * Body: { targetType: 'post' | 'comment'; targetId: string; reason: string; note?: string }
 *
 * Creates a report and emails Bobby (non-fatal on email failure).
 * BLOCKED-ON-BOBBY: RESEND_API_KEY, verified sending domain, NOTIFY_EMAIL.
 */
export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Rate limit: 10 reports per user per hour
  const rl = checkRateLimit(`report:${session.user.id}`, 10, 60 * 60 * 1000);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = await request.json().catch(() => null);
  const { targetType, targetId, reason, note } = body ?? {};

  if (targetType !== "post" && targetType !== "comment") {
    return NextResponse.json({ error: "Invalid targetType" }, { status: 400 });
  }
  if (!targetId || typeof targetId !== "string") {
    return NextResponse.json({ error: "targetId is required" }, { status: 400 });
  }
  if (!VALID_REASONS.includes(reason)) {
    return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
  }

  const noteText =
    typeof note === "string" ? note.trim().slice(0, 500) : "";

  const payload = await getPayloadClient();

  // Verify target exists
  const collection = targetType === "post" ? "posts" : "comments";
  const { docs } = await payload.find({
    collection,
    where: { id: { equals: targetId } },
    limit: 1,
  });
  if (!docs[0]) return NextResponse.json({ error: "Target not found" }, { status: 404 });

  await payload.create({
    collection: "reports",
    data: {
      reporterUserId: session.user.id,
      targetType,
      targetId,
      reason,
      note: noteText || undefined,
      status: "open",
    },
  });

  // Email notification (non-fatal) — BLOCKED-ON-BOBBY: set RESEND_API_KEY and NOTIFY_EMAIL
  if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "notifications@bobby-washburn.com",
        to: process.env.NOTIFY_EMAIL,
        subject: `Community report: ${targetType} ${targetId}`,
        text: `A new community report has been filed.\n\nType: ${targetType}\nTarget ID: ${targetId}\nReason: ${reason}\nNote: ${noteText || "—"}\n\nReview at /admin/collections/reports`,
      });
    } catch {
      // Non-fatal
    }
  }

  return NextResponse.json({ ok: true });
}
