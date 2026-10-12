import type { CollectionConfig } from "payload";

export const Reports: CollectionConfig = {
  slug: "reports",
  dbName: "community_reports",
  admin: {
    useAsTitle: "targetId",
    defaultColumns: ["targetType", "targetId", "reporterUserId", "status", "createdAt"],
    description: "Community moderation reports. Review and dismiss from here.",
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => false,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: "reporterUserId",
      type: "text",
      required: true,
      admin: { description: "Neon Auth user ID of the person who submitted the report." },
    },
    {
      name: "targetType",
      type: "select",
      required: true,
      options: [
        { label: "Post", value: "post" },
        { label: "Comment", value: "comment" },
      ],
    },
    {
      name: "targetId",
      type: "text",
      required: true,
      admin: { description: "Payload document ID of the reported post or comment." },
    },
    {
      name: "reason",
      type: "textarea",
      admin: { description: "Optional reason text provided by the reporter." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Reviewed", value: "reviewed" },
        { label: "Dismissed", value: "dismissed" },
      ],
    },
  ],
};
