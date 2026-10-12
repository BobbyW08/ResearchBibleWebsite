import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await getPayloadClient();

  const { docs: profileDocs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });
  const profile = profileDocs[0] ?? null;
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const postId = body?.postId as string | undefined;
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!postId || !content) {
    return NextResponse.json({ error: "postId and content are required" }, { status: 400 });
  }
  if (content.length > 1000) return NextResponse.json({ error: "Comment too long" }, { status: 400 });

  const { docs: postDocs } = await payload.find({
    collection: "posts",
    where: { id: { equals: postId } },
    limit: 1,
  });
  if (!postDocs[0]) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  const post = postDocs[0];

  const comment = await payload.create({
    collection: "comments",
    data: { post: postId, author: profile.id as string, content },
  });

  const currentCount = typeof post.commentsCount === "number" ? post.commentsCount : 0;
  await payload.update({
    collection: "posts",
    id: postId,
    data: { commentsCount: currentCount + 1 },
  });

  return NextResponse.json(comment, { status: 201 });
}
