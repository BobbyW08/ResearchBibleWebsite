import type { CollectionConfig } from "payload";

const isAdmin = ({ req: { user } }: { req: { user: unknown } }) => !!user;

export const Enrollments: CollectionConfig = {
  slug: "enrollments",
  dbName: "course_enrollments",
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: "userId",
    defaultColumns: ["userId", "courseSlug", "source", "createdAt"],
    description: "Course enrollment records. Created automatically on first lesson view for free courses, or manually by Bobby for paid access.",
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
      name: "courseSlug",
      type: "text",
      required: true,
      index: true,
      admin: { description: "The course slug." },
    },
    {
      name: "source",
      type: "select",
      required: true,
      defaultValue: "free",
      options: [
        { label: "Free (auto-enrolled)", value: "free" },
        { label: "Admin grant", value: "admin" },
      ],
    },
  ],
};
