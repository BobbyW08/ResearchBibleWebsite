import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { profiles, courses, lessons, courseProgress } from "@/lib/db/schema";
import { eq, asc, and } from "drizzle-orm";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";

export const dynamic = "force-dynamic";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect(`/sign-in?returnTo=/courses/${slug}`);

  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!profile) redirect("/welcome");

  const course = await db
    .select()
    .from(courses)
    .where(and(eq(courses.slug, slug), eq(courses.isPublished, true)))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!course) notFound();

  const courseLessons = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.courseId, course.id), eq(lessons.isPublished, true)))
    .orderBy(asc(lessons.sortOrder));

  const completedIds = new Set(
    await db
      .select({ lessonId: courseProgress.lessonId })
      .from(courseProgress)
      .where(eq(courseProgress.userId, profile.id))
      .then((rows) => rows.map((r) => r.lessonId))
  );

  const gateLabel: Record<string, string> = {
    free: "",
    paid: "Paid",
    level: "Level locked",
  };

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:py-20">
            <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
              &larr; All courses
            </Link>
            <h1 className="font-heading text-3xl font-medium tracking-tight">{course.title}</h1>
            {course.description && (
              <p className="mt-4 text-base text-muted-foreground">{course.description}</p>
            )}
          </div>
        </section>
        <section>
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
            <h2 className="font-heading text-xl font-medium mb-6">Lessons</h2>
            {courseLessons.length === 0 && (
              <p className="text-sm text-muted-foreground">No lessons published yet.</p>
            )}
            <ol className="flex flex-col gap-3">
              {courseLessons.map((lesson, i) => {
                const completed = completedIds.has(lesson.id);
                const gate = lesson.gateType;
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/courses/${slug}/${lesson.slug}`}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-5 py-4 hover:border-primary transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6 text-center">
                          {completed ? "✓" : i + 1}
                        </span>
                        <span className="text-base font-medium text-foreground">
                          {lesson.title}
                        </span>
                      </span>
                      {gate !== "free" && (
                        <span className="shrink-0 text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {gate === "level"
                            ? `Level ${lesson.gateMinLevel}+`
                            : gateLabel[gate]}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
