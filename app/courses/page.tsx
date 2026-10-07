import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { profiles, courses, lessons } from "@/lib/db/schema";
import { eq, asc, count } from "drizzle-orm";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/sign-in?returnTo=/courses");

  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!profile) redirect("/welcome");

  const allCourses = await db
    .select()
    .from(courses)
    .where(
      eq(courses.isPublished, true)
    )
    .orderBy(asc(courses.sortOrder));

  const visibleCourses = allCourses.filter(
    (c) => c.audience === "all" || c.audience === profile.userRole
  );

  const lessonCounts = await Promise.all(
    visibleCourses.map((c) =>
      db
        .select({ count: count() })
        .from(lessons)
        .where(eq(lessons.courseId, c.id))
        .then((r) => ({ courseId: c.id, count: r[0]?.count ?? 0 }))
    )
  );
  const countMap = Object.fromEntries(lessonCounts.map((r) => [r.courseId, r.count]));

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8 lg:py-20">
            <h1 className="font-heading text-3xl font-medium tracking-tight">Courses</h1>
            <p className="mt-4 text-base text-muted-foreground">
              Structured learning on parenting topics. Work through at your own pace.
            </p>
          </div>
        </section>
        <section>
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
            {visibleCourses.length === 0 && (
              <p className="text-base text-muted-foreground">No courses available yet. Check back soon.</p>
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {visibleCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <Card className="h-full hover:border-primary transition-colors">
                    <CardContent className="flex flex-col gap-3 px-6 py-6">
                      <h2 className="font-heading text-lg font-medium text-foreground">
                        {course.title}
                      </h2>
                      {course.description && (
                        <p className="text-sm text-muted-foreground">{course.description}</p>
                      )}
                      <p className="text-xs font-medium text-muted-foreground">
                        {countMap[course.id] ?? 0} lesson
                        {(countMap[course.id] ?? 0) !== 1 ? "s" : ""}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
