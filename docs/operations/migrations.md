# Payload CMS Migrations

## How schema changes reach production

Payload only syncs its schema automatically when `NODE_ENV` is not `production` (the push you see in `npm run dev`). Vercel always builds with `NODE_ENV=production`, so a new collection or field never reaches Neon unless a migration file creates it.

Schema changes ship as migration files in `src/migrations/`. They run once per deploy, in a single process, before the build starts:

- `package.json` script `ci` is `payload migrate && next build`.
- Vercel's Build Command is `npm run ci` (Bobby sets this in the Vercel dashboard). Any branch or commit without the `ci` script fails to build with `missing script: ci`, and the previous deployment keeps serving.
- The `build` script stays `next build`, so a local `npm run build` never touches a database.
- `payload.config.ts` sets `migrationDir` to `src/migrations` and has no migration code in the database adapter. The running app and the build's page workers never migrate.

## Module type and Node version

`package.json` sets `"type": "module"` because the Payload config is ESM, and the Payload CLI needs it. Without it, the CLI loads `payload.config.ts` as CommonJS and fails with `ERR_REQUIRE_ASYNC_MODULE` when it reaches the ESM-only Payload packages. Root config files use `.mjs` or `.ts`, and no `.js` or `.cjs` file in the repo uses `require()` or `module.exports`.

The Vercel project's Node.js Version is set to 20.x, and the migrate, rollback and build sequence is proven on Node 20. Bobby's system Node is v24, where the CLI also loads (`migrate:status` works). Use a temporary Node 20 locally so local runs match Vercel, without changing the system Node:

```bash
npx -y node@20 node_modules/payload/bin.js <command>
```

Commands: `migrate:status`, `migrate`, `migrate:down`, `migrate:create --name <name>`.

## Local rules

- Run migration commands only against the `preview` Neon branch or a personal dev branch. Never against production. Confirm the target first with the endpoint check in `docs/operations/database.md`.
- `npm run dev` pushes the schema straight to the database and writes a row to `payload_cms.payload_migrations` with `name = 'dev'` and `batch = -1`. Later `payload migrate` runs stop at an interactive prompt on that row, which hangs a non-interactive build. Do not run `npm run dev` against a database you use to test migrations.
- If a database has the dev row, remove it before running `migrate`:

```sql
DELETE FROM payload_cms.payload_migrations WHERE batch = -1;
```

## Current migration

`src/migrations/20261013_000000_init_community_collections.ts` is hand-reviewed SQL for the `payload_cms` schema.

New tables:

- `visitor_profiles` (VisitorProfiles)
- `community_posts` (Posts)
- `community_comments` (Comments)
- `community_reports` (Reports)
- `lesson_progress` (LessonProgress)
- `visitor_entitlements` (Entitlements)
- `interest_signups_payload` (InterestSignups)
- `course_enrollments` (Enrollments)

Altered tables:

- `users`: adds `role` (existing rows become `admin`, new users default to `moderator`)
- `payload_lessons` and `_payload_lessons_v`: add `video_url`, `product_key`
- `payload_courses` and `_payload_courses_v`: add `cover_image_id`
- `payload_locked_documents_rels`: adds a foreign key column per new collection

Its `down` reverses all of the above.

## Status by environment

| Environment | State |
|---|---|
| Preview Neon branch | Applied, batch 1 |
| Production Neon branch | Not applied. Restore branch `pre-community-migration` exists and the dev row is removed. Community, courses, and auth routes are gated and not linked live, so the public site is unaffected until cutover |

Update this table whenever a migration is applied to production.

## Production cutover

Steps 1 to 3 are done. Delete the `pre-community-migration` branch only after production is stable.

1. In the Neon console, create a restore point on the `main` branch.
2. In the Neon SQL editor on `main`, run `DELETE FROM payload_cms.payload_migrations WHERE batch = -1;`.
3. In Vercel, set the project Build Command to `npm run ci` and confirm the Node.js Version is 20.x. Any branch without the `ci` script fails with `missing script: ci`.
4. Push the branch and let the preview deployment run `ci` against the `preview` Neon branch. Its log shows no `Migrated:` line because `preview` is already migrated. Then merge the PR to `main`.
5. In the build log, confirm one `Migrated: 20261013_000000_init_community_collections` line and a successful `next build`.
6. In Neon, confirm `payload_migrations` has the migration at batch 1 and `users.role` is `admin` for existing users.
7. Run the post-deploy smoke test in `docs/operations/environments.md`.

Preview deployments use the same Build Command, so they run `payload migrate` against the `preview` branch. That is intended.

## Creating the next migration

1. Change the collection or global in `src/payload/`.
2. Run `npx -y node@20 node_modules/payload/bin.js migrate:create --name <describe_the_change>` against the `preview` branch. This writes `src/migrations/YYYYMMDD_HHMMSS_<name>.ts`.
3. Review the SQL by hand. Remove statements for things that already exist. Make sure `down` works.
4. Run `migrate`, then `migrate:status`, then `migrate:down` and `migrate` again on `preview` to prove the round trip.
5. Run `npm run build`, `npm run lint`, and `npx tsc --noEmit`.
6. Commit the migration file with the code change that needs it.

Never merge a schema change without its migration file unless the affected routes are not live.

## Rolling back

- Before cutover or any risky migration, create a Neon restore point (`docs/operations/backups.md`).
- A Vercel rollback restores the previous code only. It does not revert the schema. Migrations are additive, so the previous deployment keeps working against the newer schema.
- To revert a migration on a dev or preview branch, run `migrate:down`. On production, restore from the Neon restore point or apply the migration's `down` SQL by hand.
