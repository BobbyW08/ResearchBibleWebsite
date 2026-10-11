import type { CollectionConfig } from "payload";

export const DeepDives: CollectionConfig = {
  slug: "deep-dives",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "pillar", "_status"],
    description: "36 parent-facing topic pages at /docs/[slug].",
  },
  versions: { drafts: true },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "title", type: "text", required: true },
    {
      name: "pillar",
      type: "select",
      required: true,
      options: [
        { label: "Stabilize", value: "stabilize" },
        { label: "Connect", value: "connect" },
        { label: "Structure", value: "structure" },
        { label: "Adapt", value: "adapt" },
      ],
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Used for the topic card on /docs and SEO meta description.",
      },
    },
    { name: "body", type: "richText", required: true },
    { name: "noindex", type: "checkbox", defaultValue: false },
  ],
};
