import type { CollectionConfig } from "payload";

export const ResearchBibles: CollectionConfig = {
  slug: "research-bibles",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "version", "lastUpdated", "_status"],
    description: "Draft = awaiting Bobby review. Published = live at /research/[slug].",
  },
  versions: { drafts: true },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Set by sync webhook on first ingest. Never edit manually after that.",
      },
    },
    { name: "title", type: "text", required: true },
    {
      name: "version",
      type: "text",
      required: true,
      defaultValue: "1.0",
      admin: {
        description: "Managed by sync webhook. Do not edit manually.",
        readOnly: true,
      },
    },
    {
      name: "lastUpdated",
      type: "date",
      admin: { date: { pickerAppearance: "dayOnly" } },
    },
    {
      name: "tags",
      type: "array",
      admin: {
        description: "Site-owned. Bobby assigns manually. Sync webhook never touches this.",
      },
      fields: [{ name: "tag", type: "text", required: true }],
    },
    { name: "noindex", type: "checkbox", defaultValue: false },
    {
      name: "changelog",
      type: "array",
      admin: {
        description: "Prepended by sync webhook. Do not manually reorder existing entries.",
      },
      fields: [
        { name: "date", type: "date", required: true },
        { name: "summary", type: "text", required: true },
        {
          name: "prUrl",
          type: "text",
          admin: {
            description:
              "No longer populated. Kept for records migrated from the old GitHub PR flow.",
          },
        },
      ],
    },
    { name: "body", type: "richText", required: true },
  ],
};
