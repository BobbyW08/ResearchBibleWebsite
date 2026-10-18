import type { GlobalConfig } from "payload";

const isAdmin = ({ req: { user } }: { req: { user: unknown } }) => !!user;

export const Footer: GlobalConfig = {
  slug: "footer",
  access: { read: () => true, update: isAdmin },
  fields: [
    { name: "tagline", type: "text" },
    { name: "contactEmail", type: "email" },
    {
      name: "copyrightText",
      type: "textarea",
      admin: {
        description:
          "Includes CPRS certification, nonclinical disclaimer, and any other footer legal copy.",
      },
    },
  ],
};
