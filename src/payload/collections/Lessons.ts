import type { CollectionConfig } from "payload";

const isAdmin = ({ req: { user } }: { req: { user: unknown } }) => !!user;

export const Lessons: CollectionConfig = {
  slug: "lessons",
  dbName: "payload_lessons",
  access: {
    // Gated lesson body must never be exposed through the public REST API.
    // All lesson reads go through the server-side Local API (payload-courses.ts)
    // which enforces the entitlement gate before rendering the body.
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "course", "gateType", "sortOrder", "_status"],
    description: "Lesson content and gate settings. Progress tracked in the LessonProgress collection.",
    preview: (doc) => {
      if (!doc.course || typeof doc.course !== "object") return null;
      const courseDoc = doc.course as { slug?: string };
      return courseDoc.slug ? `/courses/${courseDoc.slug}/${doc.slug}` : null;
    },
  },
  versions: { drafts: true },
  fields: [
    { name: "slug", type: "text", required: true },
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      required: true,
      admin: { description: "The course this lesson belongs to." },
    },
    { name: "title", type: "text", required: true },
    { name: "body", type: "richText", required: true },
    {
      name: "videoUrl",
      type: "text",
      admin: {
        description: "YouTube or Vimeo embed URL (optional). Shown above the lesson body.",
      },
    },
    {
      name: "gateType",
      type: "select",
      required: true,
      defaultValue: "free",
      options: [
        { label: "Free", value: "free" },
        { label: "Paid (requires entitlement)", value: "paid" },
      ],
      admin: {
        description:
          "All new lessons default to free. Change to paid only when content is ready to gate.",
      },
    },
    {
      name: "productKey",
      type: "text",
      admin: {
        description:
          'Required when gateType is "paid". Matches the productId stored in the Entitlements collection (e.g. course_behavior_foundations).',
        condition: (data) => data.gateType === "paid",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      admin: { description: "Controls display order within the course." },
    },
  ],
};
