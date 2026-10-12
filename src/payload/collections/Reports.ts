import type { CollectionConfig } from "payload";

const isAdmin = ({ req: { user } }: { req: { user: unknown } }) => !!user;

const REASONS = [
  { label: "Harassment or bullying", value: "harassment" },
  { label: "Hate speech", value: "hate_speech" },
  { label: "Spam or self-promotion", value: "spam" },
  { label: "Sharing personal information", value: "privacy" },
  { label: "Misinformation", value: "misinformation" },
  { label: "Other", value: "other" },
];

export const Reports: CollectionConfig = {
  slug: "reports",
  dbName: "community_reports",
  access: {
    read: isAdmin,
    create: () => false,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: "targetId",
    defaultColumns: ["targetType", "targetId", "reason", "status", "createdAt"],
    description: "Community moderation reports. Set status to actioned or dismissed after reviewing.",
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
      type: "select",
      required: true,
      options: REASONS,
    },
    {
      name: "note",
      type: "textarea",
      admin: { description: "Optional additional detail provided by the reporter." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "open",
      options: [
        { label: "Open", value: "open" },
        { label: "Actioned", value: "actioned" },
        { label: "Dismissed", value: "dismissed" },
      ],
    },
    {
      name: "resolvedAt",
      type: "date",
      admin: { description: "Set when status changes from open." },
    },
  ],
};
