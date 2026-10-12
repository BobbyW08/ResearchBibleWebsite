import type { CollectionConfig } from "payload";

export const InterestSignups: CollectionConfig = {
  slug: "interest-signups",
  dbName: "interest_signups_payload",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "source", "createdAt"],
    description: "Interest-signal signups from the services page waitlist widget.",
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => false,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "source",
      type: "text",
      required: true,
      admin: { description: "Which widget or offer captured this email (e.g. 'weekly-group')." },
    },
  ],
};
