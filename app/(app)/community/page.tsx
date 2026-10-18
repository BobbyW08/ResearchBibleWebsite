import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import PostComposer from "./post-composer";
import PostCard from "./post-card";

export const metadata: Metadata = {
  title: "Community",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/sign-in?returnTo=/community");

  const payload = await getPayloadClient();

  const { docs: profileDocs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });
  const profile = profileDocs[0] ?? null;
  if (!profile) redirect("/welcome");

  const { docs: feed } = await payload.find({
    collection: "posts",
    where: {
      and: [
        {
          or: [
            { audience: { equals: profile.userRole as string } },
            { audience: { equals: "all" } },
          ],
        },
        { status: { equals: "visible" } },
      ],
    },
    sort: "-createdAt",
    limit: 30,
  });

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8 lg:max-w-5xl">
          <div className="flex flex-col gap-6">
            <h1 className="font-heading text-2xl font-medium tracking-tight">
              Community
            </h1>
            <PostComposer audience={profile.userRole as string} />
            <div className="flex flex-col gap-4">
              {feed.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No posts yet. Be the first to share something.
                </p>
              )}
              {feed.map((post) => (
                <PostCard
                  key={post.id as string}
                  post={{
                    id: post.id as string,
                    content: post.content as string,
                    commentsCount: (post.commentsCount as number) ?? 0,
                    createdAt: post.createdAt as string,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
