import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";
import { getCourse, getLesson, getLessonsForCourse } from "@/lib/payload-courses";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { PageContainer } from "@/components/layout/page-container";
import { RichText } from "@payloadcms/richtext-lexical/react";
import MarkCompleteButton from "./mark-complete-button";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; "lesson-slug": string }>;
}) {
  const { slug, "lesson-slug": lessonSlug } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect(`/sign-in?returnTo=/courses/${slug}/${lessonSlug}`);

  const payload = await getPayloadClient();

  const { docs: profileDocs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });
  if (!profileDocs[0]) redirect("/welcome");
  if ((profileDocs[0].status as string) === "suspended") redirect("/sign-in?error=suspended");

  const course = await getCourse(slug);
  if (!course) notFound();

  const lesson = await getLesson(slug, lessonSlug);
  if (!lesson) notFound();

  // Paid gate: check entitlement
  if ((lesson.gateType as string) === "paid") {
    const { docs: entitlements } = await payload.find({
      collection: "entitlements",
      where: {
        and: [
          { userId: { equals: session.user.id } },
          { productId: { equals: course.slug as string } },
        ],
      },
      limit: 1,
    });
    const now = new Date();
    const active = entitlements.filter(
      (e) => !e.expiresAt || new Date(e.expiresAt as string) > now
    );
    if (active.length === 0) {
      return (
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
            <h1 className="font-heading text-2xl font-medium">This lesson requires access</h1>
            <p className="mt-3 text-base text-muted-foreground max-w-sm">
              Purchase this course to access this lesson and all others in the series.
            </p>
            <Link
              href={`/courses/${slug}#purchase`}
              className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/80 transition"
            >
              Unlock this course
            </Link>
          </main>
          <Footer />
        </div>
      );
    }
  }

  // Level gate is on hold — always accessible.

  // Check if already completed
  const { docs: progressDocs } = await payload.find({
    collection: "lesson-progress",
    where: {
      and: [
        { userId: { equals: session.user.id } },
        { lessonId: { equals: lesson.id as string } },
      ],
    },
    limit: 1,
  });
  const isCompleted = progressDocs.length > 0;

  const allLessons = await getLessonsForCourse(course.id as string);
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = currentIndex >= 0 ? allLessons[currentIndex + 1] ?? null : null;

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <PageContainer className="py-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr] lg:gap-14">
            <div>
              <Link
                href={`/courses/${slug}`}
                className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
              >
                &larr; Back to {course.title as string}
              </Link>
              <h1 className="font-heading text-3xl font-medium tracking-tight mb-6">
                {lesson.title as string}
              </h1>

              {lesson.videoUrl && (
                <div className="mb-8 aspect-video w-full overflow-hidden rounded-lg bg-black">
                  <iframe
                    src={lesson.videoUrl as string}
                    title={lesson.title as string}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              )}

              {lesson.body ? (
                <article className="prose prose-sm max-w-none">
                  <RichText data={lesson.body} />
                </article>
              ) : (
                <p className="text-muted-foreground">Content not yet available.</p>
              )}

              <div className="mt-10 flex items-center gap-4">
                <MarkCompleteButton
                  courseSlug={slug}
                  lessonId={lesson.id as string}
                  isCompleted={isCompleted}
                  nextLessonSlug={nextLesson ? (nextLesson.slug as string) : null}
                  courseSlugForNext={slug}
                />
              </div>
            </div>

            <aside className="hidden lg:block">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                {course.title as string}
              </p>
              <ol className="flex flex-col gap-2">
                {allLessons.map((l, i) => (
                  <li key={l.id as string}>
                    <Link
                      href={`/courses/${slug}/${l.slug}`}
                      className={`block rounded px-3 py-2 text-sm transition-colors ${
                        l.id === lesson.id
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="mr-2 text-xs">{i + 1}.</span>
                      {l.title as string}
                    </Link>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
