import type { CollectionConfig } from "payload";

const isAdmin = ({ req: { user } }: { req: { user: unknown } }) => !!user;

export const Courses: CollectionConfig = {
  slug: "courses",
  dbName: "payload_courses",
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "audience", "sortOrder", "_status"],
    description: "Course catalog. Lesson content is in the Lessons collection.",
    preview: (doc) => `/courses/${doc.slug}`,
  },
  versions: { drafts: true },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Cover image shown on the course listing page." },
    },
    {
      name: "audience",
      type: "select",
      required: true,
      defaultValue: "all",
      options: [
        { label: "Parents", value: "parent" },
        { label: "Professionals", value: "professional" },
        { label: "Both", value: "all" },
      ],
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      admin: { description: "Controls display order on the course listing page." },
    },
  ],
};
