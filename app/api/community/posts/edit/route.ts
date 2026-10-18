import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";

const EDIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * PATCH /api/community/posts/edit
 * Body: { postId: string; content: string }
 *
 * Users may edit their own posts within 15 minutes of creation.
 */
export async function PATCH(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const postId = body?.postId as string | undefined;
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!postId || !content) {
    return NextResponse.json({ error: "postId and content are required" }, { status: 400 });
  }
  if (content.length > 2000) return NextResponse.json({ error: "Content too long" }, { status: 400 });

  const payload = await getPayloadClient();

  const { docs: profileDocs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });
  if (!profileDocs[0]) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { docs: postDocs } = await payload.find({
    collection: "posts",
    where: { id: { equals: postId } },
    limit: 1,
  });
  const post = postDocs[0];
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  // Ownership check
  const authorId =
    typeof post.author === "object" && post.author !== null
      ? (post.author as { id: string }).id
      : post.author;
  if (authorId !== (profileDocs[0].id as string)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Edit window
  const createdAt = new Date(post.createdAt as string).getTime();
  if (Date.now() - createdAt > EDIT_WINDOW_MS) {
    return NextResponse.json({ error: "Edit window expired" }, { status: 403 });
  }

  await payload.update({ collection: "posts", id: postId, data: { content } });
  return NextResponse.json({ ok: true });
}

/**
 * DELETE /api/community/posts/edit
 * Body: { postId: string }
 *
 * Users may delete their own posts within 15 minutes of creation.
 */
export async function DELETE(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const postId = body?.postId as string | undefined;
  if (!postId) return NextResponse.json({ error: "postId is required" }, { status: 400 });

  const payload = await getPayloadClient();

  const { docs: profileDocs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });
  if (!profileDocs[0]) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { docs: postDocs } = await payload.find({
    collection: "posts",
    where: { id: { equals: postId } },
    limit: 1,
  });
  const post = postDocs[0];
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const authorId =
    typeof post.author === "object" && post.author !== null
      ? (post.author as { id: string }).id
      : post.author;
  if (authorId !== (profileDocs[0].id as string)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const createdAt = new Date(post.createdAt as string).getTime();
  if (Date.now() - createdAt > EDIT_WINDOW_MS) {
    return NextResponse.json({ error: "Delete window expired" }, { status: 403 });
  }

  // Soft delete: mark as removed rather than hard delete
  await payload.update({ collection: "posts", id: postId, data: { status: "removed" } });
  return NextResponse.json({ ok: true });
}
