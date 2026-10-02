import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { profiles, posts, comments } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import CommentComposer from "./comment-composer";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect(`/sign-in?returnTo=/community/post/${id}`);

  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!profile) redirect("/welcome");

  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!post) notFound();

  const postComments = await db
    .select()
    .from(comments)
    .where(eq(comments.postId, id))
    .orderBy(asc(comments.createdAt));

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
          <div className="rounded-lg border border-border bg-background p-6 mb-8">
            <p className="text-base leading-relaxed text-foreground">{post.content}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {post.likesCount} like{post.likesCount !== 1 ? "s" : ""}
            </p>
          </div>

          <h2 className="font-heading text-lg font-medium mb-4">
            {postComments.length} comment{postComments.length !== 1 ? "s" : ""}
          </h2>

          <div className="flex flex-col gap-4 mb-8">
            {postComments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border border-border bg-muted/30 px-5 py-4"
              >
                <p className="text-sm leading-relaxed text-foreground">{comment.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {comment.likesCount} like{comment.likesCount !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>

          <CommentComposer postId={id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
