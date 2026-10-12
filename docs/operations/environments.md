# Environments

## Overview

| Environment | Branch | URL | Notes |
|---|---|---|---|
| Production | `main` | `bobby-washburn.com` | Auto-deploys on push to `main` via Vercel |
| Preview | any branch | Vercel preview URL (per-deploy) | Auto-deployed on every push; URL in the Vercel dashboard and PR checks |
| Local | N/A | `localhost:3000` | `.env.local` required; see below |

There is no persistent staging environment. Vercel preview deploys serve that role — every branch gets its own URL.

**BLOCKED-ON-BOBBY:** If a long-lived staging environment backed by a separate Neon branch is wanted, Bobby must:
1. Create a Neon branch from the production branch in the Neon console.
2. Add a `staging` environment in Vercel with the new connection strings.
3. Point a custom domain (e.g. `staging.bobby-washburn.com`) at it.

---

## Environment Variable Matrix

| Variable | Local (`.env.local`) | Vercel Production | Notes |
|---|---|---|---|
| `DATABASE_URI` | Neon dev branch | Production Neon branch | Payload CMS connection |
| `DATABASE_URL` | Same as above | Same as above | Kept for legacy compatibility; Drizzle was removed in P0 Task 2 — no code reads this at runtime |
| `PAYLOAD_SECRET` | Any 32+ char string | Set | JWT / cookie signing |
| `NEON_AUTH_BASE_URL` | Neon Auth console | Set | Visitor auth |
| `NEXT_PUBLIC_NEON_AUTH_BASE_URL` | Same as above | Set | Client-side auth UI |
| `NEON_AUTH_COOKIE_SECRET` | Any 32+ char string | Set | Session cookie signing |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email | Set | Drive + Sheets |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Full PEM block | Set | Drive + Sheets |
| `INTEREST_SIGNUPS_SHEET_ID` | Sheet ID | Confirm set | Interest signup rows |
| `WEBHOOK_SECRET` | Any string | Set | Research bible Drive sync |
| `PARENT_CONTENT_WEBHOOK_SECRET` | Any string | Not yet set | Parent content sync — BLOCKED-ON-BOBBY |
| `RESEND_API_KEY` | Optional | Not yet set | Community report emails — BLOCKED-ON-BOBBY |
| `NOTIFY_EMAIL` | Optional | Not yet set | Recipient for report emails — BLOCKED-ON-BOBBY |
| `STRIPE_SECRET_KEY` | Optional | Not yet set | Backlogged — not at launch |
| `STRIPE_WEBHOOK_SECRET` | Optional | Not yet set | Backlogged — not at launch |
| `STRIPE_PRICE_*` | Optional | Not yet set | Backlogged — not at launch |

See `.env.example` for the full list with descriptions.

---

## Local Setup

1. Clone the repo.
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in values.
4. `npm run dev` — Next.js dev server starts on `localhost:3000`.
5. Payload admin at `localhost:3000/admin`. Create the first admin user on first visit.

Payload auto-creates its tables in the `payload_cms` schema on first run. No migration step is needed for a fresh database.

---

## Pre-Deploy Checklist (Production)

Run this before merging to `main`:

- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0 (0 errors; warnings acceptable)
- [ ] `npx tsc --noEmit` exits 0
- [ ] All new `process.env.*` references are in `.env.example`
- [ ] No secrets committed to git (check `git diff HEAD~1 -- .env*`)
- [ ] Any new Payload collections are registered in `payload.config.ts`
- [ ] Any new API routes that need auth are covered in `docs/operations/auth-audit.md`

---

## Post-Deploy Smoke Test (Production)

After deploying to `main`:

1. **Homepage loads** — `bobby-washburn.com` returns 200, hero renders.
2. **Admin accessible** — `/admin` returns the Payload login screen (not a 500).
3. **Content renders** — spot-check one deep-dive (`/docs/adhd`) and one pain point (`/common-pain-points/meltdowns`).
4. **Research page** — `/research` lists entries (or shows empty state if none published).
5. **Cal.com link** — click "Book a free intro call" — opens Cal.com in a new tab without error.
6. **Newsletter modal** — click "Subscribe" — Substack embed renders inside the modal.
7. **Org inquiry form** — `/services/organizations` — form submits (verify no 500 in Vercel logs).
8. **Webhook health** — check Vercel logs for any 500s in `/api/webhooks/*` routes.

---

## Vercel Project Settings

- **Framework preset:** Next.js
- **Root directory:** `.` (repo root)
- **Build command:** `npm run build` (default)
- **Output directory:** `.next` (default)
- **Node version:** 20 (set in Vercel project settings)
- **Auto-deploy:** on push to `main`
