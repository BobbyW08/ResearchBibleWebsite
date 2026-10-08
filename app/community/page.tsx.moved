import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { profiles, posts } from "@/lib/db/schema";
import { eq, or, desc } from "drizzle-orm";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import PostComposer from "./post-composer";
import PostCard from "./post-card";
import CommunityLeaderboard from "./community-leaderboard";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/sign-in?returnTo=/community");

  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!profile) redirect("/welcome");

  const feed = await db
    .select()
    .from(posts)
    .where(or(eq(posts.audience, profile.userRole), eq(posts.audience, "all" as never)))
    .orderBy(desc(posts.createdAt))
    .limit(30);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
            {/* Feed */}
            <div className="flex flex-col gap-6">
              <h1 className="font-heading text-2xl font-medium tracking-tight">
                Community
              </h1>
              <PostComposer audience={profile.userRole} />
              <div className="flex flex-col gap-4">
                {feed.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No posts yet. Be the first to share something.
                  </p>
                )}
                {feed.map((post) => (
                  <PostCard key={post.id} post={post} viewerId={profile.id} />
                ))}
              </div>
            </div>
            {/* Sidebar */}
            <aside className="flex flex-col gap-6">
              <div className="rounded-lg border border-border bg-background p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Your stats
                </p>
                <p className="mt-2 font-heading text-xl font-semibold text-foreground">
                  Level {profile.level}
                </p>
                <p className="text-sm text-muted-foreground">{profile.totalPoints} points</p>
              </div>
              <CommunityLeaderboard role={profile.userRole} currentUserId={profile.id} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
