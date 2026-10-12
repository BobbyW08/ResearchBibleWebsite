import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";
import Link from "next/link";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import CommentComposer from "./comment-composer";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect(`/sign-in?returnTo=/community/post/${id}`);

  const payload = await getPayloadClient();

  const { docs: profileDocs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });
  const profile = profileDocs[0] ?? null;
  if (!profile) redirect("/welcome");

  const { docs: postDocs } = await payload.find({
    collection: "posts",
    where: { id: { equals: id } },
    limit: 1,
  });
  const post = postDocs[0] ?? null;
  if (!post) notFound();

  const { docs: postComments } = await payload.find({
    collection: "comments",
    where: { post: { equals: id } },
    sort: "createdAt",
    limit: 200,
  });

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8 lg:max-w-5xl">
          <div className="flex flex-col gap-6">
            <Link
              href="/community"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              &larr; Back to community
            </Link>

            <div className="rounded-lg border border-border bg-background p-6">
              <p className="text-base leading-relaxed text-foreground">{post.content as string}</p>
            </div>

            <h2 className="font-heading text-lg font-medium">
              {postComments.length} comment{postComments.length !== 1 ? "s" : ""}
            </h2>

            <div className="flex flex-col gap-4">
              {postComments.map((comment) => (
                <div
                  key={comment.id as string}
                  className="rounded-lg border border-border bg-muted/30 px-5 py-4"
                >
                  <p className="text-sm leading-relaxed text-foreground">{comment.content as string}</p>
                </div>
              ))}
            </div>

            <CommentComposer postId={id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
