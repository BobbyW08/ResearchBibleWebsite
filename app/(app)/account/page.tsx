import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";
import { getAllCourses, getLessonsForCourse } from "@/lib/payload-courses";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { PageContainer } from "@/components/layout/page-container";
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

  const payload = await getPayloadClient();

  const { docs: profileDocs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });
  const profile = profileDocs[0] ?? null;
  if (!profile) redirect("/welcome");

  const { checkout } = await searchParams;

  const allCourses = await getAllCourses().catch(() => []);
  const progress = await Promise.all(
    allCourses.map(async (course) => {
      const lessons = await getLessonsForCourse(course.id as string).catch(() => []);
      const { totalDocs: completed } = await payload.find({
        collection: "lesson-progress",
        where: {
          and: [
            { userId: { equals: session.user.id } },
            {
              lessonId: {
                in: lessons.map((l) => l.id as string),
              },
            },
          ],
        },
        limit: 0,
      });
      return { course, total: lessons.length, completed };
    })
  );
  const startedCourses = progress.filter((p) => p.completed > 0);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <PageContainer className="py-12">
          {checkout === "success" && (
            <div className="mb-8 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-800">
              Payment successful. Your course access has been activated.
            </div>
          )}

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Left: profile header + edit */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {((profile.displayName as string) || session.user.email || "?")[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-heading text-xl font-semibold text-foreground">
                    {(profile.displayName as string) || "Unnamed"}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {profile.userRole as string}
                  </p>
                </div>
              </div>

              <section>
                <h2 className="font-heading text-lg font-medium mb-4">Edit profile</h2>
                <AccountProfileForm
                  displayName={(profile.displayName as string) ?? ""}
                  bio={(profile.bio as string) ?? ""}
                />
              </section>

              <div className="pt-2">
                <SignOutButton />
              </div>
            </div>

            {/* Right: course progress */}
            {startedCourses.length > 0 && (
              <section>
                <h2 className="font-heading text-lg font-medium mb-4">Course progress</h2>
                <div className="flex flex-col gap-3">
                  {startedCourses.map(({ course, total, completed }) => {
                    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                    return (
                      <div
                        key={course.id as string}
                        className="rounded-lg border border-border bg-background p-4"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <p className="font-medium text-foreground">{course.title as string}</p>
                          <span className="text-sm text-muted-foreground">
                            {completed}/{total} ({pct}%)
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
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
