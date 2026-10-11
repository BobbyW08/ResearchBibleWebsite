import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { profiles, courses, lessons, courseProgress } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import AccountProfileForm from "./account-profile-form";
import SignOutButton from "./sign-out-button";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/sign-in?returnTo=/account");

  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!profile) redirect("/welcome");

  const { checkout } = await searchParams;

  // Course progress summary
  const allCourses = await db.select().from(courses).where(eq(courses.isPublished, true));
  const progress = await Promise.all(
    allCourses.map(async (course) => {
      const [total, completed] = await Promise.all([
        db
          .select({ count: count() })
          .from(lessons)
          .where(eq(lessons.courseId, course.id))
          .then((r) => r[0]?.count ?? 0),
        db
          .select({ count: count() })
          .from(courseProgress)
          .innerJoin(lessons, eq(courseProgress.lessonId, lessons.id))
          .where(eq(courseProgress.userId, profile.id))
          .then((r) => r[0]?.count ?? 0),
      ]);
      return { course, total, completed };
    })
  );
  const startedCourses = progress.filter((p) => p.completed > 0);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
          {checkout === "success" && (
            <div className="mb-8 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-800">
              Payment successful. Your course access has been activated.
            </div>
          )}

          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {(profile.displayName || session.user.email || "?")[0].toUpperCase()}
            </div>
            <div>
              <p className="font-heading text-xl font-semibold text-foreground">
                {profile.displayName || "Unnamed"}
              </p>
              <p className="text-sm text-muted-foreground capitalize">{profile.userRole}</p>
              <p className="text-sm text-muted-foreground">
                Level {profile.level} &middot; {profile.totalPoints} points
              </p>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="font-heading text-lg font-medium mb-4">Edit profile</h2>
            <AccountProfileForm
              displayName={profile.displayName}
              bio={profile.bio ?? ""}
            />
          </section>

          {startedCourses.length > 0 && (
            <section className="mb-10">
              <h2 className="font-heading text-lg font-medium mb-4">Course progress</h2>
              <div className="flex flex-col gap-3">
                {startedCourses.map(({ course, total, completed }) => {
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                  return (
                    <div key={course.id} className="rounded-lg border border-border bg-background p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="font-medium text-foreground">{course.title}</p>
                        <span className="text-sm text-muted-foreground">
                          {completed}/{total} lessons ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <div className="pt-4">
            <SignOutButton />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
