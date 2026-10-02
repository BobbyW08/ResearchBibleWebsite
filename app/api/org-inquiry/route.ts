import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "robwashburn8@gmail.com";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const orgName = typeof body?.orgName === "string" ? body.orgName.trim() : "";
  const role = typeof body?.role === "string" ? body.role.trim() : "";
  const families = typeof body?.families === "string" ? body.families.trim() : "";
  const gap = typeof body?.gap === "string" ? body.gap.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!orgName) {
    return NextResponse.json({ error: "Organization name is required." }, { status: 400 });
  }
  if (!role) {
    return NextResponse.json({ error: "Your role is required." }, { status: 400 });
  }
  if (!families) {
    return NextResponse.json({ error: "Please describe the families you are thinking of." }, { status: 400 });
  }
  if (!gap) {
    return NextResponse.json({ error: "Please describe the gap you are seeing." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "noreply@bobby-washburn.com",
        to: NOTIFY_EMAIL,
        subject: `[Org inquiry] ${orgName}`,
        html: `
          <p><strong>Organization:</strong> ${orgName}</p>
          <p><strong>Role:</strong> ${role}</p>
          <p><strong>Families:</strong></p>
          <p style="white-space:pre-wrap">${families}</p>
          <p><strong>Gap:</strong></p>
          <p style="white-space:pre-wrap">${gap}</p>
          <p><strong>Email:</strong> ${email}</p>
        `,
      });
    } catch (error) {
      console.error("Failed to send org inquiry notification:", error);
    }
  }

  return NextResponse.json({ ok: true });
}
