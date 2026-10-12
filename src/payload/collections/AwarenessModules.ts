import type { CollectionConfig } from "payload";

const isAdmin = ({ req: { user } }: { req: { user: unknown } }) => !!user;

export const AwarenessModules: CollectionConfig = {
  slug: "awareness-modules",
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "_status"],
    description: "Current entries: modern, mentalhealth.",
  },
  versions: { drafts: true },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "tag", type: "text", required: true },
    { name: "title", type: "text", required: true },
    { name: "cardTeaser", type: "textarea" },
    { name: "headline", type: "text" },
    {
      name: "icon",
      type: "text",
      admin: { description: "Lucide icon name string, same approved list as pain points." },
    },
    { name: "intro", type: "textarea" },
    {
      name: "sections",
      type: "array",
      fields: [
        { name: "heading", type: "text", required: true },
        { name: "body", type: "richText" },
      ],
    },
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
