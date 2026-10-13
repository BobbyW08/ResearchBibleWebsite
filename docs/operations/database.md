# Database

## Provider

Neon Postgres (serverless). Two branches:
- `main` -- production data. Never connect to this outside of Vercel Production env vars.
- `preview` (branch ID: `br-young-dew-ay31f3xs`) -- staging/dev data. Used by Vercel Preview deploys and local `.env.local`.

## Schemas

Three schemas coexist in the same Neon instance:

| Schema | Owner | Tables |
|---|---|---|
| `payload_cms` | Payload CMS | All Payload collections, globals, and metadata tables |
| `neon_auth` | Neon Auth | Visitor session and identity tables (managed by Neon) |
| `public` | (orphaned) | Legacy Drizzle tables from P0 Task 2 -- Drizzle was removed; these tables are no longer written or read by any live code |

## Connection strings

`DATABASE_URI` is the variable used everywhere. It points at the Neon pooler endpoint.

To verify which database a running process is connected to (print endpoint host only):

```bash
node -e "const u = process.env.DATABASE_URI || ''; const m = u.match(/@([^/?]+)/); console.log('DB endpoint:', m ? m[1] : 'not set');"
```

Never print the full connection string. Compare the endpoint name to the Neon console branch page.

## Accessing the database

- **Payload Local API**: for all app code that reads/writes Payload collections. Never use raw SQL for Payload-managed data.
- **Neon console query editor**: one-off inspection queries. Use the `preview` branch for anything that could modify data.
- **pg client in Node scripts**: for schema inspection or migration verification. Always use the preview connection string.

## Schema changes

Any new Payload collection requires a migration. See `docs/operations/migrations.md` for the full workflow.

The `public` schema orphaned tables (`profiles`, `topic_progress`, `interest_signups`, `pending_reviews`, `posts`, `comments`, `likes`, `points_ledger`, `post_tags`, `course_progress`, `entitlements`, `stripe_customers`, `stripe_subscriptions`, `stripe_orders`, `courses`, `lessons`) are safe to drop in a future cleanup sprint once the community/courses routes are confirmed live on the Payload-native data layer.

## Backups

Neon maintains automatic point-in-time recovery (PITR). The `main` (production) branch has 7-day PITR. The `preview` branch is a forked copy; it can be re-branched from `main` if it diverges badly.

See `docs/operations/backups.md` for the backup and restore procedures.
