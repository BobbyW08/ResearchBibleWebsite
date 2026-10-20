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
- **JSON edits:** use the node scripting pattern under Build Rules, never manual editing.
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

**Payload admin auth** - Built into Payload. Bobby's `/admin` account created at `/admin/create-first-user`. Exists only in Payload's `users` table, with a `role` of `admin` or `moderator`. No relationship to site visitor accounts.

**Neon Auth (visitor auth)** - `@neondatabase/auth` and `@neondatabase/auth-ui`. Env vars `NEON_AUTH_BASE_URL`, `NEXT_PUBLIC_NEON_AUTH_BASE_URL` and `NEON_AUTH_COOKIE_SECRET` are in Vercel. Handles sign-in, sign-up, and Google OAuth for parents and professionals. Auth tables live in the `neon_auth` schema of the Neon Postgres instance. Never check Payload auth on visitor routes or Neon Auth on admin routes.

Details: `docs/operations/auth.md`, `docs/operations/auth-audit.md`, `docs/operations/roles-and-permissions.md`.

---

## Brand System (locked)

| Role | Value |
|---|---|
| Title (hero-level) | Archivo - placeholder for "Philly Sans" (licensing pending). One-line swap: `titlePlaceholder` + `--font-title-placeholder` in `app/(app)/layout.tsx` |
| Subtitle | **Arvo** - final. `arvo` / `--font-arvo` in `app/(app)/layout.tsx`, aliased to `--font-subtitle` / `font-subtitle` in `app/globals.css` |
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

- **Framework:** Next.js 16 (App Router). `package.json` sets `"type": "module"`.
- **UI components:** shadcn/ui + ShadcnSpace (free tier)
- **Animation:** Motion
- **Booking:** Cal.com - direct outbound links to `intro-call` (not embedded). The only Cal popup is in the unwired Teen mosaic.
- **Newsletter:** Substack embed in `components/marketing/newsletter-dialog.tsx`. Subdomain in `lib/links.ts`
- **CMS:** Payload CMS 3.90.2. Admin at `/admin`. 17 collections, 4 globals. Config in `payload.config.ts` (repo root). Collections and globals source in `src/payload/`. Admin styling comes from `@payloadcms/next/css` plus brand overrides in `src/payload/admin/custom.css` (brand red) and `src/payload/admin/Logo.tsx`, both wired in `app/(payload)/admin/[[...segments]]/layout.tsx` and `payload.config.ts`.
- **Payments:** none at launch. Stripe code lives in `graveyard/stripe/`, with revival instructions in `graveyard/stripe/README.md`.
- **Email:** Resend (`resend` package) for community report notifications. **Not configured:** requires `RESEND_API_KEY`, a verified sender domain, and `NOTIFY_EMAIL` in Vercel (BLOCKED-ON-BOBBY).
- **Database:** Neon Postgres. `neon_auth` schema (Neon Auth), `payload_cms` schema (Payload), `public` schema (orphaned legacy tables; no code reads them).
- **Hosting:** Vercel. Build Command `npm run ci`, Node.js 20.x.
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
| `/services/organizations/documents` | Partner documents list | Live, unlinked. Only the Privacy Policy entry is available |
| `/common-pain-points` | Pain Point index (10 cards + 2 modules) | Live. `/help` 301s here |
| `/common-pain-points/teen` | Teen pain point - uses `PainPointSidebarLayout` | Live |
| `/common-pain-points/[slug]` | Other 9 pain points + 2 awareness modules | Live. `/help/[slug]` 301s here |
| `/docs` | 36-topic categorized gallery | Live |
| `/docs/adhd` | ADHD Deep Dive - dedicated route with 8 interactive components | Live |
| `/docs/[slug]` | 35 remaining deep dives | Live as prose |
| `/dashboard` | Lists topic dashboards; redirects straight to the topic when only one exists | Live, redirects to `/dashboard/adhd` |
| `/dashboard/[slug]` | Quick-reference dashboard for any topic with a JSON file in `content/data/` | Live for `adhd` only (the only data file) |
| `/tools` | Tools index (unlisted) | Live |
| `/tech-safety` | Tech Safety wizard | Live, unlisted. `/tools/tech-safety-tool` and `/tech-consequences` 301 here |
| `/research` | Research Bible Library index | Live, unlisted. Entries appear once a synced draft is published in `/admin` |
| `/research/[slug]` | Individual research bible | Live, unlisted |
| `/legal` | Legal & Disclaimers | Live, static |
| `/privacy` | Privacy policy | Live |
| `/community-guidelines` | Community guidelines | Built, public, not linked. BLOCKED-ON-BOBBY: text review |

### Auth / Account Routes (not needed for launch)

| Route | Status |
|---|---|
| `/sign-in` | Built, untested end-to-end |
| `/welcome` | Built (role selector), requires a session, untested end-to-end |
| `/community`, `/community/post/[id]` | Built, gated (middleware + page session and profile check), not linked live |
| `/courses`, `/courses/[slug]`, `/courses/[slug]/[lesson-slug]` | Built, gated (middleware + page session and profile check), not linked live |
| `/account` | Built, gated (middleware + page session and profile check) |
| `/account/[path]` | Neon Auth `AccountView` pages, gated by middleware only |
| `/auth/[path]` | Neon Auth UI pages, reachable, unproven end-to-end |

### CMS / Admin / Internal

| Route | Status |
|---|---|
| `/admin` | Live. Payload admin (own login, separate from visitor auth) |
| `/internal/pages` | Live, `noindex` |

### API Routes (`app/api/`)

| Route | Purpose |
|---|---|
| `/api/auth/[...path]` | Neon Auth proxy |
| `/api/auth/set-role` | Creates the visitor profile (requires a verified email) |
| `/api/account/profile` | Profile edits |
| `/api/community/posts`, `/api/community/comments` | Community reads and writes (rate limited, suspension checked) |
| `/api/community/posts/edit`, `/api/community/comments/edit` | Author edits and deletes within 15 minutes |
| `/api/community/report` | Report a post or comment |
| `/api/courses/complete` | Mark a lesson complete |
| `/api/interest-signups`, `/api/org-inquiry` | Public forms, rows appended to the Google Sheet in `INTEREST_SIGNUPS_SHEET_ID` |
| `/api/search` | Public content search |
| `/api/webhooks/drive-content-sync`, `/api/webhooks/parent-content-sync` | Drive sync webhooks |

Payload's REST API lives at `app/(payload)/api/[...slug]`.

**301 redirects** (`next.config.ts`): `/about` → `/about-bobby`, `/tools/tech-safety-tool` → `/tech-safety`, `/help` → `/common-pain-points`, `/help/:slug` → `/common-pain-points/:slug`, `/tech-consequences` → `/tech-safety`.

---

## Homepage Structure

Section order in `app/(app)/page.tsx` (content wrapped in `<main>`):

1. **Header** (`components/marketing/header.tsx`) - nav: About, Start Here (`/#start-here`), Parents (`/services`), Organizations, Courses and Community (both non-links with a "Coming soon" hover tooltip), FAQs (`/#faq`). On the homepage only, header is transparent over the hero and renders light-on-dark.
2. **Hero - "Proof Wall"** (`hero.tsx` + `proof-wall-hero.tsx`) - flat `bg-brand-black` field. Five tilted testimonial cards (cursor-parallax) around a two-tone headline. Cards sourced from Payload `testimonials` collection with hardcoded fallback. Mobile uses `MobileTestimonialCarousel` (horizontal scroll-snap, auto-advance). CTA links to Cal.com intro-call.
3. **Start Here** (`start-here.tsx`) - Row 1: Tech Safety tool tile (video) + Common Pain Points scrollable list. Row 2: three equal panels - Parents → `/services#one-on-one`, Groups → `/services#weekly-group`, Organizations → `/services/organizations`. Row 2 uses temp Unsplash stock photos.
4. **Quick Credential** (`quick-credential.tsx`) - Bobby's photo + 5 credential lines + "Learn more" → `/about-bobby`.
5. **FAQ** - 6 Q&As from Payload `faq` global with hardcoded fallback.
6. **Footer** - left: sitemap (About, Start Here, Parents, Organizations, FAQs), right: Connect (Cal.com, newsletter, email, LinkedIn). Set in Arvo (`font-subtitle`).

---

## Services Pages

**`/services` (For Parents):**
- Hero: pinned scroll section (`components/marketing/services/wedged-hero-headline.tsx`) - "We Build"/"Your Path" converge over a looping video, then "Together" reveals. **Known issue:** `public/videos/paths-loop.mp4` fails to decode in Chrome (non-faststart encoding) and renders as a black box until Bobby re-exports the video.
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

## Teen Page (`TeenRebellionRoute` - not wired)

`app/(app)/common-pain-points/teen/page.tsx` renders `PainPointSidebarLayout`. The newspaper-mosaic-grid build (`TeenRebellionRoute`) is in `components/pain-points/teen-route/` and builds - swap the page's JSX to `<TeenRebellionRoute />` to use it. Content in `lib/pain-points/teen-rebellion-panels.ts`. Its pinned CTA panel (`pinned-cta-panel.tsx`, with `cal-booking-trigger.tsx`) uses the Cal.com popup, the only Cal popup in the codebase.

---

## Deep Dive Topics (`/docs/[slug]`)

36 topics in 4 pillars, rendered via Payload `deep-dives` collection. `app/(app)/docs/[slug]/page.tsx` renders Lexical `body` via `@payloadcms/richtext-lexical/react`'s `<RichText>`. `app/(app)/docs/adhd/page.tsx` intercepts `[COMPONENT: X]` markers and injects the real components from `components/mdx/adhd/index.ts`.

**🔴 Stabilize (9):** What Do You Want · De-Escalation · Parent Emotional Regulation · Structure & Routine · Understanding Behavior · **Understanding ADHD** · Understanding Autism Spectrum Disorder · Understanding Anxiety & Depression · Trauma Informed Parenting

**🟡 Connect (8):** Parental Self Care · Connection Principles · Values · Parenting Styles · Communication · Family Dynamics · Motivation · Mindsets

**🟢 Structure (6):** Applying Parenting Strategies · Child Development · Teen Autonomy and Identity · Principles of Effective Discipline · Behavior-Reward-Consequence System · Co-Parenting

**🔵 Adapt (13):** Public Places Without Panic · Supporting Aggressive Children · Household Finance & Money Skills · Healthy Bodies, Calm Homes · Big Transitions, Big Feelings · Raising Resilient and Kind Kids · Contribution and Chores · Modern Digital and Social World · Friendship and Social Coaching · Parental Mental Health & Substance Abuse · School Assistance · High Risk Kids · Modern Parenting

**ADHD components** (`components/mdx/adhd/`, barrel `index.ts`): `DualPathwayDiagram`, `DelayAversionSlider`, `EvidenceTierToggle`, `MythbusterCards`, `PathwayComparison`, `GlossaryTooltip`, `StrategyExplorer`, `TemperamentTimeline`. Open data issue: co-occurrence discrepancy (20–30% vs ~46%), flagged in MDX. Missing citation: Jensen et al. 2001.

---

## Research Bible Ingestion Pipeline

**Flow:** `research-bible-refinement` skill updates a Drive-synced bible → the Apps Script time trigger (every 15 minutes, posts to the `www` URL) calls the webhook → `app/api/webhooks/drive-content-sync/route.ts` parses the file and writes to Payload as `_status: 'draft'` → Bobby reviews and publishes at `/admin` → live at `/research/[slug]`.

**Built:** `lib/research-bibles/parse.ts`, `lib/research-bibles/frontmatter.ts`, `lib/research-bibles-reader.ts`, `lib/google/drive.ts`, webhook route, `drive_content_sync_setup.md` (Apps Script reference).

**Auth:** `X-Webhook-Secret` header against `WEBHOOK_SECRET`. A real value of that secret is in git history, so it must be rotated in Vercel and the Apps Script `CONFIG` (BLOCKED-ON-BOBBY).

**Outstanding:**
- Apps Script trigger is installed; first live sync result needs confirming (HTTP 200 in Apps Script Executions, draft visible in `/admin`)
- Only files named `RB_*.md` are handled. The Drive folder also holds same-named Google Doc copies of some bibles, which are ignored

**Bible metadata rules:** `version` and `tags` are site-owned, never sourced from Drive. `version` auto-increments on each sync. `tags` Bobby sets manually via `/admin`.

---

## Parent Content Sync Pipeline

Manual-only Drive to Payload pipeline for Pain Point and Awareness Module content. Same pattern as the bible pipeline but separate code, endpoint, secret and Apps Script project. Never add an automatic trigger.

**Flow:** `parent-content-builder` skill writes `PainPoint_[Name].md` / `Module_[Name].md` to the `Parent Facing Content` Drive folder (`content/sync-config.json`) → Bobby manually runs `syncParentFacingContent()` from its own Apps Script project → `app/api/webhooks/parent-content-sync/route.ts` validates, dedups, and saves a draft in the Payload `pain-points` or `awareness-modules` collection → Bobby publishes at `/admin`. The site-owned `featured` flag is never touched by a sync.

**Built:** `lib/parent-content/parse.ts` (source parser and validation, tested with `node --experimental-strip-types --test lib/parent-content/parse.test.ts`), `lib/parent-content/frontmatter.ts` (YAML reader used by the parser), webhook route, `parent_content_sync_setup.md` (Apps Script reference, use the `www` URL).

**Auth:** `X-Webhook-Secret` header against `PARENT_CONTENT_WEBHOOK_SECRET` (separate from the bible route's `WEBHOOK_SECRET`).

**Outstanding:** not exercised end-to-end; Apps Script project not created; `PARENT_CONTENT_WEBHOOK_SECRET` not set in Vercel Production.

---

## Payload CMS

**Collections (17):** `Users`, `Media`, `Testimonials`, `PainPoints`, `AwarenessModules`, `ResearchBibles`, `DeepDives`, `Courses`, `Lessons`, `VisitorProfiles`, `Posts`, `Comments`, `Reports`, `LessonProgress`, `Entitlements`, `InterestSignups`, `Enrollments`

**Globals (4):** `FAQ`, `Footer`, `SiteSettings`, `About`

Schema source: `src/payload/collections/` and `src/payload/globals/`. Config: `payload.config.ts` (repo root).

**Access:** most collections use a local `isAdmin` helper that checks only `!!user` (any Payload user). `VisitorProfiles` is the only collection that checks `role`. `Users` has no `access` block, so any Payload user can edit any user's `role`. Do not create moderator accounts until role checks are added.

**Media:** `Media` uses Payload's default upload directory, `media/` at the project root, which is not durable on Vercel. See `docs/operations/storage.md`.

**`siteSettings` global** (`substackSubdomain`, `calComUrl`) - nothing reads from it. `lib/links.ts` and Cal.com URLs are hardcoded.

**Content:** 5 testimonials, 6 FAQ items, 10 pain points, 2 awareness modules, 36 deep dives, footer, site settings and about global are in Payload. `PAYLOAD_SECRET` and `DATABASE_URI` are set in Vercel Production.

---

## Community and Courses Platform (routes built, not live)

All visitor data lives in Payload collections. Key collections:

- **`VisitorProfiles`** (`visitor_profiles`) - userId (unique), userRole (parent|professional), displayName, bio, status (active|suspended)
- **`Posts`** (`community_posts`) - content, audience (parent|professional|all), status (visible|hidden|removed), isPinned, commentsCount. The feed sorts newest first and does not use `isPinned`
- **`Comments`** (`community_comments`) - content, post (relation), author (relation), status (visible|hidden|removed)
- **`Reports`** (`community_reports`) - targetType (post|comment), targetId, reason (6 enum values), note, status (open|actioned|dismissed), resolvedAt
- **`LessonProgress`** (`lesson_progress`) - userId (index), lessonId (index), completedAt
- **`Entitlements`** (`visitor_entitlements`) - userId, productId, expiresAt
- **`Enrollments`** (`course_enrollments`) - userId (index), courseSlug (index), source (free|admin)

Gated pages call `auth.getSession()` and look up the profile themselves. Email verification is enforced when the profile is created (`/api/auth/set-role`). Suspension is checked only on new posts, new comments and lesson pages. `lib/auth/require.ts` defines `requireSession()` and `requireProfile()`, but nothing calls them.
Rate limiting: `lib/rate-limit.ts` - in-memory sliding window; resets on cold start.

Community moderation API: `/api/community/report`, `/api/community/posts/edit`, `/api/community/comments/edit`.
Moderation guide for admins: `docs/operations/moderation.md`.

Middleware (`middleware.ts`) redirects requests without a Neon Auth session cookie on `/account/*`, `/community/*` and `/courses/*` to `/sign-in`. Next 16 deprecates the `middleware` file convention in favor of `proxy.ts`; the build prints a warning.

---

## Database

**Neon Postgres:** three schemas:
- `neon_auth` - Neon Auth (visitor sessions, managed by Neon)
- `payload_cms` - all Payload CMS tables
- `public` - 17 orphaned legacy tables (listed in `docs/operations/database.md`). No code reads them

`DATABASE_URI` is the only database connection variable.

**Migrations:** schema changes ship as files in `src/migrations/`; `payload.config.ts` sets `migrationDir` and has no migration code in the adapter. `payload migrate` applies them once per deploy, before the build, through the `ci` script (`payload migrate && next build`), which is the Vercel Build Command. The `build` script is `next build`. `package.json` sets `"type": "module"` because the Payload config is ESM, and the Payload CLI needs it. Vercel's Node.js Version is 20.x; to match it locally use `npx -y node@20 node_modules/payload/bin.js <command>` against the `preview` Neon branch only. Procedure, cutover steps, and per-environment status are in `docs/operations/migrations.md`.

---

## Social & Integrations

| Platform | Status |
|---|---|
| LinkedIn | Live outbound link |
| Instagram `bobby__washburn` | Disabled (`coming-soon-trigger.tsx`). Re-enable once content exists |
| Cal.com `bobby-washburn/intro-call` | Live outbound link site-wide. The Teen mosaic's popup embed is not wired |
| Substack `bwparentsupport` | On-page modal (`newsletter-dialog.tsx`). Subdomain in `lib/links.ts` |

---

## PII Policy (locked)

**Parent profile:** Name, email, age, gender only.
**Children:** Age and gender only - NO names, ever. No child-name column anywhere.
**Partner:** Age and gender only - NO name.

---

## Content Protection / SEO

- `app/robots.ts`: Googlebot and retrieval crawlers (ChatGPT Search, Perplexity, Claude search) may crawl everything except `/admin`. Training crawlers (GPTBot, ClaudeBot, CCBot and others) are blocked site-wide. All other agents are blocked from `/docs/`, `/common-pain-points/`, `/admin`, `/api/` and the auth and gated routes. `/research/` is not disallowed - per-entry `noindex` controls visibility.
- `app/sitemap.ts`: static routes + `/docs/[slug]` + `/common-pain-points/[slug]` + `/research/[slug]` (non-`noindex` only)

---

## Analytics

- **Vercel Analytics** (`@vercel/analytics/next`, `<Analytics />`) - in `app/(app)/layout.tsx`
- **Google Analytics 4** (`G-5ZLMM0G7CV`) - `gtag.js` via two `next/script` tags (`strategy="afterInteractive"`) in `app/(app)/layout.tsx`

---

## Build Rules

```
npm run build
npm run lint
npx tsc --noEmit
```

Vercel runs `npm run ci` (`payload migrate && next build`). Do not run `payload migrate` against any database except the `preview` branch. A branch or commit without the `ci` script fails to build on Vercel with `missing script: ci`.

**JSON edits (node, since python3 is not available on this Windows machine):**
```
node -e "const fs=require('fs'); const d=JSON.parse(fs.readFileSync('file.json')); /* modifications */; fs.writeFileSync('file.json', JSON.stringify(d,null,2))"
```

---

## Workflow

- **Claude.ai project:** Planning, architecture, decisions, content development
- **Claude Code (VS Code):** File generation and build tasks
- **CLAUDE.md:** Single source of truth. Always reconcile the whole file - never append sections that could contradict existing content.

---

## What Is NOT Being Built for Launch

- Subscription / paywall (Stripe code is in `graveyard/stripe/`)
- Auth gates on content
- Onboarding intake flow
- Community feed and full courses platform (routes exist, not launched)
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

## Guardrails

- The Production database changes only through the Vercel build running `payload migrate`.
- Local work uses only the preview Neon branch.
- Never print, decrypt or pull secrets or connection strings.
- Report command output as evidence, not summaries.
- No new handoff documents; status lives in Open Items.
- State only what the project does.

---

## Open Items

- **Production migration cutover** - the community/courses migration is applied to the `preview` branch, not production. Restore branch `pre-community-migration`, dev-row removal and the `npm run ci` Build Command are done. Remaining: confirm Vercel Node.js 20.x, push, let the preview deployment dry-run `ci`, merge, watch for one `Migrated:` line. Steps in `docs/operations/migrations.md`. Required before enabling auth/community/courses routes
- **Payload role checks** - `Users` has no `access` block and every collection except `VisitorProfiles` treats any Payload user as admin. Fix before creating moderator accounts
- **Suspension and verification helpers unused** - wire `requireProfile()` into gated pages and community, course and account routes
- **`middleware.ts` → `proxy.ts`** - Next 16 deprecates the middleware file convention
- **Redirect chain** - apex and `www` redirect to each other (about 1.6 s per load, LCP 7.5 s). Vercel domain setting (BLOCKED-ON-BOBBY). See `docs/operations/lighthouse.md`
- **Media uploads ephemeral** - Payload writes to `media/`; Vercel wipes the filesystem on deploy. A persistent storage adapter needs Bobby's approval before uploading images through `/admin`. See `docs/operations/storage.md`
- **`paths-loop.mp4` Chrome decode failure** - video renders as black box on Services hero; Bobby needs to re-export with `-movflags +faststart`
- **Community/courses platform** - routes built; Neon Auth console settings (verification, reset, sender, Google credentials, redirect URLs) need Bobby's confirmation; not tested end-to-end
- **Research Bible Pipeline** - first live sync result unconfirmed (check Apps Script Executions for HTTP 200, then check `/admin` for a draft); rotate `WEBHOOK_SECRET`
- **Parent Content Sync Pipeline** - not exercised end-to-end; Apps Script project not created; `PARENT_CONTENT_WEBHOOK_SECRET` not set in Vercel Production
- **Start Here Row 2 photos** - temp Unsplash stock; swap `ROW_TWO_PANELS` URL constants when real photos arrive
- **`siteSettings` global** - not wired to `lib/links.ts` or Cal.com URLs (hardcoded)
- **Organizations inquiry form** - confirm `INTEREST_SIGNUPS_SHEET_ID` is set in Vercel Production
- **Pending copy from Bobby:** About-Bobby page content, FAQ answers, Community Guidelines text and crisis notice wording
- **Community report emails** - `RESEND_API_KEY`, verified Resend sender domain, and `NOTIFY_EMAIL` needed in Vercel Production before report notification emails work
- **Cookie consent banner** - confirm whether GDPR/CCPA consent UI is required for the launch audience (legal decision)
- **ADHD accessibility** - keyboard + screen reader test of interactive components before promoting `/docs/adhd` as a flagship page
- **Orphaned `public` tables** - safe to drop once community and courses are confirmed live on Payload

---

## File Map

| Area | Location |
|---|---|
| Routes | `app/(app)/` (site pages and `layout.tsx`), `app/(payload)/` (Payload admin and REST API), `app/api/` (route handlers); `app/globals.css`, `app/robots.ts`, `app/sitemap.ts` |
| Migrations | `src/migrations/` (see `docs/operations/migrations.md`) |
| Reusable UI | `components/ui/` (shadcn), `components/layout/` |
| Marketing sections | `components/marketing/` |
| Tools UI | `components/marketing/tools/tech-safety-tool/` |
| MDX components | `components/mdx/`, ADHD in `components/mdx/adhd/` |
| Dashboard UI | `components/dashboard/`; data in `content/data/`, loaded by `lib/dashboard-data.ts` |
| Pain point components | `components/pain-points/teen-route/` (Teen mosaic, unwired) |
| Payload schema | `payload.config.ts` (root), collections/globals in `src/payload/`, admin branding in `src/payload/admin/` |
| Payload readers | `lib/payload-client.ts`, `lib/payload-globals.ts`, `lib/payload-courses.ts`, `lib/pain-points-reader.ts`, `lib/research-bibles-reader.ts` |
| Auth helpers | `lib/auth/server.ts` (Neon Auth client), `lib/auth/require.ts` (requireSession, requireProfile; not called) |
| Rate limiting | `lib/rate-limit.ts` (in-memory sliding window) |
| Shared logic | `lib/google/`, `lib/research-bibles/`, `lib/parent-content/`, `lib/tools/`, `hooks/` |
| Source assets (photos, logo) | `assets/` |
| Stripe (backlogged) | `graveyard/stripe/` - revival instructions in `graveyard/stripe/README.md` |
| Operations docs | `docs/operations/` - auth, auth-audit, backups, database, dependencies, deployment, email, environments, launch-review, lighthouse, migrations, moderation, roles-and-permissions, storage |
| Apps Script references | `drive_content_sync_setup.md`, `parent_content_sync_setup.md` |
| Reference content (docs MDX, dashboard data, sync config) | `content/docs/`, `content/data/`, `content/sync-config.json` |
| Middleware | `middleware.ts` |
| Env template | `.env.example` |
| Retired files | `graveyard/` |
