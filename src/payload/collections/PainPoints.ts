import type { CollectionConfig } from "payload";

// Keep in sync with PAIN_POINT_ICONS in lib/pain-point-icons.ts.
const APPROVED_ICONS = [
  "Flame",
  "Smartphone",
  "Ear",
  "CloudLightning",
  "Moon",
  "Pencil",
  "Hand",
  "Clock",
  "Angry",
  "HeartCrack",
  "Globe",
  "TrendingUp",
];

export const PainPoints: CollectionConfig = {
  slug: "pain-points",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "featured", "_status"],
  },
  versions: { drafts: true },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL slug. Never change after first publish." },
    },
    { name: "tag", type: "text", required: true },
    { name: "title", type: "text", required: true },
    { name: "cardTeaser", type: "textarea" },
    { name: "headline", type: "text" },
    {
      name: "icon",
      type: "select",
      required: true,
      options: APPROVED_ICONS.map((name) => ({ label: name, value: name })),
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Site-owned. Bobby sets manually. Sync webhook never touches this field.",
      },
    },
    { name: "intro", type: "textarea", required: true },
    { name: "exampleScenario", type: "textarea" },
    { name: "whatHappening", type: "richText" },
    {
      name: "backfires",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
    {
      name: "tries",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "details", type: "textarea", required: true },
      ],
    },
    { name: "support", type: "textarea" },
    { name: "crisis", type: "checkbox", defaultValue: false },
    {
      name: "deepDive",
      type: "group",
      fields: [
        { name: "href", type: "text" },
        { name: "label", type: "text" },
      ],
    },
    {
      name: "related",
      type: "array",
      fields: [
        { name: "href", type: "text", required: true },
        { name: "label", type: "text", required: true },
      ],
    },
  ],
};
