# CLAUDE.md - ResearchBibleWebsite

**Repo:** BobbyW08/ResearchBibleWebsite · `main` branch
**Local path:** `C:\dev\ResearchBibleWebsite`
**Shell:** PowerShell
**Hosting:** Vercel (watches `main`)

This file states current facts only - what the site is, what's live, what's in progress, what's not built. No changelog, no history, no "as of" dates, no superseded plans. If something here doesn't match the code, the code wins - flag the mismatch and fix this file in the same session.

---

## Working Rules for Claude Code

- **Trust this file's facts without re-verifying via `grep`/`find`/`Read` first.** Use the File Map below to go straight to the right file instead of exploring the tree.
- **`AGENTS.md`** only requires reading `node_modules/next/dist/docs/` for genuinely unfamiliar Next.js 16 APIs - not for every edit. Content/styling/component changes don't need it.
- **If you find code that contradicts this file** - stop, confirm the real state, and correct this file before moving on.
- **JSON edits:** use the Python scripting pattern under Build Rules, never manual editing.
- **Before every commit:** `npm run build`, `npm run lint`, and `npx tsc --noEmit` must all exit zero.
- **Iterate in a branch** without committing until ready. Never commit a broken build.
- Give commands one at a time; keep file content and terminal commands clearly separated.

---

## What This Project Is

**bobby-washburn.com** - a parenting education / peer-support site for Bobby Washburn's private practice.
- Positions Bobby as a Certified Peer Recovery Specialist (CPRS) - peer support, not clinical treatment
- Connects visitors to booking (Cal.com `/intro-call`), newsletter modal (Substack embed), social (LinkedIn; Instagram disabled)
- Free, ungated parent-facing content: Pain Point pages (triage) and Deep Dive pages (research-backed)
- No paywall, no auth gates on content at launch. Community and courses platform routes are built; the header shows Courses and Community as "Coming soon".

Content philosophy: research bibles are internal practitioner documents. Parent-facing content derives from them - warm peer-to-peer tone, 8th-grade reading level, no visible citations.

---

## Auth Architecture

Two auth systems coexist. They are completely independent.

**Payload admin auth** - Built into Payload. Bobby's `/admin` account created at `/admin/create-first-user`. Exists only in Payload's `users` table. No relationship to site visitor accounts.

**Neon Auth (visitor auth)** - `@neondatabase/auth` and `@neondatabase/auth-ui`. Env vars `NEON_AUTH_BASE_URL` and `NEON_AUTH_COOKIE_SECRET` already in Vercel. Handles sign-in, sign-up, and Google OAuth for parents and professionals. Auth tables live in the `neon_auth` schema of the existing Neon Postgres instance. Never check Payload auth on visitor routes or Neon Auth on admin routes.

---

## Brand System (locked)

| Role | Value |
|---|---|
| Title (hero-level) | Archivo - placeholder for "Philly Sans" (licensing pending). One-line swap: `titlePlaceholder` component + `--font-title-placeholder` in `app/layout.tsx` |
| Subtitle | **Arvo** - final. `arvo` / `--font-arvo` in `app/layout.tsx`, aliased to `--font-subtitle` / `font-subtitle` in `app/globals.css` |
| Heading / Body | Libre Franklin - final. `libreFranklin` → `--font-heading` / `--font-sans` |
| Quotes | Caveat - final. `font-quote` utility |
| Red (primary) | `#9F0000` (`--primary` / `bg-primary` / `text-primary`) |
| Near-black | `#111111` (`--foreground`, `--secondary`, `--brand-black`) |
| Off-white | `#F8F8F8` (`--background`, `--brand-offwhite`) |
| Gradient | 180°, `#111111` → `#9F0000` - `.bg-brand-gradient`. Secondary asset only |
| Charcoal (inverted sections) | `#262626` (`--brand-charcoal`) - Services "My Approach" section |
| Bright red (headers on dark) | `#F0342F` (`--brand-red-bright`) - headings on charcoal surfaces only |

All tokens are CSS custom properties in `app/globals.css`. One deliberate light identity - no dark mode.

---

## Tech Stack (locked - no new dependencies without approval)

- **Framework:** Next.js 16 (App Router)
- **UI components:** shadcn/ui + ShadcnSpace (free tier)
- **Animation:** Motion
- **Booking:** Cal.com - direct outbound links to `intro-call` (not embedded), except one Cal popup on the Teen page's pinned CTA
- **Newsletter:** Substack embed in `components/marketing/newsletter-dialog.tsx`. Subdomain in `lib/links.ts`
- **CMS:** Payload CMS 3.90.2 - active. Admin at `/admin`. 9 collections, 4 globals. Schema in `payload.config.ts` (repo root). Collections and globals source in `src/payload/`. DB tables exist and all content has been migrated. Admin styling comes from `@payloadcms/next/css`, imported in `app/(payload)/admin/[[...segments]]/layout.tsx`.
- **Payments:** Stripe - `lib/stripe.ts`, `lib/stripe-products.ts`, routes `app/api/stripe/checkout` and `app/api/stripe/webhook`. Not exercised end-to-end; nothing is sold at launch.
- **Database:** Neon Postgres - provisioned. `neon_auth` schema exists. Payload uses `DATABASE_URI`; Drizzle uses `DATABASE_URL` (same connection string, different var names, both in `.env.local`).
- **Hosting:** Vercel
- **Server-side integrations:** hand-rolled REST clients only (Google Drive and Sheets in `lib/google/`).

Do NOT use: Framer, Aceternity UI, Magic UI Pro, Supabase, self-hosted better-auth, any SaaS boilerplate.

---

## Site Map

### Public Routes

| Route | Purpose | Status |
|---|---|---|
| `/` | Homepage | Live |
| `/about-bobby` | About Bobby | Live. `/about` 301s here |
| `/services` | Services for Parents | Live, static content |
| `/services/organizations` | Services for Organizations | Live. Inquiry form posts to `/api/org-inquiry` |
| `/common-pain-points` | Pain Point index (10 cards + 2 modules) | Live. `/help` 301s here |
| `/common-pain-points/teen` | Teen pain point - uses `PainPointSidebarLayout` for launch | Live (temporary layout) |
| `/common-pain-points/[slug]` | Other 9 pain points + 2 awareness modules | Live. `/help/[slug]` 301s here |
| `/docs` | 36-topic categorized gallery | Live |
| `/docs/adhd` | ADHD Deep Dive - dedicated route with 8 interactive components | Live |
| `/docs/[topic]` | 35 remaining deep dives | Live as prose |
| `/dashboard` | Redirects to `/dashboard/adhd` | Live |
| `/dashboard/adhd` | ADHD quick-reference dashboard | Live |
| `/dashboard/[topic]` | Other topic dashboards | Not built - needs JSON data |
| `/tools` | Tools index (unlisted) | Live |
| `/tech-safety` | Tech Safety wizard | Live, unlisted. `/tools/tech-safety-tool` 301s here |
| `/research` | Research Bible Library index | Live, unlisted. Entries appear once a synced draft is published in `/admin` |
| `/research/[slug]` | Individual research bible | Live, unlisted |
| `/legal` | Legal & Disclaimers | Live, static |
| `/courses` | Course listing | Coming-soon state only |
| `/privacy` | Privacy policy | Live |

### Auth / Account Routes (not needed for launch)

| Route | Status |
|---|---|
| `/sign-in` | Built, untested end-to-end |
| `/welcome` | Built (role selector), untested end-to-end |
| `/community`, `/community/post/[id]` | Built, gated by `middleware.ts`, not linked live |
| `/courses/[slug]`, `/courses/[slug]/[lesson-slug]` | Built, gated by `middleware.ts`, not linked live |
| `/account` | Built, gated by `middleware.ts` |

### CMS / Admin / Internal

| Route | Status |
|---|---|
| `/admin` | Live. Payload admin (own login, separate from visitor auth) |
| `/internal/pages` | Live, `noindex` |

### Dormant Routes

| Route | Status |
|---|---|
| `/auth/[path]` | Reachable, unproven end-to-end |
| `/onboarding` | Not needed for launch |
| `/api/refresh` | Not wired. Doc→MDX half superseded by Drive webhook. Do not build further |
| `/api/research-bible/notify-change` | Superseded. Do not build further |
| `/api/account/pending-reviews` | Audit log only - candidate for removal |

**301 redirects** (`next.config.ts`): `/about` → `/about-bobby`, `/tools/tech-safety-tool` → `/tech-safety`, `/help` → `/common-pain-points`, `/help/:slug` → `/common-pain-points/:slug`, `/tech-consequences` → `/tech-safety`.

---

## Homepage Structure

Section order in `app/page.tsx`:

1. **Header** (`components/marketing/header.tsx`) - nav: About, Start Here (`/#start-here`), Parents (`/services`), Organizations, Courses and Community (both non-links with a "Coming soon" hover tooltip), FAQs (`/#faq`). On the homepage only, header is transparent over the hero and renders light-on-dark.
2. **Hero - "Proof Wall"** (`hero.tsx` + `proof-wall-hero.tsx`) - flat `bg-brand-black` field. Five tilted testimonial cards (cursor-parallax) around a two-tone headline. Cards sourced from Payload `testimonials` collection with hardcoded fallback. Mobile uses `MobileTestimonialCarousel` (horizontal scroll-snap, auto-advance). CTA links to Cal.com intro-call.
3. **Start Here** (`start-here.tsx`) - Row 1: Tech Safety tool tile (video) + Common Pain Points scrollable list. Row 2: three equal panels - Parents → `/services#one-on-one`, Groups → `/services#weekly-group`, Organizations → `/services/organizations`. Row 2 uses temp Unsplash stock photos.
4. **Quick Credential** (`quick-credential.tsx`) - Bobby's photo + 5 credential lines + "Learn more" → `/about-bobby`.
5. **FAQ** - 6 Q&As from Payload `faq` global with hardcoded fallback.
6. **Footer** - left: sitemap (About, Start Here, Parents, Organizations, FAQs), right: Connect (Cal.com, newsletter, email, LinkedIn). Set in Arvo (`font-subtitle`).

---

## Services Pages

**`/services` (For Parents):**
- Hero: pinned scroll section (`components/marketing/services/wedged-hero-headline.tsx`) - "We Build"/"Your Path" converge over a looping video, then "Together" reveals. **Known issue:** `public/videos/paths-loop.mp4` fails to decode in Chrome (non-faststart encoding) - renders as black box until Bobby re-exports the video.
- "My Approach" section: `ModalityCards` (`components/marketing/services/modality-cards.tsx`) - 4 flip-cards at `sm`+, accordion on mobile. Inverted palette (`bg-brand-charcoal`).
- "What I Offer": 4 `OfferCard`s. 1:1 Sessions → Cal.com. Weekly Group/Live Q&As/Cohorts → `InterestSignupWidget` POSTs to `/api/interest-signups`.
- `OfferCard`s for 1:1 Sessions and Weekly Group have anchor IDs (`#one-on-one`, `#weekly-group`) for Start Here deep links.

**`/services/organizations`:** Static content plus `OrgInquiryForm` (`components/marketing/organizations/org-inquiry-form.tsx`), which POSTs to `/api/org-inquiry`. That route validates the fields and appends a row to the `OrgInquiries` tab of the Google Sheet in `INTEREST_SIGNUPS_SHEET_ID`.

---

## Pain Point Pages

Custom layout - not Fumadocs. All 10 slugs + 2 modules render via `PainPointSidebarLayout` (`components/marketing/pain-point-sidebar-layout.tsx`). Data from Payload `pain-points` and `awareness-modules` collections via `lib/pain-points-reader.ts` (try/catch fallback to `[]`).

| Slug | Topic | Deep-dive link |
|---|---|---|
| `meltdowns` | My kid melts down over everything | `de-escalation-crisis-planning` |
| `screens` | What do I do about screens? | `screen-gaming-compulsive-use` |
| `wontlisten` | My kid won't listen | `understanding-child-behavior` |
| `anxiety` | My kid is anxious and won't go to school | `anxiety-depression-children` |
| `bedtime` | Bedtime battles | `healthy-bodies-calm-homes` |
| `homework` | The homework war | `school-assistance-parent-guide` |
| `aggression` | My kid hits, bites, or throws things | `supporting-aggressive-children` |
| `routines` | Morning chaos - routines | `structure-routines-parenting` |
| `teen` | My teenager hates me | `teen-autonomy-identity-support` |
| `burnout` | I'm burnt out | `parental-self-care` |
| `modern` (module) | Why modern parenting is so hard | - |
| `mentalhealth` (module) | Children's mental health in the U.S. | - |

**Icon name strings** are resolved via `lib/pain-point-icons.ts` - keep in sync with the Payload `PainPoints` collection's `APPROVED_ICONS` list.

---

## Teen Page (`TeenRebellionRoute` - not currently wired)

`app/common-pain-points/teen/page.tsx` temporarily renders `PainPointSidebarLayout` for launch. The newspaper-mosaic-grid rebuild (`TeenRebellionRoute`) exists in `components/pain-points/teen-route/` and still builds - swap `teen/page.tsx`'s JSX back to `<TeenRebellionRoute />` when ready. Content in `lib/pain-points/teen-rebellion-panels.ts`. The pinned CTA panel (`pinned-cta-panel.tsx`) uses Cal.com popup - the only place on the site using Cal's popup pattern.

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

**Flow:** `research-bible-refinement` skill updates a Drive-synced bible → the Apps Script time trigger (every 15 minutes, posts to the `www` URL) calls the webhook → `app/api/webhooks/drive-content-sync/route.ts` parses the file and writes to Payload as `_status: 'draft'` → Bobby reviews and publishes at `/admin` → live at `/research/[slug]`.

`pending_reviews` is an audit log only.

**Built:** `lib/research-bibles/parse.ts`, `lib/research-bibles/frontmatter.ts`, `lib/research-bibles-reader.ts`, `lib/google/drive.ts`, webhook route, `drive_content_sync_setup.md` (Apps Script reference).

**Still outstanding:**
- Apps Script trigger is installed; first live sync result still needs confirming (HTTP 200 in Apps Script Executions, draft visible in `/admin`)
- Only files named `RB_*.md` are handled. The Drive folder also holds same-named Google Doc copies of some bibles, which are ignored

**Bible metadata rules:** `version` and `tags` are site-owned, never sourced from Drive. `version` auto-increments on each sync. `tags` Bobby sets manually via `/admin`.

---

## Parent Content Sync Pipeline

Manual-only Drive to Payload pipeline for Pain Point and Awareness Module content. Same pattern as the bible pipeline but separate code, endpoint, secret and Apps Script project. Never add an automatic trigger.

**Flow:** `parent-content-builder` skill writes `PainPoint_[Name].md` / `Module_[Name].md` to the `Parent Facing Content` Drive folder (`content/sync-config.json`) → Bobby manually runs `syncParentFacingContent()` from its own Apps Script project → `app/api/webhooks/parent-content-sync/route.ts` validates, dedups, and saves a draft in the Payload `pain-points` or `awareness-modules` collection → Bobby publishes at `/admin`. The site-owned `featured` flag is never touched by a sync.

**Built:** `lib/parent-content/parse.ts` (source parser and validation, tested with `node --experimental-strip-types --test lib/parent-content/parse.test.ts`), `lib/parent-content/frontmatter.ts` (YAML reader used by the parser), webhook route, `parent_content_sync_setup.md` (Apps Script reference, use the `www` URL).

**Auth:** `X-Webhook-Secret` header against `PARENT_CONTENT_WEBHOOK_SECRET` (separate from the bible route's `WEBHOOK_SECRET`).

**Still outstanding:** not exercised end-to-end; Apps Script project not created; `PARENT_CONTENT_WEBHOOK_SECRET` not set in Vercel Production.

---

## Payload CMS

**Collections (9):** `Users`, `Media`, `Testimonials`, `PainPoints`, `AwarenessModules`, `ResearchBibles`, `DeepDives`, `Courses`, `Lessons`

**Globals (4):** `FAQ`, `Footer`, `SiteSettings`, `About`

Schema source: `src/payload/collections/` and `src/payload/globals/`. Config: `payload.config.ts` (repo root).

**`siteSettings` global** (`substackSubdomain`, `calComUrl`) - nothing reads from it yet. `lib/links.ts` and Cal.com URLs are still hardcoded.

**Content:** 5 testimonials, 6 FAQ items, 10 pain points, 2 awareness modules, 36 deep dives, footer, site settings and about global are in Payload. `PAYLOAD_SECRET` and `DATABASE_URI` are set in Vercel Production.

---

## Community and Courses Platform (v18 Parts J–P - routes built, not yet live)

DB schema complete in `lib/db/schema.ts`: `profiles` (with community fields), `posts`, `comments`, `likes`, `pointsLedger`, `courseProgress`, `entitlements`, `stripeCustomers`, `stripeSubscriptions`, `stripeOrders`, `postTags`. Drizzle migrations may need to run against Neon to create these tables.

Routes built but gated and not yet live: `/sign-in`, `/community`, `/courses/[slug]`, `/courses/[slug]/[lesson-slug]`, `/account`, `/welcome`. Auth middleware in `middleware.ts` (protects `/community`, `/courses`, `/account`). Stripe checkout and webhook routes exist but are untested. See `claude-code-handoff-v18.md` Parts J–P for remaining work.

---

## Database

**Neon Postgres:** provisioned. `neon_auth` schema (Neon Auth). `public` schema (Drizzle + Payload coexist, no name conflicts).

**Drizzle tables (all exist in `public` schema):**
- `profiles`, `topic_progress`, `interest_signups`, `pending_reviews` - original tables
- `posts`, `comments`, `likes`, `points_ledger`, `post_tags` - community tables
- `course_progress`, `entitlements` - courses gating tables
- `stripe_customers`, `stripe_subscriptions`, `stripe_orders` - Stripe tables
- `courses`, `lessons` - course catalog tables (Drizzle-managed, separate from Payload's `payload_courses`)

**Payload tables (all exist in `payload_cms` schema):** Payload auto-synced its schema on first run and uses a separate DB schema (`payload_cms`).

**Drizzle migration tracking:** `drizzle."__drizzle_migrations"` has the 5 existing migrations stamped, so `drizzle-kit migrate` works.

---

## Social & Integrations

| Platform | Status |
|---|---|
| LinkedIn | Live outbound link |
| Instagram `bobby__washburn` | Disabled (`coming-soon-trigger.tsx`). Re-enable once content exists |
| Cal.com `bobby-washburn/intro-call` | Live outbound link site-wide. One popup embed on Teen page only |
| Substack `bwparentsupport` | On-page modal (`newsletter-dialog.tsx`). Subdomain in `lib/links.ts` |

---

## PII Policy (locked)

**Parent profile:** Name, email, age, gender only.
**Children:** Age and gender only - NO names, ever. No child-name column anywhere.
**Partner:** Age and gender only - NO name.

---

## Content Protection / SEO

- `app/robots.ts`: disallows `/docs/` and `/common-pain-points/` for all non-Googlebot agents. `/research/` not disallowed - per-entry `noindex` controls visibility.
- `app/sitemap.ts`: static routes + `/docs/[slug]` + `/common-pain-points/[slug]` + `/research/[slug]` (non-`noindex` only)
- Rate limiting on content routes via Vercel middleware

---

## Analytics

- **Vercel Analytics** (`@vercel/analytics/next`, `<Analytics />`) - in `app/layout.tsx`
- **Google Analytics 4** (`G-5ZLMM0G7CV`) - `gtag.js` via two `next/script` tags (`strategy="afterInteractive"`) in `app/layout.tsx`

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
- **CLAUDE.md:** Single source of truth. Always reconcile the whole file - never append sections that could contradict existing content.

---

## What Is NOT Being Built for Launch

- Subscription / paywall (Stripe routes exist, untested)
- Auth gates on content
- Onboarding intake flow
- Community feed and full courses platform (routes exist, not launched)
- Old Google Drive sync via `/api/refresh`: superseded
- Word doc / video script cascade

---

## Skills in This Project

- `research-bible-builder` - builds research bibles from source documents
- `research-bible-refinement` - updates bibles from new research; drives the ingestion pipeline; intentionally unaware of git/GitHub/website infra
- `parent-content-builder` - transforms research bibles into parent-facing Pain Point/Module files for the Parent Content Sync Pipeline
- `content-development-from-trends` - content packages from trend reports
- `video-script-format` - video scripts
- `substack-voice-structure` - Substack articles

---

## Open Items

- **Vercel env vars** - `PAYLOAD_SECRET` and `DATABASE_URI` are set in Vercel Production. `sslmode=verify-full` already in both `DATABASE_URL` and `DATABASE_URI`.
- **`paths-loop.mp4` Chrome decode failure** - video renders as black box; Bobby needs to re-export faststart-encoded
- **Community/courses platform** - DB tables exist; routes built but untested end-to-end; Neon Auth (`NEON_AUTH_BASE_URL`) must be configured before auth flow works; Stripe routes untested
- **Research Bible Pipeline** - Apps Script trigger installed; first live sync result unconfirmed
- **Parent Content Sync Pipeline** - not tested end-to-end; Apps Script project not created; `PARENT_CONTENT_WEBHOOK_SECRET` not in Vercel
- **`drive_content_sync_setup.md`** - still describes the old GitHub PR flow and contains a webhook secret; rewrite it and rotate `WEBHOOK_SECRET` (Vercel and Apps Script)
- **Payload admin branding** - default theme; brand red `#9F0000` and logo not applied
- **Start Here Row 2 photos** - temp Unsplash stock; swap `ROW_TWO_PANELS` URL constants when real photos arrive
- **`siteSettings` global** - not yet wired to `lib/links.ts` or Cal.com URLs
- **Organizations inquiry form** - `/api/org-inquiry` writes to a Google Sheet only if `INTEREST_SIGNUPS_SHEET_ID` is set; confirm it is set in Vercel Production
- **Pending copy from Bobby:** About-Bobby page content, FAQ answers

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
| Stripe config | `lib/stripe.ts`, `lib/stripe-products.ts` |
| Shared logic | `lib/auth/`, `lib/db/`, `lib/google/`, `lib/research-bibles/`, `lib/parent-content/`, `lib/tools/` |
| Reference content (docs MDX, dashboard data, sync config) | `content/docs/`, `content/data/`, `content/sync-config.json` |
| Middleware | `middleware.ts` |
| Retired files | `graveyard/` |
