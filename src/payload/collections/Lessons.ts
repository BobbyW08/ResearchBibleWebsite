import type { CollectionConfig } from "payload";

export const Lessons: CollectionConfig = {
  slug: "lessons",
  dbName: "payload_lessons",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "course", "gateType", "sortOrder", "_status"],
    description: "Lesson content and gate settings. Progress tracked separately in Drizzle.",
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
      name: "gateType",
      type: "select",
      required: true,
      defaultValue: "free",
      options: [
        { label: "Free", value: "free" },
        { label: "Paid (requires entitlement)", value: "paid" },
        { label: "Level-locked", value: "level" },
      ],
      admin: {
        description:
          "All new lessons default to free. Change to paid or level only when content is ready to gate.",
      },
    },
    {
      name: "gateMinLevel",
      type: "number",
      admin: {
        description:
          'Only used when gateType is "level". Minimum profile level required to access this lesson.',
        condition: (data) => data.gateType === "level",
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
