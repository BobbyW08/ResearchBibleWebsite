import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  dbName: "community_posts",
  admin: {
    useAsTitle: "content",
    defaultColumns: ["content", "author", "audience", "commentsCount", "createdAt"],
    description: "Community posts. Author is a relationship to visitor-profiles.",
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => false,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
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
      name: "commentsCount",
      type: "number",
      defaultValue: 0,
      admin: { readOnly: true },
    },
  ],
};
