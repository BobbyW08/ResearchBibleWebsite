import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    description:
      "Subdomain and booking URL constants. Wiring these to lib/links.ts is a separate task.",
  },
  fields: [
    {
      name: "substackSubdomain",
      type: "text",
      admin: { description: "Substack subdomain only, no https://. Example: roughlyeducated" },
    },
    {
      name: "calComUrl",
      type: "text",
      admin: {
        description: "Full Cal.com booking URL. Example: https://cal.com/bobby-washburn/intro-call",
      },
    },
  ],
};
