import type { GlobalConfig } from "payload";

const isAdmin = ({ req: { user } }: { req: { user: unknown } }) => !!user;

export const About: GlobalConfig = {
  slug: "about",
  access: { read: () => true, update: isAdmin },
  admin: { description: "Content for the /about-bobby page." },
  fields: [
    { name: "heroSubhead", type: "text" },
    {
      name: "credentialBadge",
      type: "text",
      admin: { description: 'Example: "CPRS · RI Board Certified"' },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Bobby headshot. Shows placeholder until uploaded." },
    },
    {
      name: "shortAboutParagraphs",
      type: "array",
      fields: [{ name: "paragraph", type: "textarea", required: true }],
    },
    { name: "cprsId", type: "text" },
    { name: "currentRole", type: "text" },
    { name: "training", type: "text" },
    { name: "prior", type: "text" },
    { name: "also", type: "text" },
  ],
};
