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
//   users: add role (existing rows become 'admin'; new users default to 'moderator')
//   payload_lessons, _payload_lessons_v: add video_url, product_key
//   payload_courses, _payload_courses_v: add cover_image_id (FK to media)
//   payload_locked_documents_rels: add FK columns for every new collection

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Enum types, each guarded so a re-run (or a prior dev schema push) is safe
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE payload_cms.enum_visitor_profiles_user_role AS ENUM ('parent', 'professional');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE payload_cms.enum_visitor_profiles_status AS ENUM ('active', 'suspended');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE payload_cms.enum_community_posts_audience AS ENUM ('parent', 'professional', 'all');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE payload_cms.enum_community_posts_status AS ENUM ('visible', 'hidden', 'removed');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE payload_cms.enum_community_comments_status AS ENUM ('visible', 'hidden', 'removed');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE payload_cms.enum_community_reports_target_type AS ENUM ('post', 'comment');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE payload_cms.enum_community_reports_reason AS ENUM (
        'harassment', 'hate_speech', 'spam', 'privacy', 'misinformation', 'other'
      );
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE payload_cms.enum_community_reports_status AS ENUM ('open', 'actioned', 'dismissed');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE payload_cms.enum_course_enrollments_source AS ENUM ('free', 'admin');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE payload_cms.enum_users_role AS ENUM ('admin', 'moderator');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);

  // New tables and their indexes
  await db.execute(sql`
    -- ── visitor_profiles ────────────────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS payload_cms.visitor_profiles (
      id           serial PRIMARY KEY,
      user_id      varchar NOT NULL,
      user_role    payload_cms.enum_visitor_profiles_user_role NOT NULL,
      display_name varchar NOT NULL DEFAULT '',
      bio          text,
      status       payload_cms.enum_visitor_profiles_status NOT NULL DEFAULT 'active',
      updated_at   timestamptz NOT NULL,
      created_at   timestamptz NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS visitor_profiles_user_id_idx
      ON payload_cms.visitor_profiles (user_id);

    -- ── community_posts ─────────────────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS payload_cms.community_posts (
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

    CREATE TABLE IF NOT EXISTS payload_cms.community_comments (
      id         serial PRIMARY KEY,
      post_id    integer,
      author_id  integer,
      content    text NOT NULL,
      status     payload_cms.enum_community_comments_status NOT NULL DEFAULT 'visible',
      updated_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL
    );

    -- ── community_reports ───────────────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS payload_cms.community_reports (
      id               serial PRIMARY KEY,
      reporter_user_id varchar NOT NULL,
      target_type      payload_cms.enum_community_reports_target_type NOT NULL,
      target_id        varchar NOT NULL,
      reason           payload_cms.enum_community_reports_reason NOT NULL,
      note             text,
      status           payload_cms.enum_community_reports_status NOT NULL DEFAULT 'open',
      resolved_at      timestamptz,
      updated_at       timestamptz NOT NULL,
      created_at       timestamptz NOT NULL
    );

    -- ── lesson_progress ─────────────────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS payload_cms.lesson_progress (
      id           serial PRIMARY KEY,
      user_id      varchar NOT NULL,
      lesson_id    varchar NOT NULL,
      completed_at timestamptz NOT NULL,
      updated_at   timestamptz NOT NULL,
      created_at   timestamptz NOT NULL
    );

    CREATE INDEX IF NOT EXISTS lesson_progress_user_id_idx
      ON payload_cms.lesson_progress (user_id);
    CREATE INDEX IF NOT EXISTS lesson_progress_lesson_id_idx
      ON payload_cms.lesson_progress (lesson_id);

    -- ── visitor_entitlements ────────────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS payload_cms.visitor_entitlements (
      id         serial PRIMARY KEY,
      user_id    varchar NOT NULL,
      product_id varchar NOT NULL,
      expires_at timestamptz,
      updated_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL
    );

    CREATE INDEX IF NOT EXISTS visitor_entitlements_user_id_idx
      ON payload_cms.visitor_entitlements (user_id);
    CREATE INDEX IF NOT EXISTS visitor_entitlements_product_id_idx
      ON payload_cms.visitor_entitlements (product_id);

    -- ── interest_signups_payload ────────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS payload_cms.interest_signups_payload (
      id         serial PRIMARY KEY,
      email      varchar NOT NULL,
      source     varchar NOT NULL,
      updated_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL
    );

    -- ── course_enrollments ──────────────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS payload_cms.course_enrollments (
      id          serial PRIMARY KEY,
      user_id     varchar NOT NULL,
      course_slug varchar NOT NULL,
      source      payload_cms.enum_course_enrollments_source NOT NULL DEFAULT 'free',
      updated_at  timestamptz NOT NULL,
      created_at  timestamptz NOT NULL
    );

    CREATE INDEX IF NOT EXISTS course_enrollments_user_id_idx
      ON payload_cms.course_enrollments (user_id);
    CREATE INDEX IF NOT EXISTS course_enrollments_course_slug_idx
      ON payload_cms.course_enrollments (course_slug);
  `);

  // users.role: three-step so existing admin users are not demoted to 'moderator'.
  // ADD COLUMN nullable first, UPDATE all existing rows to 'admin', then lock NOT NULL.
  // If the column already exists (dev pushDevSchema ran), ADD COLUMN IF NOT EXISTS is a
  // no-op, UPDATE touches only rows where role IS NULL, and SET NOT NULL / SET DEFAULT
  // are both idempotent in Postgres.
  await db.execute(sql`
    ALTER TABLE payload_cms.users
      ADD COLUMN IF NOT EXISTS role payload_cms.enum_users_role;

    UPDATE payload_cms.users SET role = 'admin' WHERE role IS NULL;

    ALTER TABLE payload_cms.users ALTER COLUMN role SET NOT NULL;
    ALTER TABLE payload_cms.users ALTER COLUMN role SET DEFAULT 'moderator';
  `);

  // Remaining column additions on existing tables
  await db.execute(sql`
    ALTER TABLE payload_cms.payload_lessons
      ADD COLUMN IF NOT EXISTS video_url   varchar,
      ADD COLUMN IF NOT EXISTS product_key varchar;

    ALTER TABLE payload_cms._payload_lessons_v
      ADD COLUMN IF NOT EXISTS version_video_url   varchar,
      ADD COLUMN IF NOT EXISTS version_product_key varchar;

    ALTER TABLE payload_cms.payload_courses
      ADD COLUMN IF NOT EXISTS cover_image_id integer;

    ALTER TABLE payload_cms._payload_courses_v
      ADD COLUMN IF NOT EXISTS version_cover_image_id integer;

    ALTER TABLE payload_cms.payload_locked_documents_rels
      ADD COLUMN IF NOT EXISTS visitor_profiles_id         integer,
      ADD COLUMN IF NOT EXISTS community_posts_id          integer,
      ADD COLUMN IF NOT EXISTS community_comments_id       integer,
      ADD COLUMN IF NOT EXISTS community_reports_id        integer,
      ADD COLUMN IF NOT EXISTS lesson_progress_id          integer,
      ADD COLUMN IF NOT EXISTS visitor_entitlements_id     integer,
      ADD COLUMN IF NOT EXISTS interest_signups_payload_id integer,
      ADD COLUMN IF NOT EXISTS course_enrollments_id       integer;
  `);

  // Foreign keys, each guarded so a re-run is a no-op
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE payload_cms.community_posts ADD CONSTRAINT community_posts_author_id_visitor_profiles_id_fk
        FOREIGN KEY (author_id) REFERENCES payload_cms.visitor_profiles(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE payload_cms.community_comments ADD CONSTRAINT community_comments_post_id_community_posts_id_fk
        FOREIGN KEY (post_id) REFERENCES payload_cms.community_posts(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE payload_cms.community_comments ADD CONSTRAINT community_comments_author_id_visitor_profiles_id_fk
        FOREIGN KEY (author_id) REFERENCES payload_cms.visitor_profiles(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE payload_cms.payload_courses ADD CONSTRAINT payload_courses_cover_image_id_media_id_fk
        FOREIGN KEY (cover_image_id) REFERENCES payload_cms.media(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE payload_cms._payload_courses_v ADD CONSTRAINT _payload_courses_v_version_cover_image_id_media_id_fk
        FOREIGN KEY (version_cover_image_id) REFERENCES payload_cms.media(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE payload_cms.payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_visitor_profiles_fk
        FOREIGN KEY (visitor_profiles_id) REFERENCES payload_cms.visitor_profiles(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE payload_cms.payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_community_posts_fk
        FOREIGN KEY (community_posts_id) REFERENCES payload_cms.community_posts(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE payload_cms.payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_community_comments_fk
        FOREIGN KEY (community_comments_id) REFERENCES payload_cms.community_comments(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE payload_cms.payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_community_reports_fk
        FOREIGN KEY (community_reports_id) REFERENCES payload_cms.community_reports(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE payload_cms.payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_lesson_progress_fk
        FOREIGN KEY (lesson_progress_id) REFERENCES payload_cms.lesson_progress(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE payload_cms.payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_visitor_entitlements_fk
        FOREIGN KEY (visitor_entitlements_id) REFERENCES payload_cms.visitor_entitlements(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE payload_cms.payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_interest_signups_payload_fk
        FOREIGN KEY (interest_signups_payload_id) REFERENCES payload_cms.interest_signups_payload(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE payload_cms.payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_course_enrollments_fk
        FOREIGN KEY (course_enrollments_id) REFERENCES payload_cms.course_enrollments(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS community_posts_author_idx ON payload_cms.community_posts (author_id);
    CREATE INDEX IF NOT EXISTS community_comments_post_idx ON payload_cms.community_comments (post_id);
    CREATE INDEX IF NOT EXISTS community_comments_author_idx ON payload_cms.community_comments (author_id);
    CREATE INDEX IF NOT EXISTS payload_courses_cover_image_idx ON payload_cms.payload_courses (cover_image_id);
    CREATE INDEX IF NOT EXISTS _payload_courses_v_version_version_cover_image_idx ON payload_cms._payload_courses_v (version_cover_image_id);
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_visitor_profiles_id_idx ON payload_cms.payload_locked_documents_rels (visitor_profiles_id);
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_community_posts_id_idx ON payload_cms.payload_locked_documents_rels (community_posts_id);
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_community_comments_id_idx ON payload_cms.payload_locked_documents_rels (community_comments_id);
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_community_reports_id_idx ON payload_cms.payload_locked_documents_rels (community_reports_id);
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_lesson_progress_id_idx ON payload_cms.payload_locked_documents_rels (lesson_progress_id);
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_visitor_entitlements_id_idx ON payload_cms.payload_locked_documents_rels (visitor_entitlements_id);
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_interest_signups_payload_id_idx ON payload_cms.payload_locked_documents_rels (interest_signups_payload_id);
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_course_enrollments_id_idx ON payload_cms.payload_locked_documents_rels (course_enrollments_id);
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Revert payload_locked_documents_rels additions
    ALTER TABLE payload_cms.payload_locked_documents_rels
      DROP COLUMN IF EXISTS visitor_profiles_id,
      DROP COLUMN IF EXISTS community_posts_id,
      DROP COLUMN IF EXISTS community_comments_id,
      DROP COLUMN IF EXISTS community_reports_id,
      DROP COLUMN IF EXISTS lesson_progress_id,
      DROP COLUMN IF EXISTS visitor_entitlements_id,
      DROP COLUMN IF EXISTS interest_signups_payload_id,
      DROP COLUMN IF EXISTS course_enrollments_id;

    -- Revert payload_courses additions
    ALTER TABLE payload_cms._payload_courses_v
      DROP COLUMN IF EXISTS version_cover_image_id;
    ALTER TABLE payload_cms.payload_courses
      DROP COLUMN IF EXISTS cover_image_id;

    -- Revert payload_lessons additions
    ALTER TABLE payload_cms._payload_lessons_v
      DROP COLUMN IF EXISTS version_video_url,
      DROP COLUMN IF EXISTS version_product_key;
    ALTER TABLE payload_cms.payload_lessons
      DROP COLUMN IF EXISTS video_url,
      DROP COLUMN IF EXISTS product_key;

    -- Revert users addition
    ALTER TABLE payload_cms.users
      DROP COLUMN IF EXISTS role;

    -- Drop new tables (reverse order of creation)
    DROP TABLE IF EXISTS payload_cms.course_enrollments;
    DROP TABLE IF EXISTS payload_cms.interest_signups_payload;
    DROP TABLE IF EXISTS payload_cms.visitor_entitlements;
    DROP TABLE IF EXISTS payload_cms.lesson_progress;
    DROP TABLE IF EXISTS payload_cms.community_reports;
    DROP TABLE IF EXISTS payload_cms.community_comments;
    DROP TABLE IF EXISTS payload_cms.community_posts;
    DROP TABLE IF EXISTS payload_cms.visitor_profiles;

    -- Drop enum types
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
