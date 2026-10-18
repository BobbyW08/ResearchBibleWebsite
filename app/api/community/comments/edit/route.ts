import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";

const EDIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * PATCH /api/community/comments/edit
 * Body: { commentId: string; content: string }
 */
export async function PATCH(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const commentId = body?.commentId as string | undefined;
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!commentId || !content) {
    return NextResponse.json({ error: "commentId and content are required" }, { status: 400 });
  }
  if (content.length > 1000) return NextResponse.json({ error: "Content too long" }, { status: 400 });

  const payload = await getPayloadClient();

  const { docs: profileDocs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });
  if (!profileDocs[0]) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { docs: commentDocs } = await payload.find({
    collection: "comments",
    where: { id: { equals: commentId } },
    limit: 1,
  });
  const comment = commentDocs[0];
  if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

  const authorId =
    typeof comment.author === "object" && comment.author !== null
      ? (comment.author as { id: string }).id
      : comment.author;
  if (authorId !== (profileDocs[0].id as string)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const createdAt = new Date(comment.createdAt as string).getTime();
  if (Date.now() - createdAt > EDIT_WINDOW_MS) {
    return NextResponse.json({ error: "Edit window expired" }, { status: 403 });
  }

  await payload.update({ collection: "comments", id: commentId, data: { content } });
  return NextResponse.json({ ok: true });
}

/**
 * DELETE /api/community/comments/edit
 * Body: { commentId: string }
 */
export async function DELETE(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const commentId = body?.commentId as string | undefined;
  if (!commentId) return NextResponse.json({ error: "commentId is required" }, { status: 400 });

  const payload = await getPayloadClient();

  const { docs: profileDocs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });
  if (!profileDocs[0]) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { docs: commentDocs } = await payload.find({
    collection: "comments",
    where: { id: { equals: commentId } },
    limit: 1,
  });
  const comment = commentDocs[0];
  if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

  const authorId =
    typeof comment.author === "object" && comment.author !== null
      ? (comment.author as { id: string }).id
      : comment.author;
  if (authorId !== (profileDocs[0].id as string)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const createdAt = new Date(comment.createdAt as string).getTime();
  if (Date.now() - createdAt > EDIT_WINDOW_MS) {
    return NextResponse.json({ error: "Delete window expired" }, { status: 403 });
  }

  await payload.update({ collection: "comments", id: commentId, data: { status: "removed" } });
  return NextResponse.json({ ok: true });
}
