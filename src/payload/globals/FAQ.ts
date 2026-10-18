import type { GlobalConfig } from "payload";

const isAdmin = ({ req: { user } }: { req: { user: unknown } }) => !!user;

export const FAQ: GlobalConfig = {
  slug: "faq",
  access: { read: () => true, update: isAdmin },
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
