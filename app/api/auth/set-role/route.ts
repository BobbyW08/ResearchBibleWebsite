import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const role = body?.role;
  if (role !== "parent" && role !== "professional") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const existing = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ error: "Profile already exists" }, { status: 409 });
  }

  const displayName = session.user.email?.split("@")[0] ?? "";
  await db.insert(profiles).values({
    userId: session.user.id,
    userRole: role,
    displayName,
  });

  return NextResponse.json({ ok: true });
}
