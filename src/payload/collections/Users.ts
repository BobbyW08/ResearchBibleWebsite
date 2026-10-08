import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    description: "Admin panel users only. Separate from site visitor accounts (Neon Auth).",
  },
  auth: true,
  fields: [{ name: "name", type: "text" }],
};
