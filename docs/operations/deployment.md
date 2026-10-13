# Deployment

## Platform

Vercel. Auto-deploys on push to `main`. Preview deploys on every other branch.

## Build command

Currently set to `next build` in `package.json` and Vercel project settings.

**BLOCKED-ON-BOBBY:** Before enabling community/courses/auth routes, change the Vercel Build Command to `npm run ci` (once that script is added to `package.json`). See `docs/operations/migrations.md` for the full context. The `ci` script will run `payload migrate && next build` so migrations run before the app starts.

## Build requirements

All three must exit 0 before merging to main:

```bash
npm run build
npm run lint
npx tsc --noEmit
```

## Environment scoping

Vercel has three env scopes: Production, Preview, Development.

| Scope | Which deploys | Which Neon branch |
|---|---|---|
| Production | `main` branch only | `main` (production) |
| Preview | All other branches | `preview` (staging) |
| Development | `vercel dev` only | n/a (uses `.env.local`) |

All required env vars are set in Production scope. Preview scope also needs its own values -- see `docs/operations/environments.md`.

## Deploy flow

1. Merge PR to `main`
2. Vercel detects the push and queues a build
3. Build runs `next build` (or `npm run ci` once configured)
4. If `prodMigrations` is set: first cold start runs any pending Payload migrations
5. Traffic shifts to the new deployment

Rollback: in the Vercel dashboard, promote any prior deployment with the "Promote to Production" button. The previous deployment's code re-runs -- no migration rollback happens automatically. If a migration needs reverting, Bobby must manually apply the `down()` function.

## Zero-downtime

Vercel builds complete before traffic shifts. The new build starts cold with a fresh cold start, which is when `prodMigrations` runs. Existing traffic continues hitting the previous deployment until the new one is healthy.

## Logs

Vercel dashboard -> Deployments -> select deploy -> Functions tab. Filter by route path. First 5 minutes after a production deploy are the most important to watch for 500s on `/api/webhooks/*`.
