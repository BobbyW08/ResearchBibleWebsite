import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";
import { getCourse, getLesson, getLessonsForCourse } from "@/lib/payload-courses";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { PageContainer } from "@/components/layout/page-container";
import { RichText } from "@payloadcms/richtext-lexical/react";

export const dynamic = "force-dynamic";

async function markLessonComplete(userId: string, lessonId: string) {
  const payload = await getPayloadClient();
  const { docs: existing } = await payload.find({
    collection: "lesson-progress",
    where: {
      and: [{ userId: { equals: userId } }, { lessonId: { equals: lessonId } }],
    },
    limit: 1,
  });
  if (existing.length > 0) return;
  await payload.create({
    collection: "lesson-progress",
    data: { userId, lessonId, completedAt: new Date().toISOString() },
  });
}

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
            <h1 className="font-heading text-2xl font-medium">This lesson is paid</h1>
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

  // Level gate is on hold (gamification backlogged) — lessons always accessible.

  try {
    await markLessonComplete(session.user.id, lesson.id as string);
  } catch {
    // non-fatal
  }

  const allLessons = await getLessonsForCourse(course.id as string);

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
              <h1 className="font-heading text-3xl font-medium tracking-tight mb-8">
                {lesson.title as string}
              </h1>
              {lesson.body ? (
                <article className="prose prose-sm max-w-none">
                  <RichText data={lesson.body} />
                </article>
              ) : (
                <p className="text-muted-foreground">Content not yet available.</p>
              )}
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
