import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role"],
    description: "Admin panel users only. Separate from site visitor accounts (Neon Auth).",
  },
  auth: true,
  fields: [
    { name: "name", type: "text" },
    {
      name: "role",
      type: "select",
      defaultValue: "moderator",
      required: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Moderator", value: "moderator" },
      ],
      admin: {
        description:
          "Admins have full access. Moderators can read/update posts, comments, reports and set profile status only.",
      },
    },
  ],
};
