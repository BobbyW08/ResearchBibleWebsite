import type { CollectionConfig } from "payload";

export const Entitlements: CollectionConfig = {
  slug: "entitlements",
  dbName: "visitor_entitlements",
  admin: {
    useAsTitle: "userId",
    defaultColumns: ["userId", "productId", "expiresAt", "createdAt"],
    description: "Course access grants. Set by Stripe webhook or manually by Bobby.",
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: "userId",
      type: "text",
      required: true,
      index: true,
      admin: { description: "Neon Auth user ID." },
    },
    {
      name: "productId",
      type: "text",
      required: true,
      index: true,
      admin: { description: "Course slug or Stripe product ID that this entitlement grants access to." },
    },
    {
      name: "expiresAt",
      type: "date",
      admin: { description: "Leave blank for a permanent grant." },
    },
  ],
};
