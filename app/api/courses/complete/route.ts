import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";
import { getCourse, getLessonsForCourse } from "@/lib/payload-courses";

/**
 * POST /api/courses/complete
 * Body: { courseSlug: string; lessonId: string }
 *
 * Idempotent mark-complete. Returns the next lesson slug, or null when the
 * lesson is the last one. Also enrolls the user in the course if not already.
 *
 * GAMIFICATION SEAM: when a lesson is newly completed, emit an event here for
 * the future points/badge engine (e.g. call onLessonComplete(userId, lessonId))
 * before returning. Do not implement it now.
 */
export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { courseSlug, lessonId } = body ?? {};
  if (!courseSlug || !lessonId) {
    return NextResponse.json({ error: "courseSlug and lessonId are required" }, { status: 400 });
  }

  const course = await getCourse(courseSlug as string);
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const payload = await getPayloadClient();
  const userId = session.user.id;

  // Ensure enrollment record exists (auto-enroll on completion)
  const { docs: enrollmentDocs } = await payload.find({
    collection: "enrollments",
    where: {
      and: [{ userId: { equals: userId } }, { courseSlug: { equals: courseSlug } }],
    },
    limit: 1,
  });
  if (enrollmentDocs.length === 0) {
    try {
      await payload.create({
        collection: "enrollments",
        data: { userId, courseSlug: courseSlug as string, source: "free" },
      });
    } catch {
      // Race-safe: ignore unique conflict
    }
  }

  // Mark lesson complete (idempotent)
  const { docs: existing } = await payload.find({
    collection: "lesson-progress",
    where: {
      and: [{ userId: { equals: userId } }, { lessonId: { equals: lessonId } }],
    },
    limit: 1,
  });
  const isNew = existing.length === 0;
  if (isNew) {
    await payload.create({
      collection: "lesson-progress",
      data: { userId, lessonId: lessonId as string, completedAt: new Date().toISOString() },
    });

    // GAMIFICATION SEAM: emit lesson completion event here in the future.
    // Example: await onLessonComplete({ userId, lessonId, courseSlug })
  }

  // Determine next lesson
  const allLessons = await getLessonsForCourse(course.id as string);
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const nextLesson = currentIndex >= 0 ? allLessons[currentIndex + 1] ?? null : null;

  return NextResponse.json({
    ok: true,
    isNew,
    nextLessonSlug: nextLesson ? (nextLesson.slug as string) : null,
  });
}
