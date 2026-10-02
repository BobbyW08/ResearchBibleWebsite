import {
  pgSchema,
  pgTable,
  uuid,
  text,
  timestamp,
  unique,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// Stub for the user table Neon Managed auth owns (lives in neon_auth schema).
// Only declare columns we reference — never migrate this ourselves.
const neonAuthSchema = pgSchema("neon_auth");
export const user = neonAuthSchema.table("user", {
  id: uuid("id").primaryKey(),
});

// profiles_v1 is the old profiles table (renamed by migration 0003) — kept
// here as a stub so existing FK references in topic_progress / pending_reviews
// still resolve at the ORM level until those tables are updated.
export const profilesV1 = pgTable("profiles_v1", {
  userId: uuid("user_id").primaryKey(),
  accountType: text("account_type", { enum: ["parent", "practitioner"] }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Community-ready profiles table (replaces profiles_v1 via migration 0003).
// user_id is a string — Neon Auth may return non-uuid user IDs.
export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique(),
  userRole: text("user_role", { enum: ["parent", "professional"] }).notNull(),
  displayName: text("display_name").notNull().default(""),
  avatarUrl: text("avatar_url"),
  bio: text("bio").default(""),
  level: integer("level").notNull().default(1),
  totalPoints: integer("total_points").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
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

// Lightweight interest-signal capture (e.g. the Live Q&A "Show Interest"
// widget on /services — see components/marketing/services/interest-signup-widget.tsx).
// `source` labels which widget/offer captured the email so this one table can
// be reused elsewhere later without a schema change.
export const interestSignups = pgTable(
  "interest_signups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    source: text("source").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [unique().on(table.email, table.source)],
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

// ─── Community platform tables ───────────────────────────────────────────────

export const entitlements = pgTable(
  "entitlements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    productId: text("product_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (table) => [unique().on(table.userId, table.productId)],
);

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  isPublished: boolean("is_published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  audience: text("audience", { enum: ["parent", "professional", "all"] }).notNull().default("all"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(false),
  gateType: text("gate_type", { enum: ["free", "paid", "level"] }).notNull().default("free"),
  gateMinLevel: integer("gate_min_level"),
  contentPath: text("content_path").notNull().default(""),
  pointsOnComplete: integer("points_on_complete").notNull().default(5),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const courseProgress = pgTable(
  "course_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.lessonId)],
);

export const pointsLedger = pgTable("points_ledger", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  pointsDelta: integer("points_delta").notNull(),
  refType: text("ref_type"),
  refId: text("ref_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  audience: text("audience", { enum: ["parent", "professional", "all"] }).notNull().default("all"),
  likesCount: integer("likes_count").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  likesCount: integer("likes_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const likes = pgTable(
  "likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    targetType: text("target_type", { enum: ["post", "comment"] }).notNull(),
    targetId: uuid("target_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.targetType, table.targetId)],
);

export const postTags = pgTable(
  "post_tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (table) => [unique().on(table.postId, table.tag)],
);

export const stripeOrders = pgTable("stripe_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  priceId: text("price_id").notNull(),
  productId: text("product_id").notNull(),
  status: text("status", { enum: ["pending", "complete", "expired"] }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});