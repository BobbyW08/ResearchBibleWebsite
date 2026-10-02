import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const displayName = typeof body?.displayName === "string" ? body.displayName.trim() : null;
  const bio = typeof body?.bio === "string" ? body.bio.trim() : null;

  if (!displayName) return NextResponse.json({ error: "Display name is required" }, { status: 400 });
  if (displayName.length > 80) return NextResponse.json({ error: "Display name too long" }, { status: 400 });
  if (bio !== null && bio.length > 400) return NextResponse.json({ error: "Bio too long" }, { status: 400 });

  await db
    .update(profiles)
    .set({ displayName, bio: bio ?? "", updatedAt: new Date() })
    .where(eq(profiles.userId, session.user.id));

  return NextResponse.json({ ok: true });
}
