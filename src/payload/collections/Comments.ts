import type { CollectionConfig } from "payload";

export const Comments: CollectionConfig = {
  slug: "comments",
  dbName: "community_comments",
  admin: {
    useAsTitle: "content",
    defaultColumns: ["content", "author", "post", "createdAt"],
    description: "Replies to community posts.",
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => false,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
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
    },
  ],
};
