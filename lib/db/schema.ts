import {
  pgSchema,
  pgTable,
  uuid,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

// Stub for the user table Neon Managed Better Auth owns and migrates itself
// (lives in the `neon_auth` Postgres schema). We only declare the columns we
// need to reference as a foreign key — never migrate this table ourselves.
const neonAuthSchema = pgSchema("neon_auth");
export const user = neonAuthSchema.table("user", {
  id: uuid("id").primaryKey(),
});

// Our own app data, in the default `public` schema, FK'd to the managed
// auth user id. Deliberately kept separate from Better Auth's own `role`
// column, which controls admin/permission level, not this business field.
export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  accountType: text("account_type", { enum: ["parent", "practitioner"] }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const topicProgress = pgTable(
  "topic_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    topicId: text("topic_id").notNull(),
    lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }).defaultNow().notNull(),
    completionState: text("completion_state", {
      enum: ["unstarted", "in-progress", "complete"],
    })
      .notNull()
      .default("unstarted"),
  },
  (table) => [unique().on(table.userId, table.topicId)],
);

// Pending content reviews — research bible changes staged for approval
export const pendingReviews = pgTable("pending_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  topic: text("topic").notNull(),
  status: text("status", {
    enum: ["pending_review", "approved", "rejected", "published"],
  })
    .notNull()
    .default("pending_review"),
  generatedMdx: text("generated_mdx").notNull(),
  generatedJson: text("generated_json").notNull(),
  changedSections: text("changed_sections").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  approvedBy: uuid("approved_by").references(() => user.id, { onDelete: "set null" }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});