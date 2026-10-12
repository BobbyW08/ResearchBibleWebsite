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

## Fix: one-time step before enabling community/courses

### 1. Use Node 20

The Payload CLI fails on Node 24 (ESM async module incompatibility). Vercel uses Node 20.

```bash
# If you have nvm:
nvm install 20
nvm use 20
node --version  # should print v20.x.x
```

### 2. Generate the migration

```bash
cd C:\dev\ResearchBibleWebsite
npx payload migrate:create --name init_community_collections
```

This creates a file in `src/migrations/` (or a `migrations/` folder at the repo root — check where Payload puts it).

### 3. Hook it into the build

Edit `package.json` — change the `build` script from:
```json
"build": "next build"
```
to:
```json
"build": "next build && npx payload migrate"
```

`npx payload migrate` is a no-op if there are no pending migrations. With the file from step 2, the next Vercel deploy will create the tables.

### 4. Commit and deploy

```bash
git add migrations/  # or src/migrations/
git add package.json
git commit -m "chore: Payload migration for community collections"
git push
```

Vercel will pick up the change and run the migration as part of the build.

---

## Why the build script change was not committed automatically

The Claude Code sandbox blocked modifying `package.json` (flagged as a production deploy change). Bobby must apply this change manually.

---

## Ongoing migration workflow

For every future schema change (new collection, new field):

1. Make the schema change in `src/payload/collections/`.
2. Run `npx payload migrate:create --name describe_the_change` on Node 20.
3. Commit the generated migration file alongside the schema change.
4. The next deploy runs the migration automatically via the postbuild hook.

Never commit a schema change without a matching migration file unless the affected routes are not yet live.

---

## Media uploads in production

**Separate issue.** Payload currently writes media to `public/media/` — a path on the local filesystem. Vercel's filesystem is ephemeral: files written at runtime are lost on the next deploy.

**Impact:** Images uploaded through `/admin` after a deploy are lost on the next deploy. Images committed to the repo and deployed with the build are durable.

**Fix (before uploading media through admin):** Configure Payload to use a cloud storage adapter (e.g. `@payloadcms/storage-vercel-blob` or `@payloadcms/storage-s3`). This requires Bobby to provision a Vercel Blob store or S3 bucket and add the adapter to `payload.config.ts`. Not needed at launch if all media is committed to the repo.
