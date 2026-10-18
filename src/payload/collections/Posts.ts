import type { CollectionConfig } from "payload";

const isAdmin = ({ req: { user } }: { req: { user: unknown } }) => !!user;

export const Posts: CollectionConfig = {
  slug: "posts",
  dbName: "community_posts",
  access: {
    read: isAdmin,
    create: () => false,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: "content",
    defaultColumns: ["content", "author", "audience", "status", "commentsCount", "createdAt"],
    description: "Community posts. Status controls visibility in the feed.",
  },
  fields: [
    {
      name: "author",
      type: "relationship",
      relationTo: "visitor-profiles",
      required: true,
    },
    {
      name: "content",
      type: "textarea",
      required: true,
      admin: { description: "Max 2000 characters." },
    },
    {
      name: "audience",
      type: "select",
      required: true,
      defaultValue: "all",
      options: [
        { label: "Parents", value: "parent" },
        { label: "Professionals", value: "professional" },
        { label: "All members", value: "all" },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "visible",
      options: [
        { label: "Visible", value: "visible" },
        { label: "Hidden (moderator action)", value: "hidden" },
        { label: "Removed", value: "removed" },
      ],
      admin: {
        description: "Hidden and removed posts do not appear in the feed.",
      },
    },
    {
      name: "commentsCount",
      type: "number",
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: "isPinned",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Pinned posts appear at the top of the feed." },
    },
  ],
};
