# CLAUDE.md — ResearchBibleWebsite

**Repo:** BobbyW08/ResearchBibleWebsite · `main` branch
**Local path:** `C:\dev\ResearchBibleWebsite`
**Shell:** PowerShell
**Hosting:** Vercel (watches `main`)

This file states current facts only — what the site is, what's live, what's in progress, what's not built. No changelog, no history, no "as of" dates, no superseded plans. If something here doesn't match the code, the code wins — flag the mismatch and fix this file in the same session.

---

## Working Rules for Claude Code

- **Trust this file's facts without re-verifying via `grep`/`find`/`Read` first.** Use the File Map below to go straight to the right file instead of exploring the tree.
- **`AGENTS.md`** only requires reading `node_modules/next/dist/docs/` for genuinely unfamiliar Next.js 16 APIs — not for every edit. Content/styling/component changes don't need it.
- **If you find code that contradicts this file** — stop, confirm the real state, and correct this file before moving on.
- **JSON edits:** use the Python scripting pattern under Build Rules, never manual editing.
- **Before every commit:** `npm run build`, `npm run lint`, and `npx tsc --noEmit` must all exit zero.
- **Iterate in a branch** without committing until ready. Never commit a broken build.
- Give commands one at a time; keep file content and terminal commands clearly separated.

---

## What This Project Is

**bobby-washburn.com** — a parenting education / peer-support site for Bobby Washburn's private practice.
- Positions Bobby as a Certified Peer Recovery Specialist (CPRS) — peer support, not clinical treatment
- Connects visitors to booking (Cal.com `/intro-call`), newsletter modal (Substack embed), social (LinkedIn; Instagram disabled)
- Free, ungated parent-facing content: Pain Point pages (triage) and Deep Dive pages (research-backed)
- No paywall, no auth gates on content at launch. Community and courses platform built but not yet live.

Content philosophy: research bibles are internal practitioner documents. Parent-facing content derives from them — warm peer-to-peer tone, 8th-grade reading level, no visible citations.

---

## Auth Architecture

Two auth systems coexist. They are completely independent.

**Payload admin auth** — Built into Payload. Bobby's `/admin` account created at `/admin/create-first-user`. Exists only in Payload's `users` table. No relationship to site visitor accounts.

**Neon Auth (visitor auth)** — `@neondatabase/auth` and `@neondatabase/auth-ui`. Env vars `NEON_AUTH_BASE_URL` and `NEON_AUTH_COOKIE_SECRET` already in Vercel. Handles sign-in, sign-up, and Google OAuth for parents and professionals. Auth tables live in the `neon_auth` schema of the existing Neon Postgres instance. Never check Payload auth on visitor routes or Neon Auth on admin routes.

---

## Brand System (locked)

| Role | Value |
|---|---|
| Title (hero-level) | Archivo — placeholder for "Philly Sans" (licensing pending). One-line swap: `titlePlaceholder` component + `--font-title-placeholder` in `app/layout.tsx` |
| Subtitle | **Arvo** — final. `arvo` / `--font-arvo` in `app/layout.tsx`, aliased to `--font-subtitle` / `font-subtitle` in `app/globals.css` |
| Heading / Body | Libre Franklin — final. `libreFranklin` → `--font-heading` / `--font-sans` |
| Quotes | Caveat — final. `font-quote` utility |
| Red (primary) | `#9F0000` (`--primary` / `bg-primary` / `text-primary`) |
| Near-black | `#111111` (`--foreground`, `--secondary`, `--brand-black`) |
| Off-white | `#F8F8F8` (`--background`, `--brand-offwhite`) |
| Gradient | 180°, `#111111` → `#9F0000` — `.bg-brand-gradient`. Secondary asset only |
| Charcoal (inverted sections) | `#262626` (`--brand-charcoal`) — Services "My Approach" section |
| Bright red (headers on dark) | `#F0342F` (`--brand-red-bright`) — headings on charcoal surfaces only |

All tokens are CSS custom properties in `app/globals.css`. One deliberate light identity — no dark mode.

---

## Tech Stack (locked — no new dependencies without approval)

- **Framework:** Next.js 16 (App Router)
- **UI components:** shadcn/ui + ShadcnSpace (free tier)
- **Animation:** Motion
- **Booking:** Cal.com — direct outbound links to `intro-call` (not embedded), except one Cal popup on the Teen page's pinned CTA
- **Newsletter:** Substack embed in `components/marketing/newsletter-dialog.tsx`. Subdomain in `lib/links.ts`
- **CMS:** Payload CMS 3.90.2 — installed, building. Admin at `/admin`. 9 collections, 4 globals. Schema in `payload.config.ts` (repo root). Collections and globals source in `src/payload/`. **Payload DB tables don't exist yet** — Bobby must run migrations and visit `/admin/create-first-user`. Migration script: `npx tsx scripts/migrate-to-payload.ts`.
- **Payments:** Stripe — scaffolded (`lib/stripe.ts`, `lib/stripe-client.ts`, `lib/stripe-products.ts`). Checkout and webhook routes not yet built.
- **Database:** Neon Postgres — provisioned. `neon_auth` schema exists. Payload uses `DATABASE_URI`; Drizzle uses `DATABASE_URL` (same connection string, different var names, both in `.env.local`).
- **Hosting:** Vercel
- **Server-side integrations:** hand-rolled REST clients only — no `googleapis`, no Octokit.

Do NOT use: Framer, Keystatic, Fumadocs, Aceternity UI, Magic UI Pro, Supabase, self-hosted better-auth, any SaaS boilerplate.

---

## Site Map

### Public Routes

| Route | Purpose | Status |
|---|---|---|
| `/` | Homepage | Live |
| `/about-bobby` | About Bobby | Live. `/about` 301s here |
| `/services` | Services for Parents | Live, static content |
| `/services/organizations` | Services for Organizations | Live, static content. CTA is `mailto:` placeholder |
| `/common-pain-points` | Pain Point index (10 cards + 2 modules) | Live. `/help` 301s here |
| `/common-pain-points/teen` | Teen pain point — uses `PainPointSidebarLayout` for launch | Live (temporary layout) |
| `/common-pain-points/[slug]` | Other 9 pain points + 2 awareness modules | Live. `/help/[slug]` 301s here |
| `/docs` | 36-topic categorized gallery | Live |
| `/docs/adhd` | ADHD Deep Dive — dedicated route with 8 interactive components | Live |
| `/docs/[topic]` | 35 remaining deep dives | Live as prose |
| `/dashboard` | Redirects to `/dashboard/adhd` | Live |
| `/dashboard/adhd` | ADHD quick-reference dashboard | Live |
| `/dashboard/[topic]` | Other topic dashboards | Not built — needs JSON data |
| `/tools` | Tools index (unlisted) | Live |
| `/tech-safety` | Tech Safety wizard | Live, unlisted. `/tools/tech-safety-tool` 301s here |
| `/research` | Research Bible Library index | Live, unlisted — no entries yet |
| `/research/[slug]` | Individual research bible | Live pattern, no entries |
| `/legal` | Legal & Disclaimers | Live, static |
| `/courses` | Course listing | Coming-soon state only |
| `/privacy` | Privacy policy | Not yet built (Part P) |

### Auth / Account Routes (not needed for launch)

| Route | Status |
|---|---|
| `/sign-in` | Not yet built (Part L) |
| `/welcome` | Broken — see Open Items |
| `/community` | Not yet built (Part M) |
| `/courses/[slug]` | Not yet built (Part N) |
| `/courses/[slug]/[lesson-slug]` | Not yet built (Part N) |
| `/account` | Not yet built (Part O) |

### CMS / Admin / Internal

| Route | Status |
|---|---|
| `/admin` | Built and building. Requires Payload manual steps before it works |
| `/internal/pages` | Live, `noindex` |

### Dormant Routes

| Route | Status |
|---|---|
| `/auth/[path]` | Reachable, unproven end-to-end |
| `/onboarding` | Not needed for launch |
| `/api/refresh` | Not wired. Doc→MDX half superseded by Drive webhook. Do not build further |
| `/api/research-bible/notify-change` | Superseded. Do not build further |
| `/api/account/pending-reviews` | Audit log only — candidate for removal |

**301 redirects** (`next.config.ts`): `/about` → `/about-bobby`, `/tools/tech-safety-tool` → `/tech-safety`, `/help` → `/common-pain-points`, `/help/:slug` → `/common-pain-points/:slug`, `/tech-consequences` → `/tech-safety`.

---

## Homepage Structure

Section order in `app/page.tsx`:

1. **Header** (`components/marketing/header.tsx`) — nav: About, Start Here (`/#start-here`), Parents (`/services`), FAQs (`/#faq`). Organizations is not in the header — reached via Start Here Row 2 or footer. On the homepage only, header is transparent over the hero and renders light-on-dark.
2. **Hero — "Proof Wall"** (`hero.tsx` + `proof-wall-hero.tsx`) — flat `bg-brand-black` field. Five tilted testimonial cards (cursor-parallax) around a two-tone headline. Cards sourced from Payload `testimonials` collection with hardcoded fallback. Mobile uses `MobileTestimonialCarousel` (horizontal scroll-snap, auto-advance). CTA links to Cal.com intro-call.
3. **Start Here** (`start-here.tsx`) — Row 1: Tech Safety tool tile (video) + Common Pain Points scrollable list. Row 2: three equal panels — Parents → `/services#one-on-one`, Groups → `/services#weekly-group`, Organizations → `/services/organizations`. Row 2 uses temp Unsplash stock photos.
4. **Quick Credential** (`quick-credential.tsx`) — Bobby's photo + 5 credential lines + "Learn more" → `/about-bobby`.
5. **FAQ** — 6 Q&As from Payload `faq` global with hardcoded fallback.
6. **Footer** — left: sitemap (About, Start Here, Parents, Organizations, FAQs), right: Connect (Cal.com, newsletter, email, LinkedIn). Set in Arvo (`font-subtitle`).

---

## Services Pages

**`/services` (For Parents):**
- Hero: pinned scroll section (`components/marketing/services/wedged-hero-headline.tsx`) — "We Build"/"Your Path" converge over a looping video, then "Together" reveals. **Known issue:** `public/videos/paths-loop.mp4` fails to decode in Chrome (non-faststart encoding) — renders as black box until Bobby re-exports the video.
- "My Approach" section: `ModalityCards` (`components/marketing/services/modality-cards.tsx`) — 4 flip-cards at `sm`+, accordion on mobile. Inverted palette (`bg-brand-charcoal`).
- "What I Offer": 4 `OfferCard`s. 1:1 Sessions → Cal.com. Weekly Group/Live Q&As/Cohorts → `InterestSignupWidget` POSTs to `/api/interest-signups`.
- `OfferCard`s for 1:1 Sessions and Weekly Group have anchor IDs (`#one-on-one`, `#weekly-group`) for Start Here deep links.

**`/services/organizations`:** Hero → 4 offer cards → `mailto:` CTA. Full rebuild pending (v18 Part P).

---

## Pain Point Pages

Custom layout — not Fumadocs. All 10 slugs + 2 modules render via `PainPointSidebarLayout` (`components/marketing/pain-point-sidebar-layout.tsx`). Data from Payload `pain-points` and `awareness-modules` collections via `lib/pain-points-reader.ts` (try/catch fallback to `[]`).

| Slug | Topic | Deep-dive link |
|---|---|---|
| `meltdowns` | My kid melts down over everything | `de-escalation-crisis-planning` |
| `screens` | What do I do about screens? | `screen-gaming-compulsive-use` |
| `wontlisten` | My kid won't listen | `understanding-child-behavior` |
| `anxiety` | My kid is anxious and won't go to school | `anxiety-depression-children` |
| `bedtime` | Bedtime battles | `healthy-bodies-calm-homes` |
| `homework` | The homework war | `school-assistance-parent-guide` |
| `aggression` | My kid hits, bites, or throws things | `supporting-aggressive-children` |
| `routines` | Morning chaos — routines | `structure-routines-parenting` |
| `teen` | My teenager hates me | `teen-autonomy-identity-support` |
| `burnout` | I'm burnt out | `parental-self-care` |
| `modern` (module) | Why modern parenting is so hard | — |
| `mentalhealth` (module) | Children's mental health in the U.S. | — |

**Icon name strings** are resolved via `lib/pain-point-icons.ts` — keep in sync with the Payload `PainPoints` collection's `APPROVED_ICONS` list.

---

## Teen Page (`TeenRebellionRoute` — not currently wired)

`app/common-pain-points/teen/page.tsx` temporarily renders `PainPointSidebarLayout` for launch. The newspaper-mosaic-grid rebuild (`TeenRebellionRoute`) exists in `components/pain-points/teen-route/` and still builds — swap `teen/page.tsx`'s JSX back to `<TeenRebellionRoute />` when ready. Content in `lib/pain-points/teen-rebellion-panels.ts`. The pinned CTA panel (`pinned-cta-panel.tsx`) uses Cal.com popup — the only place on the site using Cal's popup pattern.

---

## Deep Dive Topics (`/docs/[slug]`)

36 topics in 4 pillars, rendered via Payload `deep-dives` collection. `app/docs/[slug]/page.tsx` renders Lexical `body` via `@payloadcms/richtext-lexical/react`'s `<RichText>`. `app/docs/adhd/page.tsx` intercepts `[COMPONENT: X]` markers and injects the real components from `components/mdx/adhd/index.ts`.

**🔴 Stabilize (9):** What Do You Want · De-Escalation · Parent Emotional Regulation · Structure & Routine · Understanding Behavior · **Understanding ADHD** · Understanding Autism Spectrum Disorder · Understanding Anxiety & Depression · Trauma Informed Parenting

**🟡 Connect (8):** Parental Self Care · Connection Principles · Values · Parenting Styles · Communication · Family Dynamics · Motivation · Mindsets

**🟢 Structure (6):** Applying Parenting Strategies · Child Development · Teen Autonomy and Identity · Principles of Effective Discipline · Behavior-Reward-Consequence System · Co-Parenting

**🔵 Adapt (13):** Public Places Without Panic · Supporting Aggressive Children · Household Finance & Money Skills · Healthy Bodies, Calm Homes · Big Transitions, Big Feelings · Raising Resilient and Kind Kids · Contribution and Chores · Modern Digital and Social World · Friendship and Social Coaching · Parental Mental Health & Substance Abuse · School Assistance · High Risk Kids · Modern Parenting

**ADHD components** (`components/mdx/adhd/`, barrel `index.ts`): `DualPathwayDiagram`, `DelayAversionSlider`, `EvidenceTierToggle`, `MythbusterCards`, `PathwayComparison`, `GlossaryTooltip`, `StrategyExplorer`, `TemperamentTimeline`. Open data issue: co-occurrence discrepancy (20–30% vs ~46%), flagged in MDX. Missing citation: Jensen et al. 2001.

---

## Research Bible Ingestion Pipeline

**Flow:** `research-bible-refinement` skill updates a Drive-synced bible → Drive webhook fires → `app/api/webhooks/drive-content-sync/route.ts` parses the file and writes to Payload as `_status: 'draft'` → Bobby reviews and publishes at `/admin` → live at `/research/[slug]`.

Git PRs are no longer part of this flow. `pending_reviews` is audit log only.

**Built:** `lib/research-bibles/parse.ts`, `lib/research-bibles/frontmatter.ts`, `lib/research-bibles-reader.ts`, `lib/google/drive.ts`, webhook route, `drive_content_sync_setup.md` (Apps Script reference).

**Still outstanding:**
- Not exercised end-to-end against live Drive + real Payload DB
- Apps Script trigger not installed (manual step for Bobby — see `drive_content_sync_setup.md`)
- `RB_Anxiety_and_Depression.md` will 400 until Bobby fixes its Heading 1 style in the source Doc

**Bible metadata rules:** `version` and `tags` are site-owned, never sourced from Drive. `version` auto-increments on each sync. `tags` Bobby sets manually via `/admin`.

---

## Parent Content Sync Pipeline

Manual-only Drive→GitHub-PR pipeline for Pain Point and Awareness Module content. Same pattern as bible pipeline but separate code, endpoint, and Apps Script project. Never add an automatic trigger.

**Flow:** `parent-content-builder` skill writes `PainPoint_[Name].md` / `Module_[Name].md` to Drive → Bobby manually runs `syncParentFacingContent()` from Apps Script → `app/api/webhooks/parent-content-sync/route.ts` validates, dedups, opens a GitHub PR → Bobby merges.

**Built:** `lib/parent-content/parse.ts`, `lib/parent-content/frontmatter.ts`, webhook route, `parent_content_sync_setup.md`.

**Still outstanding:** not exercised end-to-end; Apps Script project not created; `PARENT_CONTENT_WEBHOOK_SECRET` not in Vercel Production.

---

## Payload CMS

**Collections (9):** `Users`, `Media`, `Testimonials`, `PainPoints`, `AwarenessModules`, `ResearchBibles`, `DeepDives`, `Courses`, `Lessons`

**Globals (4):** `FAQ`, `Footer`, `SiteSettings`, `About`

Schema source: `src/payload/collections/` and `src/payload/globals/`. Config: `payload.config.ts` (repo root).

**`siteSettings` global** (`substackSubdomain`, `calComUrl`) — nothing reads from it yet. `lib/links.ts` and Cal.com URLs are still hardcoded.

**Required manual steps before Payload works:**
1. Set `PAYLOAD_SECRET` + `DATABASE_URI` in Vercel Production
2. Payload migrations run on first start (or `payload migrate:run`)
3. Visit `/admin/create-first-user`
4. Run `npx tsx scripts/migrate-to-payload.ts` to populate from YAML/MDX sources

---

## Community and Courses Platform (v18 Parts J–P — not yet built)

DB schema for community tables (`posts`, `comments`, `likes`, `points_ledger`, `course_progress`, `entitlements`, `stripe_customers`, `stripe_subscriptions`) is partially done — Stripe tables exist in `drizzle/0004_stripe_customers_subscriptions.sql`. Community tables (`posts`, `comments`, `likes`, `points_ledger`) not yet added. Routes, API routes, and auth pages not yet built. See `claude-code-handoff-v18.md` Parts J–P for the full spec.

---

## Database

**Neon Postgres:** provisioned. `neon_auth` schema (Neon Auth). `public` schema (Drizzle + Payload coexist, no name conflicts).

**Drizzle tables (all exist):**
- `profiles` (`user_id`, `account_type`, age, gender) — needs community columns from v18 Part J
- `topic_progress` — exists, empty
- `interest_signups` (`email`, `source`, `created_at`) — live, backs `/api/interest-signups`. Mirrors to Google Sheet on new signup (`INTEREST_SIGNUPS_SHEET_ID`)
- `pending_reviews` — audit log only

**Stripe tables (migration exists, not yet confirmed run):** `stripe_customers`, `stripe_subscriptions`

---

## Social & Integrations

| Platform | Status |
|---|---|
| LinkedIn | Live outbound link |
| Instagram `bobby__washburn` | Disabled (`coming-soon-trigger.tsx`). Re-enable once content exists |
| Cal.com `bobby-washburn/intro-call` | Live outbound link site-wide. One popup embed on Teen page only |
| Substack `roughlyeducated` | On-page modal (`newsletter-dialog.tsx`). Subdomain needs Bobby's confirmation |

---

## PII Policy (locked)

**Parent profile:** Name, email, age, gender only.
**Children:** Age and gender only — NO names, ever. No child-name column anywhere.
**Partner:** Age and gender only — NO name.

---

## Content Protection / SEO

- `app/robots.ts`: disallows `/docs/` and `/common-pain-points/` for all non-Googlebot agents. `/research/` not disallowed — per-entry `noindex` controls visibility.
- `app/sitemap.ts`: static routes + `/docs/[slug]` + `/common-pain-points/[slug]` + `/research/[slug]` (non-`noindex` only)
- Rate limiting on content routes via Vercel middleware

---

## Analytics

- **Vercel Analytics** (`@vercel/analytics/next`, `<Analytics />`) — in `app/layout.tsx`
- **Google Analytics 4** (`G-5ZLMM0G7CV`) — `gtag.js` via two `next/script` tags (`strategy="afterInteractive"`) in `app/layout.tsx`

---

## Build Rules

```
npm run build
npm run lint
npx tsc --noEmit
```

**JSON edits:**
```
cat file.json | python3 -c "import json, sys; data = json.load(sys.stdin); [modifications]; print(json.dumps(data, indent=2))" > output.json
```

---

## Workflow

- **Claude.ai project:** Planning, architecture, decisions, content development
- **Claude Code (VS Code):** File generation and build tasks
- **CLAUDE.md:** Single source of truth. Always reconcile the whole file — never append sections that could contradict existing content.

---

## What Is NOT Being Built for Launch

- Subscription / paywall — Stripe scaffolded, not wired
- Auth gates on content
- Onboarding intake flow
- Community feed (v18 Part M)
- Full courses platform (v18 Parts N–O)
- Organizations page rebuild (v18 Part P)
- Old Google Drive sync via `/api/refresh` — superseded
- Word doc / video script cascade

---

## Skills in This Project

- `research-bible-builder` — builds research bibles from source documents
- `research-bible-refinement` — updates bibles from new research; drives the ingestion pipeline; intentionally unaware of git/GitHub/website infra
- `parent-content-builder` — transforms research bibles into parent-facing Pain Point/Module files for the Parent Content Sync Pipeline
- `content-development-from-trends` — content packages from trend reports
- `video-script-format` — video scripts
- `substack-voice-structure` — Substack articles

---

## Open Items

- **Payload manual steps** — see Required Manual Steps in Payload CMS section above
- **`paths-loop.mp4` Chrome decode failure** — video renders as black box; Bobby needs to re-export faststart-encoded
- **`/welcome` page broken** — page fails to load; see v18 Part R for diagnosis and fix
- **Community/courses platform** — Parts J–P of v18 not started; see `claude-code-handoff-v18.md`
- **Stripe DB migration** — `0004_stripe_customers_subscriptions.sql` exists but may not have run against Neon yet
- **Research Bible Pipeline end-to-end** — webhook not tested live; Apps Script trigger not installed
- **Parent Content Sync Pipeline** — not tested end-to-end; Apps Script project not created; `PARENT_CONTENT_WEBHOOK_SECRET` not in Vercel
- **Substack subdomain** (`roughlyeducated`) — needs Bobby's confirmation before embed ships
- **Start Here Row 2 photos** — temp Unsplash stock; swap `ROW_TWO_PANELS` URL constants when real photos arrive
- **`siteSettings` global** — not yet wired to `lib/links.ts` or Cal.com URLs
- **Organizations page** — CTA is `mailto:` placeholder; full rebuild per v18 Part P not started
- **Pending copy from Bobby:** About-Bobby, `/services/organizations`, FAQ

---

## File Map

| Area | Location |
|---|---|
| Routes | `app/` (App Router) |
| Reusable UI | `components/ui/` (shadcn) |
| Marketing sections | `components/marketing/` |
| Tools UI | `components/marketing/tools/tech-safety-tool/` |
| MDX components | `components/mdx/`, ADHD in `components/mdx/adhd/` |
| Dashboard UI | `components/dashboard/` |
| Pain point components | `components/pain-points/teen-route/` (Teen mosaic, unwired) |
| Payload schema | `payload.config.ts` (root), collections/globals in `src/payload/` |
| Payload readers | `lib/payload-client.ts`, `lib/payload-globals.ts`, `lib/payload-courses.ts`, `lib/pain-points-reader.ts`, `lib/research-bibles-reader.ts` |
| DB schema | `lib/db/schema.ts`, `drizzle/` migrations |
| Stripe config | `lib/stripe.ts`, `lib/stripe-client.ts`, `lib/stripe-products.ts` |
| Shared logic | `lib/auth/`, `lib/db/`, `lib/github/`, `lib/google/`, `lib/research-bibles/`, `lib/parent-content/`, `lib/tools/` |
| YAML content (migration sources, reference only) | `content/` |
| Middleware | `proxy.ts` |
| Retired files | `graveyard/` |
