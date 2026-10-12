# Codebase Audit — P0 Task 1

**Branch:** p0/width-and-orgs-reset  
**Scope:** full inventory of routes, lib modules, components, and API endpoints. Status assigned per CLAUDE.md site map.

---

## App Routes

### `(app)` group — public and visitor-auth routes

| File | Route | Status |
|---|---|---|
| `app/(app)/page.tsx` | `/` | Live |
| `app/(app)/about-bobby/page.tsx` | `/about-bobby` | Live |
| `app/(app)/services/page.tsx` | `/services` | Live |
| `app/(app)/services/organizations/page.tsx` | `/services/organizations` | Live |
| `app/(app)/services/organizations/documents/page.tsx` | `/services/organizations/documents` | Live |
| `app/(app)/common-pain-points/page.tsx` | `/common-pain-points` | Live |
| `app/(app)/common-pain-points/[slug]/page.tsx` | `/common-pain-points/[slug]` | Live |
| `app/(app)/common-pain-points/teen/page.tsx` | `/common-pain-points/teen` | Live (uses PainPointSidebarLayout; TeenRebellionRoute unwired) |
| `app/(app)/docs/page.tsx` | `/docs` | Live |
| `app/(app)/docs/adhd/page.tsx` | `/docs/adhd` | Live |
| `app/(app)/docs/[slug]/page.tsx` | `/docs/[slug]` | Live |
| `app/(app)/dashboard/page.tsx` | `/dashboard` | Redirects to `/dashboard/adhd` |
| `app/(app)/dashboard/[slug]/page.tsx` | `/dashboard/[slug]` | Only ADHD has data; others return empty |
| `app/(app)/tools/page.tsx` | `/tools` | Live, unlisted |
| `app/(app)/tech-safety/page.tsx` | `/tech-safety` | Live, unlisted |
| `app/(app)/research/page.tsx` | `/research` | Live, unlisted |
| `app/(app)/research/[slug]/page.tsx` | `/research/[slug]` | Live, unlisted |
| `app/(app)/legal/page.tsx` | `/legal` | Live |
| `app/(app)/privacy/page.tsx` | `/privacy` | Live |
| `app/(app)/courses/page.tsx` | `/courses` | Coming-soon placeholder; `robots: noindex` |
| `app/(app)/courses/[slug]/page.tsx` | `/courses/[slug]` | Built; gated |
| `app/(app)/courses/[slug]/[lesson-slug]/page.tsx` | `/courses/[slug]/[lesson-slug]` | Built; gated |
| `app/(app)/sign-in/page.tsx` | `/sign-in` | Built; `robots: noindex` |
| `app/(app)/welcome/page.tsx` | `/welcome` | Built; gated |
| `app/(app)/account/page.tsx` | `/account` | Built; gated |
| `app/(app)/account/[path]/page.tsx` | `/account/[path]` | Catch-all; placeholder |
| `app/(app)/community/page.tsx` | `/community` | Built; gated; `robots: noindex` |
| `app/(app)/community/post/[id]/page.tsx` | `/community/post/[id]` | Built; gated |
| `app/(app)/auth/[path]/page.tsx` | `/auth/[path]` | Neon Auth callback handler; reachable, unproven |
| `app/(app)/internal/pages/page.tsx` | `/internal/pages` | Live; `noindex` |
| `app/(app)/onboarding/page.tsx` | `/onboarding` | Built; not needed for launch |
| `app/(app)/opengraph-image.tsx` | OG image | Live |
| `app/(app)/layout.tsx` | `(app)` layout | Wraps all app routes |

### `(payload)` group — admin

| File | Route | Status |
|---|---|---|
| `app/(payload)/admin/[[...segments]]/page.tsx` | `/admin` | Live |
| `app/(payload)/admin/[[...segments]]/layout.tsx` | `/admin` layout | Live; imports `@payloadcms/next/css` |
| `app/(payload)/api/[...slug]/route.ts` | `/api/[...slug]` (Payload REST) | Live |

### Root-level app files

| File | Purpose |
|---|---|
| `app/robots.ts` | robots.txt — training crawlers blocked; private paths disallowed for `*` |
| `app/providers.tsx` | Client providers (React Query etc.) |

---

## API Routes

| File | Method | Auth | Status |
|---|---|---|---|
| `app/api/webhooks/drive-content-sync/route.ts` | POST | `X-Webhook-Secret` | Live |
| `app/api/webhooks/parent-content-sync/route.ts` | POST | `X-Webhook-Secret` (`PARENT_CONTENT_WEBHOOK_SECRET`) | Live (untested end-to-end) |
| `app/api/org-inquiry/route.ts` | POST | none | Live |
| `app/api/interest-signups/route.ts` | POST | none | Live |
| `app/api/auth/[...path]/route.ts` | any | Neon Auth | Reachable; unproven |
| `app/api/auth/set-role/route.ts` | POST | Neon Auth session | Built |
| `app/api/account/profile/route.ts` | GET/PATCH | Neon Auth session | Built |
| `app/api/community/posts/route.ts` | GET/POST | Neon Auth session | Built |
| `app/api/community/comments/route.ts` | GET/POST | Neon Auth session | Built |
| `app/api/community/likes/route.ts` | POST | Neon Auth session | Built |
| `app/api/search/route.ts` | GET | none | Built |
| `app/api/stripe/checkout/route.ts` | POST | Neon Auth session | Built; untested |
| `app/api/stripe/webhook/route.ts` | POST | Stripe signature | Built; untested |

**Removed (graveyard or deleted in Task 1A):**
- `app/api/refresh/route.ts` — superseded
- `app/api/research-bible/notify-change/route.ts` — superseded
- `app/api/account/pending-reviews/route.ts` — audit log only, removed
- `app/api/account/pending-reviews/[id]/approve/route.ts` — removed
- `app/api/account/pending-reviews/[id]/reject/route.ts` — removed

---

## Lib Modules

| Module | Purpose | Status |
|---|---|---|
| `lib/auth/server.ts` | Neon Auth server-side session | Active |
| `lib/auth/client.ts` | Neon Auth client-side hooks | Active |
| `lib/db/index.ts` | Drizzle ORM instance (Neon) | Active (Drizzle removal in Task 2) |
| `lib/db/schema.ts` | Full Drizzle schema: profiles, community, courses, Stripe | Active (Task 2 migration target) |
| `lib/google/drive.ts` | Google Drive REST client | Active |
| `lib/google/sheets.ts` | Google Sheets REST client | Active |
| `lib/google/serviceAccountAuth.ts` | Service account JWT auth | Active |
| `lib/google/docs.ts` | Google Docs reader (unused in pipeline) | Low-use; keep for now |
| `lib/google/htmlToMdx.ts` | HTML → MDX converter | Low-use; keep for now |
| `lib/google/mdxComponentTokens.ts` | MDX component token helpers | Low-use |
| `lib/links.ts` | Shared URL constants + `getSiteLinks()` | Active |
| `lib/pain-points-reader.ts` | Payload `pain-points` collection reader | Active |
| `lib/research-bibles-reader.ts` | Payload `research-bibles` collection reader | Active |
| `lib/payload-client.ts` | Payload Local API client | Active |
| `lib/payload-globals.ts` | Payload globals readers (FAQ, Footer, SiteSettings, About) | Active |
| `lib/payload-courses.ts` | Payload `courses`/`lessons` readers | Active |
| `lib/research-bibles/parse.ts` | Research bible markdown parser | Active |
| `lib/research-bibles/frontmatter.ts` | Research bible YAML frontmatter reader | Active |
| `lib/research-bibles/render-mdx.tsx` | Research bible MDX renderer | Active |
| `lib/parent-content/parse.ts` | Parent content markdown parser (tested) | Active |
| `lib/parent-content/frontmatter.ts` | Parent content YAML frontmatter reader | Active |
| `lib/pain-points.ts` | Pain point type definitions | Active |
| `lib/pain-point-icons.ts` | Icon name → component map | Active |
| `lib/pain-points/teen-rebellion-panels.ts` | Teen page panel data | Active (TeenRebellionRoute unwired) |
| `lib/dashboard-data.ts` | ADHD dashboard static data | Active |
| `lib/stripe.ts` | Stripe client | Active (untested) |
| `lib/stripe-products.ts` | Stripe price IDs | Active (untested) |
| `lib/tools/tech-safety-tool-data.ts` | Tech safety wizard data | Active |
| `lib/level-thresholds.ts` | Gamification level thresholds | On hold; no callers in public routes |
| `lib/utils.ts` | `cn()` and other shared helpers | Active |

**Removed in Task 1A:**
- `lib/content-reader.ts` — zero imports
- `lib/research-bibles.ts` — zero imports (top-level type file; distinct from `lib/research-bibles/` subdir)
- `lib/entitlements.ts` — zero imports as module

---

## Payload Collections and Globals

| Name | Type | Status |
|---|---|---|
| `Users` | Collection | Active — Payload admin auth only |
| `Media` | Collection | Active |
| `Testimonials` | Collection | Active — 5 seeded |
| `PainPoints` | Collection | Active — 10 seeded |
| `AwarenessModules` | Collection | Active — 2 seeded |
| `ResearchBibles` | Collection | Active — 36+ seeded |
| `DeepDives` | Collection | Active — 36 seeded |
| `Courses` | Collection | Active — no published courses |
| `Lessons` | Collection | Active — no published lessons |
| `FAQ` | Global | Active — 6 items seeded |
| `Footer` | Global | Active — seeded |
| `SiteSettings` | Global | Active — seeded; not yet wired to `lib/links.ts` callers |
| `About` | Global | Active — pending Bobby copy |

---

## Outstanding Issues Found During Audit

### Security
- **WEBHOOK_SECRET in git history** — committed in `drive_content_sync_setup.md` at commit `dca4b54`. File has been rewritten to remove the value. **BLOCKED-ON-BOBBY:** rotate `WEBHOOK_SECRET` in Vercel and Apps Script.
- **Open redirect in `/sign-in`** — fixed (validates `returnTo` starts with `/` and not `//`).

### Dead code remaining
- `lib/level-thresholds.ts` — gamification is on hold; no active callers. Candidate for graveyard in Task 2.
- `lib/google/docs.ts`, `lib/google/htmlToMdx.ts`, `lib/google/mdxComponentTokens.ts` — low-use, kept for now; review in Task 9.
- `app/(app)/onboarding/page.tsx` — not needed for launch; candidate for graveyard.

### Drizzle (Task 2 target)
- `lib/db/schema.ts` and `lib/db/index.ts` are the entire Drizzle layer. Task 2 moves all tables to Payload and removes Drizzle.
- API routes that use Drizzle: `app/api/community/posts`, `app/api/community/comments`, `app/api/community/likes`, `app/api/account/profile`, `app/api/auth/set-role`.

### Content pipelines
- Research bible pipeline: Apps Script trigger installed; first live sync unconfirmed.
- Parent content pipeline: Apps Script project not created; `PARENT_CONTENT_WEBHOOK_SECRET` not set in Vercel.

### Env vars not confirmed in Vercel Production
- `PARENT_CONTENT_WEBHOOK_SECRET` — not set
- `INTEREST_SIGNUPS_SHEET_ID` — status unknown
- `NEON_AUTH_BASE_URL` — status unknown (required for visitor auth)
