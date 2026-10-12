import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";

const DISPLAY_NAME_MAX = 50;

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id: string; email?: string; emailVerified?: boolean };
  if (!user.emailVerified) {
    return NextResponse.json({ error: "Email not verified" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const role = body?.role;
  if (role !== "parent" && role !== "professional") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const rawDisplayName = (body?.displayName as string | undefined)?.trim();
  const displayName =
    rawDisplayName && rawDisplayName.length <= DISPLAY_NAME_MAX
      ? rawDisplayName
      : (user.email?.split("@")[0] ?? "").slice(0, DISPLAY_NAME_MAX);

  const payload = await getPayloadClient();

  // Check for existing profile first (race-safe: a second request that lands
  // while the first is still creating should return success, not 409)
  const { docs: existing } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: user.id } },
    limit: 1,
  });

  if (existing.length > 0) {
    // Profile already exists — idempotent success
    return NextResponse.json({ ok: true });
  }

  try {
    await payload.create({
      collection: "visitor-profiles",
      data: { userId: user.id, userRole: role, displayName, status: "active" },
    });
  } catch (err) {
    // Unique constraint violation = concurrent create — treat as success
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ ok: true });
    }
    throw err;
  }

  return NextResponse.json({ ok: true });
}
