# Deployment

## Platform

Vercel. Auto-deploys on push to `main`. Preview deploys on every other branch.

## Build command

Vercel runs `npm run ci`, which is `payload migrate && next build`. Migrations run once, in a single process, before the build. The `build` script in `package.json` stays `next build` so a local build never touches a database. See `docs/operations/migrations.md`.

The Vercel project's Node.js Version is 20.x, the version the `ci` sequence is proven on.

**Any build of a branch or commit that does not contain the `ci` script fails with `missing script: ci`.** That covers pushes to other branches and redeploys of older commits. The previous deployment keeps serving, so visitors are unaffected. Merge or rebase the `ci` script into a branch before expecting its deployment to pass.

The Build Command applies to every deployment, so Preview deployments migrate the `preview` Neon branch and Production deployments migrate `main`.

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

All required env vars are set in Production scope. Preview scope needs its own values. See `docs/operations/environments.md`.

## Deploy flow

1. Merge PR to `main`
2. Vercel detects the push and queues a build
3. `payload migrate` applies any pending migrations to the deployment's Neon branch
4. `next build` runs
5. Traffic shifts to the new deployment

Rollback: in the Vercel dashboard, promote any prior deployment with the "Promote to Production" button. The previous deployment's code runs again. No migration rollback happens automatically. If a migration needs reverting, see "Rolling back" in `docs/operations/migrations.md`.

## Zero-downtime

Vercel builds complete before traffic shifts, and existing traffic keeps hitting the previous deployment until the new one is healthy. Migrations are additive, so the previous deployment keeps working against the newer schema while the new build runs.

## Logs

Vercel dashboard, then Deployments, then select the deploy, then the Functions tab. Filter by route path. The first 5 minutes after a production deploy are the most important to watch for 500s on `/api/webhooks/*`.
