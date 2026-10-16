# Database

## Provider

Neon Postgres (serverless). Two branches:
- `main` - production data. Never connect to this outside of Vercel Production env vars.
- `preview` (branch ID: `br-young-dew-ay31f3xs`) - staging/dev data. Used by Vercel Preview deploys and local `.env.local`.

## Schemas

Three schemas coexist in the same Neon instance:

| Schema | Owner | Tables |
|---|---|---|
| `payload_cms` | Payload CMS | All Payload collections, globals, and metadata tables |
| `neon_auth` | Neon Auth | Visitor session and identity tables (managed by Neon) |
| `public` | (orphaned) | Legacy Drizzle tables. No live code reads or writes them |

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

The `public` schema holds 17 orphaned tables, checked against the `preview` branch: `comments`, `course_progress`, `courses`, `entitlements`, `interest_signups`, `lessons`, `likes`, `pending_reviews`, `points_ledger`, `post_tags`, `posts`, `profiles`, `profiles_v1`, `stripe_customers`, `stripe_orders`, `stripe_subscriptions`, `topic_progress`. No live code reads them. They are safe to drop once the community and courses routes are confirmed live on the Payload collections.

## Backups

Neon maintains automatic point-in-time recovery (PITR). The `main` (production) branch has 7-day PITR. The `preview` branch is a forked copy; it can be re-branched from `main` if it diverges badly.

See `docs/operations/backups.md` for the backup and restore procedures.
