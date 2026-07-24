# Research Bible Website — Project Memory

This file is the persistent context for this project. Read this before starting any work.

## What this project is

A website with two distinct sections:
1. **Homepage/marketing site** — subscribe, book a call, overview of the parenting practice's offerings
2. **Research bible deep-dive pages** — wiki-style content pages (left nav, right TOC) covering psychology/parenting/neurodivergence topics, plus a quick-reference dashboard view per topic

Content source of truth lives in Google Drive — this site reads/renders that content, it does not duplicate editing.

## Tech Stack (locked in — do not substitute without asking)

| Layer | Tool |
|---|---|
| Framework | Next.js (App Router) |
| Docs/content shell | **Fumadocs** — sidebar nav, TOC, search, MDX rendering for deep-dive pages |
| UI components & page sections | **shadcn/ui** + **ShadcnSpace** (free block/component library by WrapPixel) |
| Animation | **Motion** (motion.dev, formerly Framer Motion) |
| Booking | **Cal.com** — has a ready shadcn/Next.js booking widget |
| Subscribe | **Substack native embed** (existing Substack list, no new list to maintain) |
| Database | **Neon** (serverless Postgres) |
| Auth | **Neon Managed Better Auth** (`@neondatabase/auth`) — Neon-hosted, not self-hosted; see Auth & Data Layer below |
| Auth UI components | **`@neondatabase/auth-ui`** (Neon's wrapper around daveyplate's Better Auth UI) |
| Hosting | Vercel |

## Auth & Data Layer (added July 23, 2026, revised same day — fills the account/progress gap)

**Status:** Built (code complete) as of July 23, 2026. Not yet live — needs a real Neon project (see "To go live" below). (Note: this project has never used Supabase — the reasoning below references it only because the user's own Supabase free tier, used on an unrelated app, was already exhausted, so Neon was chosen as a fully separate product/account rather than as a "migration.")

**Why this was needed:** ShadcnSpace is UI-only — blocks look right but have no backend. Sign up, sign in, account management, and lesson progress tracking all require an actual auth system and database, which wasn't decided in v2.

**Architecture pivot (read this before touching auth code):** the original plan below was self-hosted Better Auth (`better-auth` + `@daveyplate/better-auth-ui`, our own Next.js server instance, "no vendor lock-in"). During implementation the user explicitly chose Neon's one-click "Managed Better Auth" install instead, after being told this trades that ownership away: **Neon hosts the auth server**; the app never runs its own `betterAuth()` instance. It talks to Neon's hosted REST API via `@neondatabase/auth` (a wrapper around `better-auth/client`) and renders UI via `@neondatabase/auth-ui` (a re-export of `@daveyplate/better-auth-ui`, restyled). This *is* a vendor dependency on Neon's auth product specifically, not just their Postgres hosting — accepted deliberately, not an oversight. If this ever needs to be walked back to self-hosted, `@daveyplate/better-auth-ui` components are still what's rendering under the hood, so the UI layer is less throwaway than the wrapper choice suggests.

| Layer | Tool | Purpose |
| :---- | :---- | :---- |
| Database | **Neon** (serverless Postgres) | Owns two things: (1) the `neon_auth` schema, fully managed by Neon itself — never migrate it by hand; (2) our own `public` schema tables (`profiles`, `topic_progress`), migrated by us via Drizzle, FK'd to `neon_auth.user.id`. Free tier: up to 100 projects, 0.5 GB storage per project, 100 compute-hours/project/month, no credit card, permanent (not a trial). |
| Auth | **Neon Managed Better Auth** (`@neondatabase/auth`, beta) | Sign up, sign in, sessions, password reset. Neon-hosted server — see architecture note above. `lib/auth/server.ts` (server instance via `createNeonAuth`), `lib/auth/client.ts` (browser client), `app/api/auth/[...path]/route.ts` (proxy handler), `proxy.ts` (middleware, currently scoped to `/account/:path*` and `/onboarding/:path*` only — the marketing site, docs, and dashboard stay public). |
| Auth UI components | **`@neondatabase/auth-ui`** (beta) | Prebuilt Sign In, Sign Up, Forgot Password, and Account/Settings views, re-exporting `@daveyplate/better-auth-ui`'s components restyled with this project's `--primary`/`--background`/etc. tokens (fallback-pattern CSS, doesn't fight the existing theme). Wired in `app/providers.tsx` (`NeonAuthUIProvider`), `app/auth/[path]/page.tsx`, `app/account/[path]/page.tsx`. |

**Known risk — read before enabling social login or the admin/organization plugins:** `npm audit` flags a **critical** advisory in the `better-auth` version currently bundled *inside* `@neondatabase/auth`/`@neondatabase/auth-ui` (≤1.6.12; we don't control this version directly, Neon does, via their nested dependency). Most of the specific CVEs are OAuth/OIDC-provider/MCP-plugin-specific (state-mismatch, stale sessions after deletion, account takeover via OAuth auto-link, XSS via `redirect_uri`). **Mitigation in place:** `app/providers.tsx` deliberately does not enable `social` or `organization` — email/password only, which sidesteps most of the listed CVEs. Do not add Google/social login or the organization plugin until `@neondatabase/auth` bumps its bundled `better-auth` past this range — check `npm audit` again first.

**Role field decision:** Better Auth's built-in `role` column (visible via `admin.setRole()`) controls *admin permission level*, not a business concept — reusing it for "parent vs. practitioner" would collide with that semantics. Instead, `lib/db/schema.ts` defines our own `profiles` table (`user_id` FK, `account_type: 'parent' | 'practitioner'`), set via a one-time `/onboarding` gate (`app/onboarding/page.tsx` + `app/onboarding/actions.ts`) that every new session is routed through (`redirectTo="/onboarding"` in `app/providers.tsx`) until a profile row exists, then bounces to `/account`.

### Why Neon (over other Postgres/backend options)
- Free tier is genuinely permanent, not a trial, and doesn't require a credit card.
- Fully separate account from any other project's backend — no shared quota risk.
- (No longer "pairs natively with self-hosted Better Auth" — superseded by the Managed Better Auth pivot above; the pairing is now Neon's own product, not an integration between two independent open-source tools.)

### Why Managed Better Auth over self-hosted Better Auth (revised reasoning)
The original self-hosted reasoning ("TypeScript-native, we own the user table, no vendor lock-in") is preserved in git history but no longer reflects what's built. The user chose the managed path knowing it trades ownership for less code to maintain and Neon's branch-aware auth state (auth data branches with the database). This is a real, acknowledged vendor dependency on Neon's auth product — see the architecture pivot note above.

**Reconciling with "lean Next.js app over a full SaaS boilerplate" (see Why These Choices below):** that principle was about avoiding *unused* billing/multi-tenancy plumbing that comes bundled in SaaS starter repos. Auth + a database are not unused — sign-up, account management, and progress tracking are real, needed features for this product.

### What this unlocked (built July 23, 2026)
- [x] Sign up / sign in pages — `app/auth/[path]/page.tsx` (`AuthView`, all Better Auth UI paths: sign-in, sign-up, forgot-password, reset-password, two-factor, etc.)
- [x] Account management page — `app/account/[path]/page.tsx` (`AccountView`)
- [x] Route protection — `proxy.ts` middleware, scoped to `/account` and `/onboarding`
- [x] Lesson/topic progress tracking table — `topic_progress` in `lib/db/schema.ts` (`user_id`, `topic_id`, `last_viewed_at`, `completion_state`, unique per user+topic)
- [x] Role-based field (parent vs. practitioner) — `profiles.account_type`, set via `/onboarding` on first login (see "Role field decision" above)
- [ ] **To go live:** the user needs to actually enable Managed Better Auth in the Neon console (creates the project + `neon_auth` schema), then put the real `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET` (32+ chars, `openssl rand -base64 32`), and `DATABASE_URL` into `.env.local` (see `.env.example` for the full list — never commit real values). `.env.local` currently holds placeholder/dummy values used only to verify the build compiles.
- [ ] Once real env vars are in place: run `npm run db:push` (or `db:generate` + a migration step) to create `profiles` and `topic_progress` in the real database, then smoke-test sign-up → onboarding → account flow end-to-end.
- [ ] Forgot password / email verification — the prebuilt `AuthView` paths exist (`/auth/forgot-password`, `/auth/reset-password`) but haven't been exercised against a real project yet.

**Do not use:** Framer (no-code builder — rejected, can't support future auth/booking/paywall), Rubix Documents (solo-maintained docs template — rejected, longevity risk), Aceternity UI / Magic UI Pro (paid tiers — cost-prohibitive, avoid), a full SaaS-starter boilerplate (unneeded billing/multi-tenancy plumbing — keep this lean), Supabase (not used on this project), self-hosted `better-auth`/`@daveyplate/better-auth-ui` (superseded by Managed Better Auth — see architecture pivot note; don't reintroduce without a deliberate decision to revert).

## Theme Tokens (locked in)

--background: 
#0F1B2D (deep navy)
--foreground: 
#F5F3EC (off-white)
--card: 
#16253B (lifted navy)
--border: 
#2A3A50
--muted-foreground: 
#B8AE96 (khaki-gray)

--primary: 
#1B3A5C (navy)
--secondary: 
#C4B896 (khaki)
--accent: 
#FFFFFF (white — use SPARINGLY: active states, highlights,
current TOC item, hover underlines. Never large blocks.)


Typography: Geist or Inter (headings + body), Geist Mono (code/data values).
Spacing: 4px base unit. Radius: 8px cards/panels, 6px buttons/inputs.

## Homepage — build with ShadcnSpace free blocks

**Status: built.** Placeholders replaced with real blocks — see `components/marketing/`.

| Section | ShadcnSpace category | Component |
|---|---|---|
| Hero | Marketing → Hero Section | `hero.tsx` + `header.tsx` (Hero 01 — Agency Hero Section, nav bundled in) |
| About / who it's for | Marketing → About Us Section | `about.tsx` (About Us 01 — Impact Metrics, stat counters removed — fabricated numbers) |
| Services overview (courses, groups, 1-on-1s, CPRS training) | Marketing → Bento Grid or Feature Section | `services.tsx` (Feature 02 — Three Columns with Icons) |
| Credibility | Marketing → Testimonials | `testimonials.tsx` (Testimonial 02 — Slider Showcase, simplified to single labeled placeholder card — no real quote yet) |
| Subscribe | Marketing → Feature/CTA block, holding Substack embed | not yet wired to real Substack embed code |
| Book a call | Pages → Contact (repurposed) or Feature block → Cal.com embed | not yet wired to real Cal.com event |
| FAQ | Pages → FAQ | not yet built |
| Footer | Marketing → Footer Section | `footer.tsx` (Footer 01 — Agency Footer Layout; email + social links are placeholders) |
| About Bobby | Marketing → About Us Section, repurposed | not yet built |
| (Future) Gated content login | Marketing → Login — now relevant, see Auth & Data Layer above | not yet built — will use Better Auth UI instead of a static ShadcnSpace Login block |

**Known placeholders still to replace before launch:** testimonial quote/name, footer email (`hello@example.com`) and social `href="#"` links, Substack embed code, Cal.com event embed, FAQ section, About Bobby page.

## Quick-Reference Dashboard + Deep-Dive Pages

| Need | ShadcnSpace category | Status |
|---|---|---|
| Dashboard shell / panel layout | Dashboard UI → Dashboard Shell | done — `components/dashboard/shell.tsx` |
| Individual quick-reference cards | Dashboard UI → Widgets Component | done — `components/dashboard/stat-card.tsx` |
| Consensus meter / data visuals | Dashboard UI → Charts Component | done — `components/dashboard/consensus-chart.tsx` (Recharts, dashboard route) |
| "Where Experts Disagree" comparison tables | Dashboard UI → Datatable | done — `components/dashboard/disagreement-table.tsx` (TanStack Table, dashboard route) |
| Intake/contact forms | Dashboard UI → Forms | not started |
| Empty/no-results states | Dashboard UI → Empty State | not started |

**Do NOT use ShadcnSpace's Sidebars block** — Fumadocs already generates the docs nav; a second sidebar component duplicates that work. Ecommerce blocks (checkout, product listing) are also not needed yet — only relevant if a future storefront (e.g. CPRS Training Program) needs a real cart.

Deep-dive pages are Fumadocs' shell (auto-generated sidebar + TOC from content structure) with custom MDX components dropped into the body — image galleries, embedded video, interactive charts, comparison panels. Not just text.

**MDX component templates (built July 23, 2026):** `components/mdx/` holds four topic-agnostic, reusable components, registered in `mdx-components.tsx` (`getMDXComponents`, used by `app/docs/[[...slug]]/page.tsx`) so any `.mdx` file can use them by tag name:
- `ConsensusMeter` — inline evidence-strength bars with hover detail (lightweight CSS, not Recharts — meant for embedding directly in prose, distinct from the dashboard route's `ConsensusChart`). Live example: `content/docs/adhd.mdx`, sourced from `content/data/adhd.json`'s `consensusMeter`.
- `ComparisonPanel` — strong-claim/softer-claim two-column cards, with a "Flagged for review" badge. Live example: `content/docs/adhd.mdx`, sourced from `whereExpertsDisagree`.
- `ImageGallery` — responsive grid + click-to-expand lightbox (new `components/ui/dialog.tsx`, `@base-ui/react/dialog`). Not yet used on any live page — no real topic images exist yet.
- `VideoEmbed` — responsive 16:9 iframe with a click-to-load facade (no autoplay/tracking until clicked). Not yet used on any live page — no real topic video exists yet.

To use these for a new topic: import that topic's `content/data/[topic].json` at the top of its `.mdx` file, then drop `<ConsensusMeter items={data.consensusMeter.items} .../>` etc. into the prose — see `content/docs/adhd.mdx` for the pattern.

**Route:** `/dashboard/[topic]`, reading data from `content/data/[topic].json`. Dashboard Shell provides this route's own nav/layout since it lives outside Fumadocs entirely. First real topic: ADHD — `content/data/adhd.json` (dashboard data) + `content/docs/adhd.mdx` (deep-dive page), both built from the internal ADHD Research Bible + ADHD Parent Guide v2.

**Known open item in the ADHD data:** the Research Bible cites a 20–30% learning-disability co-occurrence rate; the Parent Guide cites ~46%. Flagged in `adhd.json` (`whereExpertsDisagree` + `openQuestionsForReview`) and in `adhd.mdx` (callout) — reconcile with the source before this goes live. Also missing: full citation for "Jensen et al., 2001" (depression co-occurrence rate), referenced inline but absent from the Research Bible's AMA reference list.

## Google Drive Integration

**Status:** Built (code complete) as of July 23, 2026. Not yet live — needs the manual Google Cloud steps below before it can sync real content.
**Goal:** Edit a topic's Google Doc/Sheet → within minutes, the site reflects it. No manual export step, no runtime Drive fetches on every page load.

### Two content types sync differently

| Content type | Where it lives | Sync approach |
|---|---|---|
| Deep-dive prose (Fumadocs `.mdx`) | `content/docs/[topic].mdx` | Drive Doc → HTML export → MDX conversion → write file |
| Dashboard data (consensus meter, disagreement rows, stats) | `content/data/[topic].json` | Drive Sheet tab → row parser → JSON builder → write file |

### Architecture (as built)

```
Google Drive (source of truth)
│
├─ Research Bible Doc ──► Drive export (HTML) ──► lib/google/htmlToMdx.ts ──► content/docs/[topic].mdx
└─ Dashboard Data Sheet ─► Sheets values.get ────► lib/google/sheets.ts ────► content/data/[topic].json
│
▼
Google Apps Script (NOT Vercel Cron — decided deliberately, see below)
│
▼
POST /api/refresh { type, topic, docId|sheetId } ──► revalidatePath
```

**Trigger mechanism is Apps Script, not Vercel Cron or Drive push notifications** — recorded here so it isn't re-decided later. `drive_sync_setup` (repo root, untracked — paste into script.google.com, not this repo) contains the script: a time-driven trigger polls the Doc's last-modified time every 10 min (Docs have no native edit-event trigger); an installable `onEdit` trigger fires instantly on Sheet edits. Both call `/api/refresh` with a shared secret.

### Auth (for the Drive service account — separate from user-facing Neon Managed Better Auth above)

Hand-rolled JWT Bearer flow in `lib/google/serviceAccountAuth.ts` — `fetch` + `node:crypto` only, **no `googleapis`/`google-auth-library` package** (banned per the hard rules above). Signs a JWT with the service account's private key, exchanges it at `oauth2.googleapis.com/token`, caches the access token in-memory per warm invocation. Scopes: `drive.readonly`, `spreadsheets.readonly`.

Env vars (in `.env.local` / Vercel): `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (PEM, newlines escaped as literal `\n`), `WEBHOOK_SECRET` (must match Apps Script's `CONFIG.webhookSecret` exactly).

### Sync endpoint

`app/api/refresh/route.ts` (`export const runtime = "nodejs"` — uses `node:crypto`/`node:fs`, must not run on Edge). Verifies `X-Webhook-Secret` via `crypto.timingSafeEqual`, validates the payload's `topic`/`docId`/`sheetId` against `content/sync-config.json` (an allowlist — a valid secret alone isn't enough to fetch/write an arbitrary ID), then branches:
- **`type: "doc"`** — `lib/google/docs.ts` (`fetchDocAsHtml`) → `lib/google/htmlToMdx.ts` (`convertDocHtmlToMdx`, using `unified`/`rehype-parse`/`rehype-remark`/`remark-gfm`/`remark-stringify` — new direct dependencies, promoted from fumadocs' transitive deps for stability). Converts fully in memory and validates (non-empty, has a `##` heading, no unresolved tokens) **before** writing — a failed/malformed conversion never touches the existing file.
- **`type: "sheet"`** — `lib/google/sheets.ts` (`fetchSheetValues`, `buildDashboardJson`). Same non-destructive rule.
- Both call `revalidatePath` on success (`/docs/[topic]` or `/dashboard/[topic]`) and always return `{success, topic, type, error?}` JSON.

### Doc → MDX: preserving embedded components

`content/docs/adhd.mdx` embeds live MDX components mid-prose (`<ConsensusMeter>`, `<ComparisonPanel>`, `<Callout>`) that a Doc's HTML export can't represent. Two conventions handle this:
1. **Frontmatter + data import preserved verbatim.** Sync only replaces the body below the last import line — never regenerates `title`/`description` or the `import {topic}Data from "@/content/data/[topic].json"` line.
2. **Placeholder tokens, typed directly in the Doc**, registered in `lib/google/mdxComponentTokens.ts`: `[[ConsensusMeter]]` and `[[ComparisonPanel]]` (single-line, fully data-driven, swapped for real JSX) and `[[Callout title="..."]] ... [[/Callout]]` (wraps the enclosed Doc prose in `<Callout>`). Add a registry entry when a new component/topic needs one. An unresolved `[[...]]` marker in the converted output fails the sync rather than silently dropping content.

### Sheet → JSON: v1 scope

`content/sync-config.json` maps each topic to its Drive IDs and Sheet tab name:
```json
{
  "adhd": {
    "docId": "<research-bible-doc-id>",
    "sheetId": "<dashboard-data-sheet-id>",
    "sheetTab": "adhd"
  }
}
```
Sheet rows are tagged by a `section` column (`heroStat`, `quickStat`, `consensusItem`, `disagreementRow`, `coOccurring`, `citation` — see `lib/google/sheets.ts` for the exact column layout per section) and shallow-merged into the existing JSON. **Deliberately out of Sheet-sync scope for v1:** `panels`, `redFlags`, `resources`, `openQuestionsForReview`, and section titles/descriptions (`consensusMeter.title`, etc.) — these stay hand-edited in the JSON file, untouched by every sync. Revisit only if a future topic needs them sheet-driven.

### Error handling

- Failed fetch/conversion → return `500` with details, do **not** overwrite the existing file (stale-but-correct beats broken).
- Unknown topic or a payload ID that doesn't match `sync-config.json` → `400`, no fetch attempted at all.

### To go live (manual steps, not code)

1. Google Cloud Console: enable Drive/Docs/Sheets APIs, create a service account + JSON key.
2. Share the real ADHD Doc and dashboard Sheet with the service account's email (Viewer).
3. Fill in real `docId`/`sheetId`/`sheetTab` in `content/sync-config.json`.
4. Put real values in `.env.local` (and Vercel env vars) for `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, `WEBHOOK_SECRET`.
5. Paste `Code.gs` from `drive_sync_setup` into script.google.com with matching IDs/secret, run `setup()` once.
6. Build the ADHD dashboard Sheet (migrating `adhd.json`'s flat fields into the `section`-tagged row layout above) — not yet done, currently only hand-edited JSON exists.

## Why these choices (context if questioned later)

- **Fumadocs over Framer**: Framer can't support future auth/booking/paywall needs. Fumadocs' headless core (fumadocs-core/fumadocs-ui split) can be fully reskinned without fighting the framework.
- **Fumadocs over Rubix Documents**: Rubix is a solo-maintained template (~138 stars) — longevity risk for a durable business asset. Fumadocs is actively maintained with a much larger community.
- **ShadcnSpace over Aceternity/Magic UI**: same shadcn/Tailwind/Motion foundation, but free tier (371+ blocks, 385+ components, 25+ pages) covers everything needed with no paid tier required. Built by an established team (WrapPixel), not a solo project.
- **Lean Next.js app over a full SaaS boilerplate**: avoids inheriting *unused* billing/multi-tenancy plumbing bundled into SaaS starter repos. This does not mean "no auth" — auth and progress tracking are real product requirements, which is why Neon + Better Auth were added individually (see Auth & Data Layer) instead of adopting a full boilerplate.

## Next Steps

1. ~~Scaffold Next.js + Fumadocs project~~ — done, committed as initial scaffold
2. ~~Set up shadcn/ui + theme tokens above~~ — done
3. ~~Pull ShadcnSpace free blocks per the homepage map above~~ — done (real placeholders noted above still need swapping before launch)
4. ~~Finish the Quick-Reference Dashboard route (`/dashboard/[topic]`) using ShadcnSpace Dashboard Shell + Widgets + Charts + Datatable, reading from `content/data/adhd.json`~~ — done, committed `28a8d41`
5. ~~Build remaining custom MDX components for deep-dive pages (consensus meter, comparison panels, image galleries, video embed) not already covered by ShadcnSpace Dashboard UI blocks~~ — done, `components/mdx/` + `mdx-components.tsx`, not yet committed
6. Set up Cal.com event type + embed
7. Set up Substack embed on homepage
8. ~~Build out Google Drive Integration~~ — code side done: `app/api/refresh/route.ts` + `lib/google/` (see Google Drive Integration section above), `npm run build`/`lint`/`tsc` all pass, conversion logic verified against fixtures; not yet committed. Still needs the "To go live" manual steps (real service account, real Doc/Sheet IDs, Apps Script deployed) before it syncs real content.
9. ~~Provision Neon Postgres database + run one-click Better Auth install~~ — code side done (architecture pivoted to Managed Better Auth, see Auth & Data Layer above); the user still needs to actually enable Managed Better Auth in the Neon console and supply real env vars — not yet committed
10. ~~Install Better Auth UI components and wire up Sign Up, Sign In, and Account Settings pages~~ — done via `@neondatabase/auth-ui` (not the originally-planned `bunx shadcn add .../auth.json` command — see Auth & Data Layer architecture pivot), not yet committed
11. ~~Design and create the lesson/topic progress tracking table in Neon~~ — schema done (`topic_progress` in `lib/db/schema.ts`), not yet migrated against a real database, not yet committed
12. ~~Add role field (parent vs. practitioner) to the Better Auth user record, set at signup/purchase~~ — done as `profiles.account_type`, set via `/onboarding` gate rather than the Better Auth user record itself (see "Role field decision" above), not yet committed
13. Build Homepage's About Bobby page and remaining placeholder swaps
14. Once the user has enabled Managed Better Auth in the Neon console and dropped real env vars into `.env.local`: run `npm run db:push`, then smoke-test sign-up → onboarding → account end-to-end
15. Watch `npm audit` for a patched `@neondatabase/auth`/`better-auth` release (currently a critical advisory in the bundled version) before ever enabling social login or the organization/admin plugins