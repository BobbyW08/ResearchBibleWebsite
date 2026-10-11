import type { CollectionConfig } from "payload";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
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
