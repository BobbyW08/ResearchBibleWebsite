import type { CollectionConfig } from "payload";

const isAdmin = ({ req: { user } }: { req: { user: unknown } }) => !!user;

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: { useAsTitle: "attribution" },
  fields: [
    { name: "quote", type: "textarea", required: true },
    {
      name: "attribution",
      type: "text",
      required: true,
      admin: {
        description: 'Short non-identifying descriptor. Example: "Mom of 12 yr old boy, RI".',
      },
    },
  ],
};
