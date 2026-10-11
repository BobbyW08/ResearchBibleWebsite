import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
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
