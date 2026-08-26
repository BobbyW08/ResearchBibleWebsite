# CLAUDE.md — ResearchBibleWebsite

**Repo:** BobbyW08/ResearchBibleWebsite · `main` branch
**Local path:** `C:\Users\robwa\Documents\Claude\ResearchBibleWebsite`
**Shell:** PowerShell
**Hosting:** Vercel (watches `main`)

This file states current facts only — what the site is, what's live, what's in progress, what's not built. No changelog, no history, no "as of" dates, no superseded plans, no resolved-item lists. If something here doesn't match the code, the code wins — flag the mismatch and fix this file in the same session, don't work around it silently.

---

## Working Rules for Claude Code

- **Trust this file's facts without re-verifying via `grep`/`find`/`Read` first.** Use the File Map below to go straight to the right file instead of exploring the tree.
- **`AGENTS.md`** only requires reading `node_modules/next/dist/docs/` for genuinely unfamiliar Next.js 16 APIs (routing conventions, config, middleware/proxy, data fetching, caching) — not for every edit. Content/styling/component changes don't need it.
- **If you find code that contradicts this file** — a route, field, or behavior that exists but isn't documented, or vice versa — stop, confirm the real state, and correct this file before moving on. Don't let drift accumulate.
- **JSON edits:** use the Python scripting pattern under Build Rules, never manual editing.
- **Before every commit:** `npm run build`, `npm run lint`, and `npx tsc --noEmit` must all exit zero.
- **Iterate in a branch** without committing until ready. Never commit a broken build.
- Give commands one at a time; keep file content and terminal commands clearly separated.

---

## What This Project Is

**bobby-washburn.com** — a parenting education / peer-support site for Bobby Washburn's private practice. The site:
- Positions Bobby as a Certified Peer Recovery Specialist (CPRS) — peer support, not clinical treatment
- Connects visitors to booking (Cal.com `/intro-call`), an on-page newsletter signup modal (Substack embed), and social (LinkedIn; Instagram disabled)
- Provides free, ungated parent-facing content: Pain Point pages (triage) and Deep Dive pages (research-backed)
- No paywall, no subscription, no auth gates on content. Launch first, monetize later.

Content philosophy: research bibles are internal practitioner documents. Parent-facing content is derived from them via a defined transformation — warm peer-to-peer tone, 8th-grade reading level, no visible citations, a practical example paired with every concept.

---

## Brand System (locked)

| Role | Value |
|---|---|
| Title (hero-level) | Archivo — **placeholder** for "Philly Sans"; Bobby is resolving licensing/a production substitute. Swapping the real font in is a one-line change: the `titlePlaceholder` font component and `--font-title-placeholder` variable in `app/layout.tsx` |
| Subtitle | **Arvo** — real, final (resolved from the earlier Roboto Slab/"Rockwell" placeholder; free Google Font, no licensing issue). `arvo` font component and `--font-arvo` variable in `app/layout.tsx`, aliased to `--font-subtitle` / `font-subtitle` in `app/globals.css`. Used for the footer nav (see Homepage Structure) |
| Heading / Subheading / Body | Libre Franklin (real, final — `app/layout.tsx`'s `libreFranklin`, mapped to both `--font-heading` and `--font-sans`) |
| Quotes / testimonial text | Caveat (real, final — `font-quote` utility) |
| Red (primary accent) | `#6B0000` (`--primary` / `bg-primary` / `text-primary`) |
| Near-black | `#111111` (`--foreground`, `--secondary`; also `--brand-black` / `bg-brand-black` for the literal near-black field, e.g. the footer and the Proof Wall hero) |
| Off-white | `#F8F8F8` (`--background`; also `--brand-offwhite` / `bg-brand-offwhite` for literal off-white surfaces, e.g. the Proof Wall's paper testimonial cards) |
| Gradient | Linear, 180°, `#111111` → `#6B0000` — `.bg-brand-gradient` utility class (`app/globals.css`). Secondary brand asset only — not used as the Proof Wall hero background, which is flat `--brand-black` so the header and hero read as one continuous surface (see Homepage Structure) |

All of the above are CSS custom properties in `app/globals.css` (`:root`/`.dark`, which mirror each other — one deliberate light identity, no dark mode). Because nearly every component uses the semantic Tailwind tokens (`bg-primary`, `text-foreground`, `bg-background`, etc.) rather than hardcoded colors, this palette applies site-wide — Fumadocs `/docs` pages, the dashboard, and `/common-pain-points` all re-theme from the same variables, not just the marketing pages.

---

## Tech Stack (locked — no new dependencies without approval)

- **Framework:** Next.js 16 (App Router)
- **Docs/content shell:** Fumadocs
- **UI components:** shadcn/ui + ShadcnSpace (free tier)
- **Animation:** Motion
- **Booking:** Cal.com — direct outbound links to the `intro-call` event (not embedded)
- **Newsletter:** Substack embed inside an on-page `Dialog` (shadcn/base-ui), triggered from the header (mobile menu), the footer's Connect column, `/services`' closing CTA, and as the "Join the waitlist" CTA on the Live Q&As / Cohorts cards on `/services`. Component: `components/marketing/newsletter-dialog.tsx`; subdomain constant in `lib/links.ts`.
- **CMS:** Keystatic, GitHub storage mode. `keystatic.config.ts` manages `testimonials`, `painPoints`, `awarenessModules`, `researchBibles` (collections) plus `faq`/`footer`/`siteSettings`/`about` (singletons). See Keystatic CMS section.
- **Database:** Neon (Postgres) — provisioned, tables exist, `neon_auth` schema live
- **Auth:** Better Auth via Neon Managed — enabled. Sign-up → onboarding → account flow is not yet verified end-to-end.
- **Hosting:** Vercel
- **Convention for server-side integrations (Drive, GitHub):** hand-rolled REST clients, no heavy SDKs (no `googleapis`, no Octokit) — see Research Bible Ingestion Pipeline.

Do NOT use: Framer, Rubix Documents, Aceternity UI, Magic UI Pro (paid), Supabase, self-hosted better-auth, any SaaS boilerplate.

---

## Site Map

### Public Routes (no auth, no gate)

| Route | Purpose | Status |
|---|---|---|
| `/` | Homepage | Live — Header → Hero (Proof Wall) → Start Here → Quick Credential → FAQ → Footer |
| `/about-bobby` | About Bobby page | Live, CMS-managed via the `about` singleton. The H1 ("About Bobby") and section structure are fixed, not CMS fields — see Homepage/About redesign notes below. `photo` is a real Keystatic image field; the page shows a placeholder box until Bobby uploads one. `/about` 301s here |
| `/services` | Services for Parents | Live, static content (not CMS-managed). Hero ("We Build [photo] Your Path") → "Start Walking Your Path" (Stabilize/Connect/Structure/Adapt phases) → "What I Offer" (1:1 Sessions, Weekly Group, Live Q&As, Cohorts) → closing CTA |
| `/services/organizations` | Services for Organizations & Nonprofits | Live, static content. Hero → "What I Offer" (Staff Training, Case Consultation, Parent Education Workshops, Reintegration Aftercare) → CTA. The CTA is a plain `mailto:` link, not the Cal.com intro-call flow used elsewhere — the org sales cycle is longer/more relationship-driven and there's no dedicated contact form or scheduling link yet |
| `/common-pain-points` | Pain Point index | Live — "Common situations" (10 pain-point cards) + "Big picture" (2 awareness-module cards). `/help` 301s here |
| `/common-pain-points/[slug]` | Pain Point pages | Live for 10 slugs (see Pain Point Pages table) + 2 awareness modules (`modern`, `mentalhealth`). `/help/[slug]` 301s here |
| `/docs` | 36-topic categorized gallery (Stabilize / Connect / Structure / Adapt) | Live — all topic pages resolve |
| `/docs/adhd` | ADHD Deep Dive — flagship, full interactive components | Live |
| `/docs/[topic]` | 35 remaining deep dives — prose complete at webpage copy tier | Live as prose — no dashboard JSON yet |
| `/dashboard` | Quick-reference index | Live, redirects to `/dashboard/adhd` |
| `/dashboard/adhd` | ADHD quick-reference dashboard | Live |
| `/dashboard/[topic]` | Future topic dashboards | Not built — needs JSON data per topic |
| `/tools` | Tools index | Live, unlisted (no header/footer nav link by design) — lists the tech safety tool, now linking to `/tech-safety` |
| `/tech-safety` | Tech Safety & Consequence Setup — interactive parental-controls wizard (pick your phone + your child's devices → tailored setup steps, workarounds list, printable checklist for 11 device types + home Wi-Fi) | Live, standalone, unlisted (no header/footer nav link by design). The consequence framework ("Applying It as a Consequence") now renders as step 2, right after the phone/device picker and before the device-by-device setup guide. Data in `lib/tools/tech-safety-tool-data.ts`, components in `components/marketing/tools/tech-safety-tool/`. Screenshots hotlink Apple's CDN directly (`cdsassets.apple.com`) — not self-hosted, may break if Apple changes those URLs. `/tools/tech-safety-tool` 301s here |
| `/research` | Research Bible Library index | Not in header/footer nav by design — reachable by direct URL only. No entries exist yet (see Research Bible Ingestion Pipeline) |
| `/research/[slug]` | Individual research bible, public | Same nav-hidden-by-design pattern. `generateMetadata` sets `robots: {index: !entry.noindex}` per bible. Changelog renders as a visible "Updates" section on the page |

**301 redirects** (`next.config.ts`): `/about` → `/about-bobby`, `/tools/tech-safety-tool` → `/tech-safety`, `/help` → `/common-pain-points`, `/help/:slug` → `/common-pain-points/:slug`, `/tech-consequences` → `/tech-safety`.

### CMS / Admin / Internal Routes

| Route | Purpose | Status |
|---|---|---|
| `/keystatic` | Keystatic CMS admin UI | Reachable but not yet functional — needs a GitHub App and 4 env vars set (see Keystatic CMS section) before writes work |
| `/api/keystatic` | Keystatic API handler | Same GitHub App dependency |
| `/internal/pages` | Internal registry of every live collection slug (`researchBibles`, `painPoints`, `awarenessModules`, `testimonials`) plus a small hardcoded route list | `noindex`, not in nav |

### Dormant Routes (reachable, not actively used)

| Route | Purpose | Status |
|---|---|---|
| `/auth/[path]` | Sign in / sign up / reset | Reachable. Not needed for launch. Flow unproven end-to-end. |
| `/onboarding` | Account type gate | Not needed for launch. |
| `/account/[path]` | Account management | Not needed for launch. |
| `/api/refresh` | Old Google Drive Doc/Sheet sync | Not wired (placeholder IDs, no service account credentials). The Doc→MDX half is superseded by `/api/webhooks/drive-content-sync` — do not build further against this route's Doc path. The Sheet→JSON dashboard-data half's status needs confirming with Bobby before reviving. |
| `/api/research-bible/notify-change` | Old Doc-polling webhook | Never fired. Superseded by `/api/webhooks/drive-content-sync`. Do not build further against this route. |
| `/api/account/pending-reviews` | Review approval API | Table exists, empty. `pending_reviews` is an audit-log table only — git PR review + merge is the actual approval mechanism. Candidate for removal. |
| `/api/cascade/*` | Word doc / video script cascade | Not built. Not in current scope. |

---

## Homepage Structure

Section order in `app/page.tsx`:

1. **Header** (`components/marketing/header.tsx`) — nav: About (`/about-bobby`) · Start Here (in-page anchor, `/#start-here`) · **Parents** (`/services` — renamed from "Services") · FAQs (in-page anchor, `/#faq`). No dropdown. Organizations is deliberately not a header item — reached via Start Here's Row 2 or the footer nav instead (see #6). On the homepage only, the header is rendered with `logoAnimatesIn` — its wordmark starts invisible and crossfades in via Motion's `useScroll`/`useTransform` as the user scrolls past the hero, timed to match the hero's own logo shrinking out (see #2). While the header is still transparent over the hero (not yet scrolled/"sticky"), it renders light-on-dark (`onHeroField` in `header.tsx`) — including a `bg-brand-black` fill on the outer header bar itself, so it reads as one continuous surface with the hero rather than revealing the page's off-white body background behind it. Once scrolled into the sticky frosted-pill state, it reverts to normal dark-on-light. Every other page renders the header with the logo always visible and no light-on-dark state (no hero to blend with).
2. **Hero — "Proof Wall"** (`hero.tsx` + `proof-wall-hero.tsx`) — flat `bg-brand-black` field, no gradient (the gradient is a secondary brand asset, not used here). A large wordmark shrinks/fades and cycles through color variants (gray/white/red/gradient, via the `Logo` component's `variant` prop — see Logo Behavior below) via scroll-linked Motion transforms as the user scrolls, handing off to the header's wordmark (see #1). Five tilted, sharp-cornered "paper" testimonial cards (off-white, tape accent, Caveat quote text, cursor-parallax) surround a central two-tone statement ("Parenting **sucks** right now. It doesn't have to." — "sucks" in `text-primary`), a regular-weight subhead, and the former hero headline demoted to a smaller supporting line, sourced live from the `testimonials` Keystatic collection (falls back to hardcoded copy if the collection is empty). CTA links straight out to the Cal.com `intro-call` URL, not an internal page.
   - **Logo Behavior:** `assets/logo/logo.tsx`'s `Logo` component takes a `variant?: "gray" | "white" | "red" | "gradient"` prop driving the wordmark's color — a text-based stand-in for the real BWPS SVG mark files (`BWPSLogoGray/White/Red/Gradient.svg`), which haven't been dropped into `assets/logo/` yet. `proof-wall-hero.tsx` cycles through all four variants via `useMotionValueEvent` on scroll progress as the hero logo shrinks. Swapping in the real SVGs means editing `logo.tsx` internals only — call sites (`<Logo variant="..." />`) don't change.
3. **Start Here** (`start-here.tsx`, async server component) — two rows, not a flat tile grid:
   - **Row 1:** left third is a Tech Safety Tool tile (`/tech-safety`) with a placeholder photo (real "parent using the tool" photo not yet supplied); right two-thirds is a vertical auto-scrolling carousel (`.marquee-track-vertical` in `globals.css`, CSS-only, pause-on-hover) of every pain-point topic from `getAllPainPoints()` — rendered twice in the DOM for a seamless loop, so every pain-point link is present in the initial HTML (SEO requirement: no lazy-loading/fetch-on-interaction).
   - **Row 2:** three equal-width panels touching with no gap — "Parents." → `/services#one-on-one`, "Groups." → `/services#weekly-group` (both `/services`, deep-linked to stable anchor IDs on the 1:1 Sessions / Weekly Group `OfferCard`s — see Services Pages), "Organizations." → `/services/organizations`. All three use placeholder photos (real photos not yet supplied).
4. **Quick Credential** (`quick-credential.tsx`) — photo slot + 5 bulleted credential lines (CPRS/RI Board ID, current role, military background, training, work history), "Learn more" → `/about-bobby`.
5. **FAQ** — 6 Q&As, CPRS/peer-support framing (opens with "Is this therapy?"). Scroll target for the nav's "FAQs" anchor.
6. **Footer** (two-column, bymonolog.com pattern) — left column is a sitemap list, **not identical to the header nav**: About / Start Here / Parents / **Organizations** / FAQs (one item longer — Organizations is deliberately absent from the header). Set in `font-subtitle` (Arvo), with a bymonolog.com-style hover treatment (row fills solid `bg-brand-offwhite`, text inverts to `text-brand-black`, trailing `ArrowUpRight` icon appears) rather than a simple color-change link. Right column is Connect (Book a Call, Newsletter modal, contact email, LinkedIn/Substack/Instagram-disabled icons). Rendered on every page, not just the homepage.

The old standalone Connect section, Meet Bobby section, homepage Pain Points grid, and full-bleed Testimonials marquee were removed in the redesign — their content/purpose now lives in the sections above or in the footer.

---

## Services Pages (`/services`, `/services/organizations`)

Static content (not CMS-managed) — `app/services/page.tsx` and `app/services/organizations/page.tsx`, sharing `components/marketing/services/offer-card.tsx` for the pricing/offering cards.

- **`/services` (For Parents):** Hero ("We Build [photo] Your Path", `components/marketing/services/wedged-hero-headline.tsx`) — a scroll-converge wedged-photo headline: the two text halves start pulled toward the viewport edges with the photo small and centered, then converge (photo growing) into one tight line as the section scrolls into view, via Motion's `useScroll`/`useTransform` (same technique as the homepage logo shrink) → "Start Walking Your Path" (the Stabilize/Connect/Structure/Adapt framework — this content lives here only, not duplicated on `/about-bobby`) → "What I Offer" (1:1 Sessions and Weekly Group are `available`; Live Q&As and Cohorts are `comingSoon` with a "Join the waitlist" CTA that opens the Newsletter dialog — chosen as the lowest-effort option consistent with the existing stack, since there's no dedicated waitlist table or Resend integration) → closing CTA. A second "Talk to Bobby" CTA sits inside the Weekly Group card, in addition to the page's closing CTA — intentional, not a duplicate. The 1:1 Sessions and Weekly Group `OfferCard`s carry stable anchor IDs (`#one-on-one`, `#weekly-group` — `OfferCardData.anchorId`, rendered onto the `Card` with `scroll-mt-24`) so the homepage Start Here Row 2 panels ("Parents." / "Groups.") can deep-link straight to them.
- **`/services/organizations`:** Hero → "What I Offer" (Staff Training & Professional Development, Case Consultation, Parent Education Workshops — the $850 flat-rate contracted-group-work offering, not to be confused with the business plan's separate $150–300/session "Paid Parent-Education Evenings," which isn't built — and Reintegration Aftercare Plan) → "Let's Talk" CTA, a plain `mailto:` link rather than the Cal.com intro-call flow.

---

## Pain Point Pages (`/common-pain-points`, `/common-pain-points/[slug]`)

Custom layout — NOT Fumadocs. CMS-managed via Keystatic: `painPoints` collection (`content/pain-points/*.yaml`, 10 entries) and `awarenessModules` collection (`content/awareness-modules/*.yaml`, 2 entries — narrative sections instead of age-tabs/backfires/tries). `lib/pain-points.ts` holds only shared TypeScript types; data and lookups (`getHelpEntry`, `getAllPainPoints`, `getFeaturedPainPoints`) live in `lib/pain-points-reader.ts` (async, reads via `lib/keystatic-reader.ts`). Icon fields store a name string (`Flame`, `Smartphone`, ...) resolved to a `LucideIcon` via `lib/pain-point-icons.ts` — keep both files' icon lists in sync when adding an icon.

`painPoints` display order follows the Keystatic collection's file listing, not authored order — collections don't support drag-reorder (only singletons/`fields.array` do, which is why `faq` uses that pattern instead).

| Slug | Topic | Deep-dive link (`/docs/...`) |
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

Each pain-point page: tag/eyebrow, headline, intro, an interactive age-band scenario switcher (2-5 / 6-9 / 10-12 / 13+), "What's happening" (mechanism), "Why this usually makes it worse" (backfires list), "Try this week" (accordion), "When to get more support" (988/Crisis Text Line/211 on `burnout` and `mentalhealth`), and "Go deeper" links. Components: `pain-point-detail.tsx`, `awareness-module-detail.tsx`, `pain-point-age-tabs.tsx`, `pain-point-accordion.tsx`, `pain-point-support-callout.tsx`, `pain-point-content.tsx`, `pain-point-card.tsx`.

---

## Deep Dive Topics (`/docs/[slug]`)

Four pillars, 36 topics, rendered via Fumadocs. All 36 pages resolve and are live. ADHD is the flagship (888 lines, full interactive components). The other 35 are prose-complete at webpage copy tier (200–430 lines each) — finished prose, no dashboard JSON, consensus meters, or comparison panel data yet.
Depth standard for flagship pages: 7,000–9,000 words, mechanism-level explanations required.

**🔴 Stabilize (9):** What Do You Want · De-Escalation · Parent Emotional Regulation · Structure & Routine · Understanding Behavior · **Understanding ADHD** (`content/docs/adhd.mdx`, live) · Understanding Autism Spectrum Disorder · Understanding Anxiety & Depression · Trauma Informed Parenting

**🟡 Connect (8):** Parental Self Care · Connection Principles · Values · Parenting Styles · Communication · Family Dynamics · Motivation · Mindsets

**🟢 Structure (6):** Applying Parenting Strategies · Child Development · Teen Autonomy and Identity · Principles of Effective Discipline · Behavior-Reward-Consequence System · Co-Parenting

**🔵 Adapt (13):** Public Places Without Panic · Supporting Aggressive Children · Household Finance & Money Skills · Healthy Bodies, Calm Homes · Big Transitions, Big Feelings · Raising Resilient and Kind Kids · Contribution and Chores · Modern Digital and Social World · Friendship and Social Coaching · Parental Mental Health & Substance Abuse · School Assistance · High Risk Kids · Modern Parenting

---

## Content Pipeline

**Source hierarchy (never break this order):** Research Bible (repo MDX, kept current via the Research Bible Ingestion Pipeline) → Webpage copy document → MDX/JSON rendering files. Changes always flow downstream — never modify rendering files without a corresponding upstream source update.

**Depth standard:** 7,000–9,000 words for parent-facing deep-dive pages, mechanism-level explanations required.

**Content files:**
- `content/docs/adhd.mdx` — ADHD deep dive
- `content/data/adhd.json` — ADHD dashboard data
- `content/sync-config.json` — Drive-folder-ID mapping. `adhd` key serves the old (dormant) pipeline; `researchBibles.driveFolderId` serves the Research Bible Ingestion Pipeline

---

## Research Bible Ingestion Pipeline

Keeps the internal research bibles current in the repo, upstream of the Content Pipeline above. Backs the `/research` and `/research/[slug]` routes.

**Flow:** the `research-bible-refinement` skill runs locally in Claude Desktop (unaware of git/GitHub/website infra by design), updates a bible + a Substack draft companion in a Drive-synced folder → a Drive webhook fires → `app/api/webhooks/drive-content-sync/route.ts` ingests the changed file, converts it to MDX matching the Keystatic schema, opens a GitHub PR with a diff description and the Substack draft attached → Vercel builds a preview deployment → Bobby reviews and merges → merge = publish, the changelog array renders on the live page.

Git PRs are the approval/versioning layer, not a custom UI. `pending_reviews` stays in the schema as an audit log only.

**Scope:** bible sync is built (see below). Pain-point/module Drive sync is in progress — the Keystatic schema for both collections is already complete (`cardTeaser`, `tag`, `icon`, `crisis`, per-age-band scenarios all exist and the 10 live pain-point / 2 live awareness-module files already conform to it), but the webhook has no `parentFacingContent` branch yet and the `parent-content-builder` skill (Claude Desktop, outside this repo) doesn't yet produce files in the shape the new parser expects. Full spec in `Research-Content-Pipeline-Handoff-v3.md` at repo root.

**What's built:**
- `keystatic.config.ts` → `researchBibles` collection, `content/research-bibles/*/index.mdx`, `format: { contentField: "body" }` (frontmatter + `---` + MDX body in one file). Fields: `slugName`, `title`, `version`, `lastUpdated`, `tags`, `noindex`, `changelog` (array of `date`/`summary`/`prUrl`), `body`. No entries exist yet.
- `lib/research-bibles/parse.ts` — `extractTitle`, `extractChangelogEntry`, `stripPandocArtifacts`, `extractBody`, `computeVersion`. Unit-tested (`parse.test.ts`) via Node's built-in test runner: `node --experimental-strip-types --test lib/research-bibles/parse.test.ts`.
- `lib/research-bibles/frontmatter.ts` — hand-rolled YAML frontmatter serializer/parser scoped to this collection's schema only (no general YAML dependency added).
- `lib/research-bibles/render-mdx.tsx` — renders a bible's `body` as GFM Markdown for `/research/[slug]` via `remark-parse`/`remark-rehype`/`hast-util-to-jsx-runtime` (transitive deps of `fumadocs-mdx`, not declared directly in `package.json`).
- `lib/research-bibles-reader.ts` — `getAllResearchBibles()` / `getResearchBible(slug)`, same pattern as `lib/pain-points-reader.ts`.
- `lib/google/drive.ts` — `fetchDriveFileContent(fileId)` via direct `fetch` + `lib/google/serviceAccountAuth.ts` (no `googleapis` package).
- `lib/github/contents.ts` — hand-rolled GitHub REST client: `getDefaultBranchSha`, `createBranch`, `getFileSha`, `getFileContent`, `putFile`, `updateFile`, `openPullRequest`. Auth via `GITHUB_CONTENT_SYNC_TOKEN` (separate from Keystatic's own `KEYSTATIC_GITHUB_*` app credentials).
- `app/api/webhooks/drive-content-sync/route.ts` — the sync webhook. Auth: `X-Webhook-Secret` header, timing-safe compare against `WEBHOOK_SECRET` (same env var as `/api/refresh`). Body: `{fileId, fileName, folderKey}` — only `folderKey === "researchBibles"` + filename matching `RB_*.md` is handled, anything else 400s. Flow: fetch from Drive → title extraction (typed `BibleParseError` on failure) → changelog-entry extraction (in-body Refinement Log block if present; otherwise falls back to the `_DDMMYY` date suffix on `fileName`; otherwise today's date with a genuine "initial sync" summary) → Pandoc-artifact strip → body extraction → sha256 dedup guard against the live GitHub file (no-op 200 if unchanged) → version computed server-side from changelog length → branch `content-sync/bible-<slug>-<date>` → commit → open PR → follow-up commit filling the real PR URL into the changelog entry. Has an in-memory token-bucket rate limiter (module-level state, resets on cold start — acceptable for a low-traffic internal webhook, not a true distributed limiter).
- `app/robots.ts` — disallows `/docs/` and `/common-pain-points/` for all agents except Googlebot. `/research/` is intentionally not disallowed — visibility is controlled per-entry via `noindex`.
- `app/sitemap.ts` — static routes + `/docs/[slug]` (via Fumadocs' `source.generateParams()`) + `/common-pain-points/[slug]` + `/research/[slug]` for every non-`noindex` bible.
- `drive_content_sync_setup.md` (repo root) — Apps Script reference for the `researchBibles`-folder-only trigger. Separate from `drive_sync_setup/`/`notify_change.gs`, which still serve the old (dormant) pipeline.

**Bible metadata rules:**
- `version` is site-owned, never parsed from source. Defaults to `"1.0"` on first sync, auto-increments on every subsequent sync (derived from changelog array length after the new entry is prepended).
- `tags` is site-owned, never sourced from Drive. Defaults to `[]` on first sync; Bobby assigns manually via `/keystatic`. Permanent once set — later syncs must never touch `tags`.

**Verified against real files (2026-08-12):**
- Checked `parse.ts` against real files in the Research Bibles Drive folder (folder ID `1DYDwFPEyWFmsHR-XKvviajypNlDQedT2`, now set in `content/sync-config.json`'s `researchBibles.driveFolderId`). All real bibles use an ATX-style H1 (`# Research Bible: <Title>`), NOT the Setext style previously assumed — `extractTitle`/`extractBody` have been corrected to match.
- The `research-bible-refinement` skill (Step 7) confirmed to deliberately NOT write a `**Refinement Log**` block into the body anymore — it logs externally to `_WeeklyRefinementLog.md` and stamps a `_DDMMYY` date suffix on the filename instead. `extractChangelogEntry` now reads that filename suffix as a fallback signal instead of assuming every sync is a fresh "initial sync."
- `RB_Anxiety_and_Depression.md` is confirmed malformed: its title was never styled as Heading&nbsp;1 in the source Google Doc, so it exports with no Markdown heading at all. It will 400 on `extractTitle` until Bobby fixes the heading style in the Doc — this is expected/intentional (title parsing should stay strict), not a code bug.

**Still outstanding:**
- The frontmatter serializer's output hasn't been diffed against what a real hand-created `/keystatic` entry for this collection actually produces (blocked on Keystatic's GitHub App env vars — see Keystatic CMS section).
- The webhook route hasn't been exercised end-to-end against a live Drive file + real GitHub PAT (only unit-tested against fixtures so far).
- The Apps Script trigger (`drive_content_sync_setup.md`) is not installed yet — manual step for Bobby in script.google.com: paste the script, set `CONFIG.driveFolderId` to `1DYDwFPEyWFmsHR-XKvviajypNlDQedT2` and `CONFIG.webhookSecret` to match `WEBHOOK_SECRET`, then run `setup()` once.

---

## ADHD Components (`components/mdx/adhd/`, barrel `index.ts`)

All 8 live in `content/docs/adhd.mdx` (888 lines): `DualPathwayDiagram`, `DelayAversionSlider`, `EvidenceTierToggle`, `MythbusterCards`, `PathwayComparison` (504-vs-IEP), `GlossaryTooltip`, `StrategyExplorer`, `TemperamentTimeline`.

**Open data issue:** ADHD co-occurrence data discrepancy — Research Bible shows 20–30% learning disability rate, Parent Guide shows ~46%. Flagged as `flaggedForReview` in the MDX — do not silently resolve before publication.
**Missing citation:** Jensen et al., 2001 — referenced but not sourced. Resolve before publication.

---

## Reusable MDX Components (`components/mdx/`)

Registered in `mdx-components.tsx`, usable by tag name in any `.mdx` file: `ConsensusMeter` (inline evidence-strength bars, CSS not Recharts), `ComparisonPanel` (strong-claim/softer-claim two-column cards with flagged badge), `ImageGallery` (responsive grid, click-to-expand lightbox), `VideoEmbed` (responsive 16:9 iframe, click-to-load facade).

---

## Dashboard (`/dashboard/[topic]`)

Own nav shell, outside Fumadocs. Components: `DashboardShell`, `StatCard`, `ConsensusChart` (Recharts), `DisagreementTable` (TanStack Table). Data source: `content/data/[topic].json`.

---

## Keystatic CMS

Non-technical how-to for making edits once this is live: `KEYSTATIC-EDITING-GUIDE.md` at repo root (also covers what's editable here vs. hand-authored-only).

GitHub storage mode — edits commit directly to `BobbyW08/ResearchBibleWebsite` via a GitHub App (Vercel's serverless filesystem is read-only in production, so local-storage mode isn't viable).

**CMS-managed:**
- `testimonials` — collection, `content/testimonials/*.yaml` (`quote`, `attribution`)
- `painPoints` — collection, `content/pain-points/*.yaml`, 10 entries. Every field on `/common-pain-points/[slug]` for these is editable: tag, title, intro, all 4 age-band scenarios, `whatHappening` (conditional block array), `backfires`, `tries`, `support`, `deepDive`, `related`, `featured`, icon (name string)
- `awarenessModules` — collection, `content/awareness-modules/*.yaml`, 2 entries. Same base fields as `painPoints` plus `sections`, no age-tabs/backfires/tries
- `researchBibles` — collection, `content/research-bibles/*/`, no entries yet — see Research Bible Ingestion Pipeline
- `faq` — singleton, `content/faq/data.yaml` (ordered `question`/`answer` array — singleton specifically for native drag-to-reorder, since order is narratively load-bearing)
- `footer` — singleton, `content/footer/data.yaml` (`tagline`, `contactEmail`, `copyrightText`). The sitemap/Connect link columns themselves are hardcoded in `footer.tsx` (a deliberately longer list than the header nav — see Homepage Structure) — not CMS-driven, since the redesign treats header/footer nav as a fixed design decision rather than free-form editable content.
- `about` — singleton, `content/about/data.yaml`. Fields: `heroSubhead`, `credentialBadge`, `photo` (real Keystatic image field — shows a placeholder box on the page until Bobby uploads one), `shortAboutParagraphs`, `cprsId`, `currentRole`, `training`, `prior`, `also`. The H1 ("About Bobby") is fixed copy, not a field. There's no more blank/placeholder `personalDisclosure` field — Bobby's full personal account is written directly into `shortAboutParagraphs` now. The four-phase framework section was removed from this page entirely (it lives only on `/services` as "Start Walking Your Path")
- `siteSettings` — singleton, `content/site-settings/data.yaml` (`substackSubdomain`, `calComUrl`) — **holds real values but nothing reads from it yet.** `lib/links.ts` and the hardcoded Cal.com URLs across the site are not wired to it. Wiring means converting those client components to fetch-and-pass-props.

**Not CMS-managed:** `content/docs/*.mdx` (37 Fumadocs deep-dive pages) and `content/data/*.json` (dashboard data) stay hand-authored/Google-Drive-sourced.

**Still to do:**
1. Set 4 env vars in the Vercel project dashboard (Production): `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. **Without these, `npm run build` fails outright** — the route handler validates them at build time.
2. Add a production callback URL on the GitHub App once the domain is ready: `https://bobby-washburn.com/api/keystatic/github/oauth/callback` (Vercel preview URLs are skipped — unstable per-deployment).
3. Prove the GitHub OAuth → commit write path end-to-end through the admin UI.

**Local dev requirements for `/keystatic` to work at all:**
- `next.config.ts` needs `allowedDevOrigins: ["127.0.0.1"]` — GitHub-storage-mode Keystatic hard-navigates `localhost` → `127.0.0.1` for its OAuth loopback flow, and without this config Next's dev-origin protection silently blocks the redirected page's own dev assets (blank page, no console error).
- The GitHub App needs **both** callback URLs registered: `http://127.0.0.1/api/keystatic/github/oauth/callback` and `http://127.0.0.1:3000/api/keystatic/github/oauth/callback`. GitHub Apps don't honor the portless "any loopback port" leniency in practice — the exact-port one is required.

**`/keystatic` and `/api/keystatic` are reachable without a session cookie by design.** `proxy.ts`'s Better Auth check protects a different identity system (end-user `profiles` accounts). Keystatic's actual write authorization is GitHub's own permission model — a write from a non-collaborator 403s at the GitHub API regardless of page reachability.

---

## Social & Integrations

| Platform | Handle / URL | Status |
|---|---|---|
| LinkedIn | Bobby's personal account | Direct outbound link — live (header, footer) |
| Instagram | `bobby__washburn` | Disabled — zero content lives there. Every instance site-wide renders as a disabled trigger (`components/marketing/coming-soon-trigger.tsx`) with a "Coming soon" tooltip/badge, `aria-disabled="true"`. Not in the Person JSON-LD `sameAs` array. Re-enable by swapping in a real `<a>` once there's content |
| Facebook | — | Not implemented. No icon, link, or reference anywhere in the codebase |
| Cal.com | `bobby-washburn/intro-call` | Direct outbound link — live across header, homepage hero (Proof Wall), `/about-bobby` (×2), `/services` (×3), and the footer |
| Substack | `roughlyeducated` | On-page signup modal (`components/marketing/newsletter-dialog.tsx`) with an embedded iframe, plus an outbound "Or read past issues on Substack →" link inside the modal. Subdomain constant: `lib/links.ts` → `SUBSTACK_SUBDOMAIN` — needs Bobby's confirmation this is correct before the embed ships |

Cal.com and LinkedIn are direct outbound links; Substack is the one embed.

---

## PII Policy (locked)

**Parent profile:** Name, email, age, gender — no additional PII.
**Children:** Age and gender only — NO names, ever. No column for child name in any database table.
**Partner:** Age and gender only — NO name.

No COPPA exposure, no accidental PII collection for minors. This is a product/legal decision — do not add name fields for children or partners under any circumstances.

---

## Auth & Database (real, committed — not needed for launch, not to be deleted)

- **Neon Postgres:** provisioned. `neon_auth` schema exists. Better Auth (Managed) enabled.
- **Tables in `public` schema (all exist, all empty):** `profiles` (`user_id`, `account_type` — `'parent'`/`'practitioner'`, age, gender), `topic_progress` (`user_id`, `topic_id`, `last_viewed_at`, `completion_state`), `pending_reviews` (audit-log role only — see Research Bible Ingestion Pipeline)
- 1 real user has signed up but has 0 rows in `profiles` — onboarding was never completed, so sign-up → onboarding → account is unproven end-to-end
- Route protection via `proxy.ts` middleware, scoped to `/account` and `/onboarding` only
- Social login intentionally disabled (CVE advisory on bundled better-auth OAuth)

**Local Vercel CLI:** `.vercel/project.json` may not match the real project. Real project ID: `prj_2AgBQ4NhUvGsAij6A6N7YLnRovdQ`. Run `vercel link` and select that project before using `vercel env`/`vercel deploy` locally — GitHub auto-deploys are unaffected either way.

**To prove auth end-to-end:** sign up a test user → complete onboarding → verify a `profiles` row is created → verify `/account` is accessible.

---

## Content Protection / SEO

- `app/robots.ts`: disallows `/docs/` and `/common-pain-points/` for all non-Googlebot agents (blocks GPTBot, ClaudeBot, CCBot, PerplexityBot, etc.); Googlebot fully allowed. `/research/` is not disallowed — visibility is per-entry via each bible's `noindex` field.
- `app/sitemap.ts`: static routes (including `/services`, `/services/organizations`) + `/docs/[slug]` + `/common-pain-points/[slug]` + `/research/[slug]` (non-`noindex` only)
- All content pages: full meta titles, descriptions, structured data for SEO
- Rate limiting on content routes via Vercel middleware (prevents bulk scraping)

---

## Build Rules

Before every commit, all three must exit zero:
```
npm run build
npm run lint
npx tsc --noEmit
```

**JSON edits:** Use Python scripting pattern, never manual editing:
```
cat file.json | python3 -c "import json, sys; data = json.load(sys.stdin); [modifications]; print(json.dumps(data, indent=2))" > output.json
```

**Branching:** Iterate in a branch without committing until ready. Do not commit broken builds.

---

## Workflow

- **This Claude.ai project:** Planning, architecture, decisions, content development
- **Claude Code in VS Code:** Actual file generation and build tasks
- **CLAUDE.md:** Single source of truth — bridges the two contexts. Always reconcile the whole file rather than appending sections that could contradict existing content.
- **Commands:** One at a time. File content clearly separated from terminal commands.

---

## What Is NOT Being Built for Launch

- Subscription / paywall / Stripe
- Auth gates on content
- Onboarding intake flow
- Old Google Drive sync automation via `/api/refresh` — superseded for bibles by the Research Bible Ingestion Pipeline; don't revive the Doc→MDX half as-is
- Old pending-reviews approval-gate UI — superseded; `pending_reviews` stays an audit-log table only
- Pain-point/module Drive sync — not built, not scheduled this round
- Word doc / video script cascade

---

## Skills in This Project

- `research-bible-builder` — builds comprehensive research bibles from source documents
- `research-bible-refinement` — runs locally in Claude Desktop; searches for new/emerging research on a bible's topic and integrates it into the existing bible structure. Drives the Research Bible Ingestion Pipeline; intentionally unaware of git/GitHub/website infrastructure, never triggers publishing directly
- `parent-content-builder` — transforms research bibles into parent-facing content (bible → webpage copy → MDX/JSON). Needs `cardTeaser`, `tag`, `icon`, `crisis` (boolean, always explicitly confirmed, never defaulted), and per-age-band scenario content added to its live definition — see Open Items
- `content-development-from-trends` — develops content packages from trend report topics
- `video-script-format` — produces video scripts in a consistent format
- `substack-voice-structure` — writes Substack articles in a consistent voice

---

## Open Items

- **`parent-content-builder` skill fields:** confirmed the skill still outputs its old flat frontmatter/prose format, not the granular fields the live Keystatic schema needs (`cardTeaser`, `tag`, `icon`, `crisis`, per-age-band scenarios, structured backfires/tries). The skill lives outside this repo (Claude Desktop's skill storage) — Claude Code cannot see or edit it, only Claude Desktop/Cowork can. Being fixed there, not here.
- **`painPoints`/`awarenessModules` schema:** already has every field needed (`cardTeaser`, `tag`, `icon`, `crisis`, per-age-band scenarios) — this was previously listed as missing here; it isn't. The real gap is upstream (the skill, above) and in the webhook (no `parentFacingContent` ingestion path yet).
- **`files.zip`** sits at the repo root and is git-tracked — confirm with Bobby whether it should be removed.
- **`CPRS_Interactive_Site.html`, `TechConsequences_ParentGuide.html`, `adhd-prototype.html`, `tech_transitions_per_parenting_generation.html`** sit untracked at the repo root as prototype/reference files. Nothing in the live site depends on them — confirm with Bobby whether to delete or relocate.
- **Research Bible Ingestion Pipeline** is uncommitted, in-progress work — see its Verification section for exactly what's unconfirmed before treating it as production-ready.
- **Substack subdomain** (`roughlyeducated`) needs Bobby's confirmation before the embed ships.
- **"Parent Education Workshops" naming** on `/services/organizations`: this is the $850/flat Group-Contracting engagement from the business plan. Worth confirming with Bobby that the name doesn't cause confusion with the separate (unbuilt, not on the site) $150–300/session "Paid Parent-Education Evenings" offering.
- **`/services/organizations`'s "Let's Talk" CTA** currently routes to a plain `mailto:` link as a placeholder — confirm with Bobby whether a dedicated contact form or scheduling link should replace it.
- **About-Bobby photo** — the `about` singleton's `photo` field is live but empty; the page shows a placeholder box until Bobby uploads one via `/keystatic` (blocked on the same GitHub App env vars as the rest of Keystatic writes).
- **Real BWPS logo SVGs still not in the repo.** `homepage-redesign-v3.md`'s Logo Behavior calls for cycling through `BWPSLogoGray.svg` / `BWPSLogoWhite.svg` / `BWPSLogoRed.svg` / `BWPSLogoGradient.svg` (plus three `BWPS_Subtitle_*` files) during the scroll-linked shrink — `assets/logo/` only has the placeholder text-based `logo.tsx`. The scroll-linked color-cycling mechanism is built (`Logo`'s `variant` prop, cycled in `proof-wall-hero.tsx`) against a text-color stand-in so swapping in the real SVGs is a `logo.tsx`-internals-only change once Bobby supplies the files.
- **Four Start Here / Row 2 photos still not supplied:** a parent using the Tech Safety Tool, a group session, an organization/nonprofit office, and an individual "parent" photo — `start-here.tsx` uses `PlaceholderPhoto` for all of these per `homepage-redesign-v3.md`'s own "Still needed" list.
- **`Bobby_Washburn_Site_Copy_redux_v1.docx`** (the doc `homepage-redesign-v3.md` and `services-parents-page-v1.md` both cite as the source of final page copy) was never added to the repo. The homepage hero copy, testimonials, and `/services` hero headline it specifies were recoverable because `homepage-redesign-v3.md` quoted them directly and the live `/services` page already matched — those are built. Anything gated purely behind the docx itself (About-Bobby copy changes, `/services/organizations` copy, new FAQ content) was left untouched rather than guessed at.

---

## File Map

| Area | Location |
|---|---|
| Routes | `app/` (App Router) |
| Reusable UI | `components/ui/` (shadcn) |
| Marketing sections | `components/marketing/` |
| Tools UI | `components/marketing/tools/tech-safety-tool/` |
| MDX components | `components/mdx/`, ADHD-specific in `components/mdx/adhd/` |
| Dashboard UI | `components/dashboard/` |
| Docs UI | `components/docs/` |
| CMS-managed content | `content/{testimonials,pain-points,awareness-modules,faq,footer,about,site-settings,research-bibles}/` |
| Hand-authored content | `content/docs/*.mdx`, `content/data/*.json` |
| Shared logic | `lib/` — see `lib/auth/`, `lib/db/`, `lib/github/`, `lib/google/`, `lib/research-bibles/`, `lib/tools/` |
| CMS schema | `keystatic.config.ts` |
| DB schema | `lib/db/schema.ts`, `drizzle/` migrations |
| Middleware | `proxy.ts` (this project's name for Next.js middleware) |

---
