import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

// Migration: add 8 community/courses collections + alter 4 existing tables
// All tables live in the payload_cms schema.
//
// New tables:
//   visitor_profiles, community_posts, community_comments, community_reports,
//   lesson_progress, visitor_entitlements, interest_signups_payload, course_enrollments
//
// Altered tables:
//   users           — add role column
//   payload_lessons — add video_url, product_key columns
//   payload_courses — add cover_image_id column
//   payload_locked_documents_rels — add FK columns for every new collection

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- ── Enum types ──────────────────────────────────────────────────────────────

    CREATE TYPE payload_cms.enum_visitor_profiles_user_role AS ENUM ('parent', 'professional');
    CREATE TYPE payload_cms.enum_visitor_profiles_status AS ENUM ('active', 'suspended');

    CREATE TYPE payload_cms.enum_community_posts_audience AS ENUM ('parent', 'professional', 'all');
    CREATE TYPE payload_cms.enum_community_posts_status AS ENUM ('visible', 'hidden', 'removed');

    CREATE TYPE payload_cms.enum_community_comments_status AS ENUM ('visible', 'hidden', 'removed');

    CREATE TYPE payload_cms.enum_community_reports_target_type AS ENUM ('post', 'comment');
    CREATE TYPE payload_cms.enum_community_reports_reason AS ENUM (
      'harassment', 'hate_speech', 'spam', 'privacy', 'misinformation', 'other'
    );
    CREATE TYPE payload_cms.enum_community_reports_status AS ENUM ('open', 'actioned', 'dismissed');

    CREATE TYPE payload_cms.enum_course_enrollments_source AS ENUM ('free', 'admin');

    CREATE TYPE payload_cms.enum_users_role AS ENUM ('admin', 'moderator');

    -- ── visitor_profiles ────────────────────────────────────────────────────────

    CREATE TABLE payload_cms.visitor_profiles (
      id          serial PRIMARY KEY,
      user_id     varchar NOT NULL,
      user_role   payload_cms.enum_visitor_profiles_user_role NOT NULL,
      display_name varchar NOT NULL DEFAULT '',
      bio         text,
      status      payload_cms.enum_visitor_profiles_status NOT NULL DEFAULT 'active',
      updated_at  timestamptz NOT NULL,
      created_at  timestamptz NOT NULL
    );

    CREATE UNIQUE INDEX visitor_profiles_user_id_idx ON payload_cms.visitor_profiles (user_id);

    -- ── community_posts ─────────────────────────────────────────────────────────

    CREATE TABLE payload_cms.community_posts (
      id             serial PRIMARY KEY,
      author_id      integer,
      content        text NOT NULL,
      audience       payload_cms.enum_community_posts_audience NOT NULL DEFAULT 'all',
      status         payload_cms.enum_community_posts_status NOT NULL DEFAULT 'visible',
      comments_count numeric DEFAULT 0,
      is_pinned      boolean DEFAULT false,
      updated_at     timestamptz NOT NULL,
      created_at     timestamptz NOT NULL
    );

    -- ── community_comments ──────────────────────────────────────────────────────

    CREATE TABLE payload_cms.community_comments (
      id         serial PRIMARY KEY,
      post_id    integer,
      author_id  integer,
      content    text NOT NULL,
      status     payload_cms.enum_community_comments_status NOT NULL DEFAULT 'visible',
      updated_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL
    );

    -- ── community_reports ───────────────────────────────────────────────────────

    CREATE TABLE payload_cms.community_reports (
      id                 serial PRIMARY KEY,
      reporter_user_id   varchar NOT NULL,
      target_type        payload_cms.enum_community_reports_target_type NOT NULL,
      target_id          varchar NOT NULL,
      reason             payload_cms.enum_community_reports_reason NOT NULL,
      note               text,
      status             payload_cms.enum_community_reports_status NOT NULL DEFAULT 'open',
      resolved_at        timestamptz,
      updated_at         timestamptz NOT NULL,
      created_at         timestamptz NOT NULL
    );

    -- ── lesson_progress ─────────────────────────────────────────────────────────

    CREATE TABLE payload_cms.lesson_progress (
      id           serial PRIMARY KEY,
      user_id      varchar NOT NULL,
      lesson_id    varchar NOT NULL,
      completed_at timestamptz NOT NULL,
      updated_at   timestamptz NOT NULL,
      created_at   timestamptz NOT NULL
    );

    CREATE INDEX lesson_progress_user_id_idx   ON payload_cms.lesson_progress (user_id);
    CREATE INDEX lesson_progress_lesson_id_idx ON payload_cms.lesson_progress (lesson_id);

    -- ── visitor_entitlements ────────────────────────────────────────────────────

    CREATE TABLE payload_cms.visitor_entitlements (
      id         serial PRIMARY KEY,
      user_id    varchar NOT NULL,
      product_id varchar NOT NULL,
      expires_at timestamptz,
      updated_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL
    );

    CREATE INDEX visitor_entitlements_user_id_idx    ON payload_cms.visitor_entitlements (user_id);
    CREATE INDEX visitor_entitlements_product_id_idx ON payload_cms.visitor_entitlements (product_id);

    -- ── interest_signups_payload ────────────────────────────────────────────────

    CREATE TABLE payload_cms.interest_signups_payload (
      id         serial PRIMARY KEY,
      email      varchar NOT NULL,
      source     varchar NOT NULL,
      updated_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL
    );

    -- ── course_enrollments ──────────────────────────────────────────────────────

    CREATE TABLE payload_cms.course_enrollments (
      id          serial PRIMARY KEY,
      user_id     varchar NOT NULL,
      course_slug varchar NOT NULL,
      source      payload_cms.enum_course_enrollments_source NOT NULL DEFAULT 'free',
      updated_at  timestamptz NOT NULL,
      created_at  timestamptz NOT NULL
    );

    CREATE INDEX course_enrollments_user_id_idx     ON payload_cms.course_enrollments (user_id);
    CREATE INDEX course_enrollments_course_slug_idx ON payload_cms.course_enrollments (course_slug);

    -- ── Alter existing tables ───────────────────────────────────────────────────

    -- users: add role (moderator by default to match the Users collection defaultValue)
    ALTER TABLE payload_cms.users
      ADD COLUMN role payload_cms.enum_users_role NOT NULL DEFAULT 'moderator';

    -- payload_lessons: add videoUrl and productKey fields
    ALTER TABLE payload_cms.payload_lessons
      ADD COLUMN video_url   varchar,
      ADD COLUMN product_key varchar;

    -- payload_courses: add coverImage upload relationship
    ALTER TABLE payload_cms.payload_courses
      ADD COLUMN cover_image_id integer;

    -- payload_locked_documents_rels: add FK columns for all 8 new collections
    ALTER TABLE payload_cms.payload_locked_documents_rels
      ADD COLUMN visitor_profiles_id         integer,
      ADD COLUMN community_posts_id           integer,
      ADD COLUMN community_comments_id        integer,
      ADD COLUMN community_reports_id         integer,
      ADD COLUMN lesson_progress_id           integer,
      ADD COLUMN visitor_entitlements_id      integer,
      ADD COLUMN interest_signups_payload_id  integer,
      ADD COLUMN course_enrollments_id        integer;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- ── Revert payload_locked_documents_rels additions ──────────────────────────

    ALTER TABLE payload_cms.payload_locked_documents_rels
      DROP COLUMN IF EXISTS visitor_profiles_id,
      DROP COLUMN IF EXISTS community_posts_id,
      DROP COLUMN IF EXISTS community_comments_id,
      DROP COLUMN IF EXISTS community_reports_id,
      DROP COLUMN IF EXISTS lesson_progress_id,
      DROP COLUMN IF EXISTS visitor_entitlements_id,
      DROP COLUMN IF EXISTS interest_signups_payload_id,
      DROP COLUMN IF EXISTS course_enrollments_id;

    -- ── Revert payload_courses addition ─────────────────────────────────────────

    ALTER TABLE payload_cms.payload_courses
      DROP COLUMN IF EXISTS cover_image_id;

    -- ── Revert payload_lessons additions ────────────────────────────────────────

    ALTER TABLE payload_cms.payload_lessons
      DROP COLUMN IF EXISTS video_url,
      DROP COLUMN IF EXISTS product_key;

    -- ── Revert users addition ────────────────────────────────────────────────────

    ALTER TABLE payload_cms.users
      DROP COLUMN IF EXISTS role;

    -- ── Drop new tables ──────────────────────────────────────────────────────────

    DROP TABLE IF EXISTS payload_cms.course_enrollments;
    DROP TABLE IF EXISTS payload_cms.interest_signups_payload;
    DROP TABLE IF EXISTS payload_cms.visitor_entitlements;
    DROP TABLE IF EXISTS payload_cms.lesson_progress;
    DROP TABLE IF EXISTS payload_cms.community_reports;
    DROP TABLE IF EXISTS payload_cms.community_comments;
    DROP TABLE IF EXISTS payload_cms.community_posts;
    DROP TABLE IF EXISTS payload_cms.visitor_profiles;

    -- ── Drop enum types ──────────────────────────────────────────────────────────

    DROP TYPE IF EXISTS payload_cms.enum_users_role;
    DROP TYPE IF EXISTS payload_cms.enum_course_enrollments_source;
    DROP TYPE IF EXISTS payload_cms.enum_community_reports_status;
    DROP TYPE IF EXISTS payload_cms.enum_community_reports_reason;
    DROP TYPE IF EXISTS payload_cms.enum_community_reports_target_type;
    DROP TYPE IF EXISTS payload_cms.enum_community_comments_status;
    DROP TYPE IF EXISTS payload_cms.enum_community_posts_status;
    DROP TYPE IF EXISTS payload_cms.enum_community_posts_audience;
    DROP TYPE IF EXISTS payload_cms.enum_visitor_profiles_status;
    DROP TYPE IF EXISTS payload_cms.enum_visitor_profiles_user_role;
  `);
}
