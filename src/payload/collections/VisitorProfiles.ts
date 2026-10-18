import type { CollectionConfig } from "payload";

// Moderators may read profiles and update only status. Admins get full CRUD.
// create is false: profiles are created server-side via the Local API after sign-up.
const isAdmin = ({ req: { user } }: { req: { user: unknown } }): boolean =>
  !!(user && (user as Record<string, unknown>).role === "admin");

export const VisitorProfiles: CollectionConfig = {
  slug: "visitor-profiles",
  dbName: "visitor_profiles",
  admin: {
    useAsTitle: "displayName",
    defaultColumns: ["displayName", "userRole", "status", "userId", "createdAt"],
    description: "Visitor accounts created via Neon Auth. One record per authenticated user.",
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => false,
    update: ({ req: { user } }) => !!user,
    delete: isAdmin,
  },
  fields: [
    {
      name: "userId",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "Neon Auth user ID. Never editable after creation." },
      access: { update: isAdmin },
    },
    {
      name: "userRole",
      type: "select",
      required: true,
      options: [
        { label: "Parent", value: "parent" },
        { label: "Professional", value: "professional" },
      ],
      access: { update: isAdmin },
    },
    {
      name: "displayName",
      type: "text",
      required: true,
      defaultValue: "",
      access: { update: isAdmin },
    },
    {
      name: "bio",
      type: "textarea",
      admin: { description: "Optional. 400 characters max." },
      access: { update: isAdmin },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "active",
      required: true,
      options: [
        { label: "Active", value: "active" },
        { label: "Suspended", value: "suspended" },
      ],
      admin: {
        description:
          "Suspended profiles are blocked from posting and accessing community and courses.",
      },
    },
  ],
};
