import type { CollectionConfig } from "payload";

const isAdmin = ({ req: { user } }: { req: { user: unknown } }) => !!user;

export const Comments: CollectionConfig = {
  slug: "comments",
  dbName: "community_comments",
  access: {
    read: isAdmin,
    create: () => false,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: "content",
    defaultColumns: ["content", "author", "post", "status", "createdAt"],
    description: "Replies to community posts.",
  },
  fields: [
    {
      name: "post",
      type: "relationship",
      relationTo: "posts",
      required: true,
    },
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
      admin: { description: "Max 1000 characters." },
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
        description: "Hidden and removed comments do not appear in the thread.",
      },
    },
  ],
};
