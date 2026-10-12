import type { CollectionConfig } from "payload";

export const VisitorProfiles: CollectionConfig = {
  slug: "visitor-profiles",
  dbName: "visitor_profiles",
  admin: {
    useAsTitle: "displayName",
    defaultColumns: ["displayName", "userRole", "userId", "createdAt"],
    description: "Visitor accounts created via Neon Auth. One record per authenticated user.",
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
      unique: true,
      index: true,
      admin: { description: "Neon Auth user ID. Never editable after creation." },
    },
    {
      name: "userRole",
      type: "select",
      required: true,
      options: [
        { label: "Parent", value: "parent" },
        { label: "Professional", value: "professional" },
      ],
    },
    {
      name: "displayName",
      type: "text",
      required: true,
      defaultValue: "",
    },
    {
      name: "bio",
      type: "textarea",
      admin: { description: "Optional. 400 characters max." },
    },
  ],
};
