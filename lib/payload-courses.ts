import { getPayloadClient } from "./payload-client";

export async function getCourse(slug: string) {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "courses",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return docs[0] ?? null;
}

export async function getAllCourses() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "courses",
    where: { _status: { equals: "published" } },
    sort: "sortOrder",
    limit: 100,
  });
  return docs;
}

export async function getLesson(courseSlug: string, lessonSlug: string) {
  const payload = await getPayloadClient();
  const course = await getCourse(courseSlug);
  if (!course) return null;
  const { docs } = await payload.find({
    collection: "lessons",
    where: {
      and: [
        { course: { equals: course.id } },
        { slug: { equals: lessonSlug } },
        { _status: { equals: "published" } },
      ],
    },
    limit: 1,
  });
  return docs[0] ?? null;
}

export async function getLessonsForCourse(courseId: string) {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "lessons",
    where: {
      and: [
        { course: { equals: courseId } },
        { _status: { equals: "published" } },
      ],
    },
    sort: "sortOrder",
    limit: 200,
  });
  return docs;
}
