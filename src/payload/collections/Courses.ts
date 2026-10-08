import type { CollectionConfig } from "payload";

export const Courses: CollectionConfig = {
  slug: "courses",
  dbName: "payload_courses",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "audience", "productKey", "_status"],
    description: "Course catalog. Lesson content is in the Lessons collection.",
  },
  versions: { drafts: true },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
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
      name: "productKey",
      type: "text",
      admin: {
        description:
          "Stripe product key from lib/stripe-products.ts. Leave blank for a free course.",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      admin: { description: "Controls display order on the course listing page." },
    },
  ],
};
