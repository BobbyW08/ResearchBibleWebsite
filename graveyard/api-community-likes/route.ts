import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { comments, likes, posts, profiles } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const targetType = body?.target_type as string | undefined;
  const targetId = body?.target_id as string | undefined;

  if ((targetType !== "post" && targetType !== "comment") || !targetId) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  const existing = await db
    .select({ id: likes.id })
    .from(likes)
    .where(
      and(
        eq(likes.userId, profile.id),
        eq(likes.targetType, targetType),
        eq(likes.targetId, targetId),
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db.delete(likes).where(eq(likes.id, existing[0].id));
    if (targetType === "post") {
      await db
        .update(posts)
        .set({ likesCount: sql`greatest(${posts.likesCount} - 1, 0)` })
        .where(eq(posts.id, targetId));
    } else {
      await db
        .update(comments)
        .set({ likesCount: sql`greatest(${comments.likesCount} - 1, 0)` })
        .where(eq(comments.id, targetId));
    }
    return NextResponse.json({ liked: false });
  }

  await db.insert(likes).values({ userId: profile.id, targetType, targetId });
  if (targetType === "post") {
    await db
      .update(posts)
      .set({ likesCount: sql`${posts.likesCount} + 1` })
      .where(eq(posts.id, targetId));
  } else {
    await db
      .update(comments)
      .set({ likesCount: sql`${comments.likesCount} + 1` })
      .where(eq(comments.id, targetId));
  }

  return NextResponse.json({ liked: true });
}
