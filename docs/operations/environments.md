# Environments

## Three environments

| Environment | Neon branch | URL | Vercel scope |
|---|---|---|---|
| Production | `main` (production branch) | `bobby-washburn.com` | Production env vars |
| Preview | `preview` (long-lived branch copied from production) | Vercel preview URL per deploy | Preview-scoped env vars |
| Local | `preview` (or a personal dev branch) | `localhost:3000` | `.env.local` |

**The `preview` Neon branch is the staging environment.** Vercel Preview deploys and local dev both point at it. This means:
- Preview deploys get real data to test against
- Local dev never touches production data
- Production data is isolated behind Production-scoped Vercel env vars

**Never point local `.env.local` or any Vercel Preview deploy at the production Neon branch.** To check which database a process uses, print only the endpoint host:

```bash
node -e "const u = process.env.DATABASE_URI || ''; const m = u.match(/@([^/?]+)/); console.log('DB endpoint:', m ? m[1] : 'not set');"
```

Compare the printed endpoint name to the Neon console branch page.

---

## Variable matrix

Matches `.env.example` and every `process.env.*` reference in live code.

| Variable | Local | Vercel Preview | Vercel Production | Notes |
|---|---|---|---|---|
| `DATABASE_URI` | `preview` branch | `preview` branch (Preview-scoped) | `main` branch (Production-scoped) | Payload CMS connection. The only database variable |
| `PAYLOAD_SECRET` | Any 32+ char string | Set | Set | JWT and cookie signing |
| `NEON_AUTH_BASE_URL` | Neon Auth console URL | Set | Set | Visitor auth API |
| `NEXT_PUBLIC_NEON_AUTH_BASE_URL` | Same as above | Set | Set | Client-side auth UI |
| `NEON_AUTH_COOKIE_SECRET` | Any 32+ char string | Set | Set | Session cookie signing |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email | Set | Set | Drive and Sheets |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Full PEM block | Set | Set | Drive and Sheets |
| `INTEREST_SIGNUPS_SHEET_ID` | Sheet ID | Set | Confirm set | Interest signup and org inquiry rows |
| `WEBHOOK_SECRET` | Any string | Set | Set | Research bible Drive sync. Rotate (BLOCKED-ON-BOBBY) |
| `PARENT_CONTENT_WEBHOOK_SECRET` | Any string | Not set | Not set | Parent content sync. BLOCKED-ON-BOBBY |
| `RESEND_API_KEY` | Optional | Not set | Not set | Community report emails. BLOCKED-ON-BOBBY |
| `NOTIFY_EMAIL` | Optional | Not set | Not set | Report notification recipient. BLOCKED-ON-BOBBY |

---

## Local setup

1. Clone the repo.
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in the required variables.
4. Point `DATABASE_URI` at the `preview` Neon branch (or a personal branch). **Never use the production connection string.**
5. `npm run dev` starts the Next.js dev server on `localhost:3000`. In dev mode Payload pushes its schema straight to the database and writes a `dev` row (batch -1) to `payload_cms.payload_migrations`. That row makes `payload migrate` stop at an interactive prompt, so do not run `npm run dev` against a database you will use to test migrations. Remove it with the SQL in `docs/operations/migrations.md`.
6. Payload admin at `localhost:3000/admin`. On a fresh database, create the first admin user at `/admin/create-first-user`.

---

## Pre-deploy checklist (before merging to `main`)

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0 (0 errors; warnings acceptable)
- [ ] `npx tsc --noEmit` exits 0
- [ ] Against the `preview` database, `payload migrate` under Node 20 applies any pending migrations and exits 0 (command in `docs/operations/migrations.md`)
- [ ] All new `process.env.*` references are in `.env.example`
- [ ] No secrets in git (check `git diff HEAD~1 - .env*`)
- [ ] Any new Payload collections are registered in `payload.config.ts`
- [ ] Any schema change has a migration file in `src/migrations/`
- [ ] Any new API routes are listed in `docs/operations/auth-audit.md`

---

## Post-deploy smoke test (after pushing to `main`)

1. **Homepage**: `bobby-washburn.com` returns 200, hero renders.
2. **Admin**: `/admin` shows the Payload login screen (not a 500).
3. **Content**: spot-check `/docs/adhd` and `/common-pain-points/meltdowns`.
4. **Research**: `/research` lists entries or shows the empty state.
5. **Cal.com link**: "Book a free intro call" opens Cal.com.
6. **Newsletter modal**: "Subscribe" opens the Substack embed.
7. **Org inquiry form**: `/services/organizations` form submits without a 500.
8. **Vercel logs**: no 500s in `/api/webhooks/*` routes in the first 5 minutes.

---

## Vercel project settings

- Framework: Next.js
- Root directory: `.`
- Build command: `npm run ci` (`payload migrate && next build`). See `docs/operations/migrations.md`.
- Output directory: `.next`
- Node.js Version: 20.x (BLOCKED-ON-BOBBY: confirm in the dashboard)
- Auto-deploy: on push to `main`
