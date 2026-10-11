import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import {
  profiles,
  courses,
  lessons,
  courseProgress,
  entitlements,
  pointsLedger,
} from "@/lib/db/schema";
import { eq, and, or, isNull, gt, sql } from "drizzle-orm";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { renderBibleBody } from "@/lib/research-bibles/render-mdx";
import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

async function completeLessonIfNeeded(profileId: string, lessonId: string, points: number) {
  const existing = await db
    .select({ lessonId: courseProgress.lessonId })
    .from(courseProgress)
    .where(and(eq(courseProgress.userId, profileId), eq(courseProgress.lessonId, lessonId)))
    .limit(1);

  if (existing.length > 0) return;

  await db.insert(courseProgress).values({ userId: profileId, lessonId });
  await db.insert(pointsLedger).values({
    userId: profileId,
    action: "lesson_completed",
    pointsDelta: points,
    refType: "lesson",
    refId: lessonId,
  });
  const { levelFromPoints } = await import("@/lib/level-thresholds");
  await db
    .update(profiles)
    .set({
      totalPoints: sql`${profiles.totalPoints} + ${points}`,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, profileId));
  const updated = await db
    .select({ totalPoints: profiles.totalPoints })
    .from(profiles)
    .where(eq(profiles.id, profileId))
    .limit(1)
    .then((r) => r[0]);
  if (updated) {
    await db
      .update(profiles)
      .set({ level: levelFromPoints(updated.totalPoints), updatedAt: new Date() })
      .where(eq(profiles.id, profileId));
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; "lesson-slug": string }>;
}) {
  const { slug, "lesson-slug": lessonSlug } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect(`/sign-in?returnTo=/courses/${slug}/${lessonSlug}`);

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

  const lesson = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.courseId, course.id), eq(lessons.slug, lessonSlug), eq(lessons.isPublished, true)))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!lesson) notFound();

  // Gate check
  if (lesson.gateType === "paid") {
    const entitled = await db
      .select({ id: entitlements.id })
      .from(entitlements)
      .where(
        and(
          eq(entitlements.userId, profile.id),
          eq(entitlements.productId, course.slug),
          or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, new Date()))
        )
      )
      .limit(1);

    if (entitled.length === 0) {
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

  if (lesson.gateType === "level") {
    const minLevel = lesson.gateMinLevel ?? 2;
    if (profile.level < minLevel) {
      return (
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
            <h1 className="font-heading text-2xl font-medium">Unlock at Level {minLevel}</h1>
            <p className="mt-3 text-base text-muted-foreground max-w-sm">
              You are Level {profile.level}. Earn points by posting, commenting, and having your
              posts liked to level up.
            </p>
            <Link href="/community" className="mt-6 text-sm font-medium text-primary hover:underline">
              Go to the community
            </Link>
          </main>
          <Footer />
        </div>
      );
    }
  }

  // Mark lesson complete (best-effort, non-blocking)
  try {
    await completeLessonIfNeeded(profile.id, lesson.id, 5);
  } catch {
    // non-fatal
  }

  // Render lesson content
  let content: import("react").ReactNode = null;
  try {
    const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), lesson.contentPath);
    const raw = await fs.readFile(filePath, "utf-8");
    content = await renderBibleBody(raw);
  } catch {
    content = null;
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
          <Link
            href={`/courses/${slug}`}
            className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
          >
            &larr; Back to {course.title}
          </Link>
          <h1 className="font-heading text-3xl font-medium tracking-tight mb-8">
            {lesson.title}
          </h1>
          {content ? (
            <article className="prose prose-sm max-w-none">{content}</article>
          ) : (
            <p className="text-muted-foreground">Content not yet available.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
