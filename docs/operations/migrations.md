# Payload CMS Migrations

## Why this matters

Payload's `pushDevSchema` (the auto-sync you see in `npm run dev`) only runs when `NODE_ENV !== 'production'`. Vercel always deploys with `NODE_ENV=production`. So new collection tables are **never auto-created on Vercel** — they require an explicit migration.

Verified in: `node_modules/@payloadcms/db-postgres/dist/connect.js`
```js
// Only push schema if not in production
if (process.env.NODE_ENV !== 'production' && ...) {
  await pushDevSchema(this);
}
if (process.env.NODE_ENV === 'production' && this.prodMigrations) {
  await this.migrate({ migrations: this.prodMigrations });
}
```

## Current state

The **original 9 collections** (Users, Media, Testimonials, PainPoints, AwarenessModules, ResearchBibles, DeepDives, Courses, Lessons) have tables in the production Neon database — they were created when Payload first ran locally in dev mode and the database was already provisioned.

The **8 new collections** added in the P0 sprint do NOT have tables in production yet:
- `VisitorProfiles` → `visitor_profiles`
- `Posts` → `community_posts`
- `Comments` → `community_comments`
- `Reports` → `community_reports`
- `LessonProgress` → `lesson_progress`
- `Entitlements` → `visitor_entitlements`
- `InterestSignups` → `interest_signups_payload`
- `Enrollments` → `course_enrollments`

**Impact at launch:** The community, courses, and auth routes (`/sign-in`, `/welcome`, `/account`, `/community/*`, `/courses/*`) are all gated and not linked live, so this does not affect the public launch. But these routes will throw database errors if visited before migrations run.

## How the migration runs in production

The Payload CLI (`npx payload migrate:create`) is blocked by a tsx ESM incompatibility on Node 20/22/24. The reliable alternative is `prodMigrations` in `payload.config.ts`.

When `prodMigrations` is set, Payload's `connect()` runs `migrate()` automatically at startup. It checks `payload_cms.payload_migrations` first; already-run migrations are skipped. This is safe to have permanently set.

---

## Fix: one-time step before enabling community/courses

The migration file already exists at `src/migrations/20261013_000000_init_community_collections.ts`. Bobby must apply two manual changes.

### 1. Add the import to `payload.config.ts`

After the existing `About` import at the top:

```typescript
import * as migration_20261013_000000 from "./src/migrations/20261013_000000_init_community_collections";
```

### 2. Add `prodMigrations` to the postgres adapter in `payload.config.ts`

```typescript
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URI,
  },
  schemaName: "payload_cms",
  prodMigrations: [
    {
      name: "20261013_000000_init_community_collections",
      up: migration_20261013_000000.up,
      down: migration_20261013_000000.down,
    },
  ],
}),
```

### 3. Test against preview first

Confirm all 8 tables appear in `payload_cms` after the first preview deploy:

```
visitor_profiles, community_posts, community_comments, community_reports,
lesson_progress, visitor_entitlements, interest_signups_payload, course_enrollments
```

### 4. Commit and deploy

```bash
git add src/migrations/
git add payload.config.ts
git commit -m "chore: Payload migration for community/courses collections"
git push
```

On first cold start after deploy, Payload runs the migration automatically.

---

## Ongoing migration workflow

For every future schema change (new collection, new field):

1. Make the schema change in `src/payload/collections/`.
2. Write a migration file by hand in `src/migrations/YYYYMMDD_HHMMSS_describe_the_change.ts`.
3. Add it to the `prodMigrations` array in `payload.config.ts`.
4. Test against the preview Neon branch.
5. Commit both files alongside the schema change.

The Payload CLI (`npx payload migrate:create`) would be more ergonomic but fails on all Node versions due to a tsx ESM incompatibility in `payload/node_modules/tsx@4.22.4`. Hand-written migrations are the workaround until Payload ships a fix.

Never commit a schema change without a matching migration file unless the affected routes are not yet live.

---

## Media uploads in production

**Separate issue.** Payload currently writes media to `public/media/` — a path on the local filesystem. Vercel's filesystem is ephemeral: files written at runtime are lost on the next deploy.

**Impact:** Images uploaded through `/admin` after a deploy are lost on the next deploy. Images committed to the repo and deployed with the build are durable.

**Fix (before uploading media through admin):** Configure Payload to use a cloud storage adapter (e.g. `@payloadcms/storage-vercel-blob` or `@payloadcms/storage-s3`). This requires Bobby to provision a Vercel Blob store or S3 bucket and add the adapter to `payload.config.ts`. Not needed at launch if all media is committed to the repo.
