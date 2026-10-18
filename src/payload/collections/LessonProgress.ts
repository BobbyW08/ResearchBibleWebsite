import type { CollectionConfig } from "payload";

export const LessonProgress: CollectionConfig = {
  slug: "lesson-progress",
  dbName: "lesson_progress",
  admin: {
    useAsTitle: "lessonId",
    defaultColumns: ["userId", "lessonId", "completedAt"],
    description: "Records when a visitor completes a lesson.",
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => false,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: "userId",
      type: "text",
      required: true,
      index: true,
      admin: { description: "Neon Auth user ID." },
    },
    {
      name: "lessonId",
      type: "text",
      required: true,
      index: true,
      admin: { description: "Payload Lessons document ID." },
    },
    {
      name: "completedAt",
      type: "date",
      required: true,
      admin: { description: "UTC timestamp set server-side on completion." },
    },
  ],
};
