import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";
import { getCourse, getLessonsForCourse } from "@/lib/payload-courses";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { PageContainer } from "@/components/layout/page-container";

export const dynamic = "force-dynamic";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect(`/sign-in?returnTo=/courses/${slug}`);

  const payload = await getPayloadClient();

  const { docs: profileDocs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });
  if (!profileDocs[0]) redirect("/welcome");

  const course = await getCourse(slug);
  if (!course) notFound();

  const courseLessons = await getLessonsForCourse(course.id as string);

  const completedLessonIds = new Set(
    (
      await payload.find({
        collection: "lesson-progress",
        where: { userId: { equals: session.user.id } },
        limit: 1000,
      })
    ).docs.map((r) => r.lessonId as string)
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
          <PageContainer className="py-16 lg:py-20">
            <Link
              href="/courses"
              className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
            >
              &larr; All courses
            </Link>
            <h1 className="font-heading text-3xl font-medium tracking-tight">
              {course.title as string}
            </h1>
            {course.description && (
              <p className="mt-4 text-base text-muted-foreground">
                {course.description as string}
              </p>
            )}
          </PageContainer>
        </section>

        <section>
          <PageContainer className="py-12">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr]">
              <div>
                <p className="text-sm text-muted-foreground">
                  {courseLessons.length} lesson{courseLessons.length !== 1 ? "s" : ""}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {completedLessonIds.size} completed
                </p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-medium mb-6">Lessons</h2>
                {courseLessons.length === 0 && (
                  <p className="text-sm text-muted-foreground">No lessons published yet.</p>
                )}
                <ol className="flex flex-col gap-3">
                  {courseLessons.map((lesson, i) => {
                    const completed = completedLessonIds.has(lesson.id as string);
                    const gate = lesson.gateType as string;
                    return (
                      <li key={lesson.id as string}>
                        <Link
                          href={`/courses/${slug}/${lesson.slug}`}
                          className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-5 py-4 hover:border-primary transition-colors"
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-sm font-medium text-muted-foreground w-6 text-center">
                              {completed ? "✓" : i + 1}
                            </span>
                            <span className="text-base font-medium text-foreground">
                              {lesson.title as string}
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
            </div>
          </PageContainer>
        </section>
      </main>
      <Footer />
    </div>
  );
}
