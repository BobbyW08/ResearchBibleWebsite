import type { GlobalConfig } from "payload";

export const FAQ: GlobalConfig = {
  slug: "faq",
  admin: { description: "FAQ section on the homepage. Drag rows to reorder." },
  fields: [
    {
      name: "items",
      type: "array",
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
  ],
};
