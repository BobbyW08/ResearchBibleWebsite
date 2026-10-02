import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { comments, posts, profiles } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

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
  const postId = body?.postId as string | undefined;
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!postId || !content) {
    return NextResponse.json({ error: "postId and content are required" }, { status: 400 });
  }
  if (content.length > 1000) return NextResponse.json({ error: "Comment too long" }, { status: 400 });

  const post = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const [comment] = await db
    .insert(comments)
    .values({ postId, authorId: profile.id, content })
    .returning();

  await db
    .update(posts)
    .set({ commentsCount: sql`${posts.commentsCount} + 1` })
    .where(eq(posts.id, postId));

  return NextResponse.json(comment, { status: 201 });
}
