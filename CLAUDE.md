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
| Headline font | Space Grotesk |
| Body font | DM Sans |
| Background | `#F1F5FF` |
| Text | `#1E1527` |
| Primary | `#0F172A` |
| Accent | `#343F58` |
| Surface | `#FFFFFF` |
| Border | `#C6D4F3` |

Source: Fontpair "Agent" starter kit. Apply automatically to all parenting-practice content (decks, handouts, Substack, web) without prompting.

---

## Tech Stack (locked — no new dependencies without approval)

- **Framework:** Next.js 16 (App Router)
- **Docs/content shell:** Fumadocs
- **UI components:** shadcn/ui + ShadcnSpace (free tier)
- **Animation:** Motion
- **Booking:** Cal.com — direct outbound links to the `intro-call` event (not embedded)
- **Newsletter:** Substack embed inside an on-page `Dialog` (shadcn/base-ui), triggered from header, homepage Connect tile, footer, and `/about`. Component: `components/marketing/newsletter-dialog.tsx`; subdomain constant in `lib/links.ts`.
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
| `/` | Homepage | Live — Hero → Pain Points → Connect → Meet Bobby → Testimonials → FAQ → Footer |
| `/about` | About Bobby page | Live, CMS-managed via the `about` singleton. `personalDisclosure` field and a photo slot are intentionally blank for Bobby to fill in — the page shows an amber "Bobby — write this" callout while `personalDisclosure` is empty |
| `/help` | Pain Point index | Live — "Common situations" (10 pain-point cards) + "Big picture" (2 awareness-module cards) |
| `/help/[slug]` | Pain Point pages | Live for 10 slugs (see Pain Point Pages table) + 2 awareness modules (`modern`, `mentalhealth`) |
| `/docs` | 36-topic categorized gallery (Stabilize / Connect / Structure / Adapt) | Live — all topic pages resolve |
| `/docs/adhd` | ADHD Deep Dive — flagship, full interactive components | Live |
| `/docs/[topic]` | 35 remaining deep dives — prose complete at webpage copy tier | Live as prose — no dashboard JSON yet |
| `/dashboard` | Quick-reference index | Live, redirects to `/dashboard/adhd` |
| `/dashboard/adhd` | ADHD quick-reference dashboard | Live |
| `/dashboard/[topic]` | Future topic dashboards | Not built — needs JSON data per topic |
| `/tools` | Tools index | Live |
| `/tools/tech-safety-tool` | Tech Safety & Consequence Setup — interactive parental-controls wizard (pick your phone + your child's devices → tailored setup steps, workarounds list, printable checklist for 11 device types + home Wi-Fi) | Live, standalone, unlisted (no header/footer nav link by design). Data in `lib/tools/tech-safety-tool-data.ts`, components in `components/marketing/tools/tech-safety-tool/`. Screenshots hotlink Apple's CDN directly (`cdsassets.apple.com`) — not self-hosted, may break if Apple changes those URLs |
| `/research` | Research Bible Library index | Not in header/footer nav by design — reachable by direct URL only. No entries exist yet (see Research Bible Ingestion Pipeline) |
| `/research/[slug]` | Individual research bible, public | Same nav-hidden-by-design pattern. `generateMetadata` sets `robots: {index: !entry.noindex}` per bible. Changelog renders as a visible "Updates" section on the page |

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

1. **Header** — wordmark, two-tier responsive text. Nav: About · Pain Points · FAQ (footer separately links `/docs` as "Guides")
2. **Hero** — primary CTA → `/help`, secondary → Cal.com `intro-call`
3. **Pain Points** — 3 featured cards (via a `featured` checkbox on the Keystatic `painPoints` collection) + "See all pain points" → `/help`
4. **Connect** — 3 tiles: Newsletter (opens signup modal), Instagram (disabled, "Coming soon"), Book a Call (→ Cal.com `intro-call`)
5. **Meet Bobby** — condensed personal narrative, links to `/about`
6. **Testimonials** — full-bleed auto-scrolling marquee, inverted colors, 9 quotes, CMS-managed via `content/testimonials/*.yaml`. Pauses on hover/focus, respects `prefers-reduced-motion` (falls back to a swipeable row)
7. **FAQ** — 6 Q&As, CPRS/peer-support framing (opens with "So this isn't therapy?")
8. **Footer** — Sitemap (About/Pain Points/Guides/FAQ) + Connect (Book a Call/Newsletter modal/LinkedIn/Instagram-disabled)

---

## Pain Point Pages (`/help`, `/help/[slug]`)

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

**Scope:** bible sync only. Pain-point/module Drive sync does not exist and isn't planned this round — that YAML schema isn't finalized and `parent-content-builder` doesn't yet produce conforming files for it. When it's built, it needs its own webhook path and `folderKey`, not an extension of the bible flow (different schemas).

**What's built:**
- `keystatic.config.ts` → `researchBibles` collection, `content/research-bibles/*/index.mdx`, `format: { contentField: "body" }` (frontmatter + `---` + MDX body in one file). Fields: `slugName`, `title`, `version`, `lastUpdated`, `tags`, `noindex`, `changelog` (array of `date`/`summary`/`prUrl`), `body`. No entries exist yet.
- `lib/research-bibles/parse.ts` — `extractTitle`, `extractChangelogEntry`, `stripPandocArtifacts`, `extractBody`, `computeVersion`. Unit-tested (`parse.test.ts`) via Node's built-in test runner: `node --experimental-strip-types --test lib/research-bibles/parse.test.ts`.
- `lib/research-bibles/frontmatter.ts` — hand-rolled YAML frontmatter serializer/parser scoped to this collection's schema only (no general YAML dependency added).
- `lib/research-bibles/render-mdx.tsx` — renders a bible's `body` as GFM Markdown for `/research/[slug]` via `remark-parse`/`remark-rehype`/`hast-util-to-jsx-runtime` (transitive deps of `fumadocs-mdx`, not declared directly in `package.json`).
- `lib/research-bibles-reader.ts` — `getAllResearchBibles()` / `getResearchBible(slug)`, same pattern as `lib/pain-points-reader.ts`.
- `lib/google/drive.ts` — `fetchDriveFileContent(fileId)` via direct `fetch` + `lib/google/serviceAccountAuth.ts` (no `googleapis` package).
- `lib/github/contents.ts` — hand-rolled GitHub REST client: `getDefaultBranchSha`, `createBranch`, `getFileSha`, `getFileContent`, `putFile`, `updateFile`, `openPullRequest`. Auth via `GITHUB_CONTENT_SYNC_TOKEN` (separate from Keystatic's own `KEYSTATIC_GITHUB_*` app credentials).
- `app/api/webhooks/drive-content-sync/route.ts` — the sync webhook. Auth: `X-Webhook-Secret` header, timing-safe compare against `WEBHOOK_SECRET` (same env var as `/api/refresh`). Body: `{fileId, fileName, folderKey}` — only `folderKey === "researchBibles"` + filename matching `RB_*.md` is handled, anything else 400s. Flow: fetch from Drive → title extraction (typed `BibleParseError` on failure) → changelog-entry extraction (in-body Refinement Log block if present; otherwise falls back to the `_DDMMYY` date suffix on `fileName`; otherwise today's date with a genuine "initial sync" summary) → Pandoc-artifact strip → body extraction → sha256 dedup guard against the live GitHub file (no-op 200 if unchanged) → version computed server-side from changelog length → branch `content-sync/bible-<slug>-<date>` → commit → open PR → follow-up commit filling the real PR URL into the changelog entry. Has an in-memory token-bucket rate limiter (module-level state, resets on cold start — acceptable for a low-traffic internal webhook, not a true distributed limiter).
- `app/robots.ts` — disallows `/docs/` and `/help/` for all agents except Googlebot. `/research/` is intentionally not disallowed — visibility is controlled per-entry via `noindex`.
- `app/sitemap.ts` — static routes + `/docs/[slug]` (via Fumadocs' `source.generateParams()`) + `/help/[slug]` + `/research/[slug]` for every non-`noindex` bible.
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

GitHub storage mode — edits commit directly to `BobbyW08/ResearchBibleWebsite` via a GitHub App (Vercel's serverless filesystem is read-only in production, so local-storage mode isn't viable).

**CMS-managed:**
- `testimonials` — collection, `content/testimonials/*.yaml` (`quote`, `attribution`)
- `painPoints` — collection, `content/pain-points/*.yaml`, 10 entries. Every field on `/help/[slug]` for these is editable: tag, title, intro, all 4 age-band scenarios, `whatHappening` (conditional block array), `backfires`, `tries`, `support`, `deepDive`, `related`, `featured`, icon (name string)
- `awarenessModules` — collection, `content/awareness-modules/*.yaml`, 2 entries. Same base fields as `painPoints` plus `sections`, no age-tabs/backfires/tries
- `researchBibles` — collection, `content/research-bibles/*/`, no entries yet — see Research Bible Ingestion Pipeline
- `faq` — singleton, `content/faq/data.yaml` (ordered `question`/`answer` array — singleton specifically for native drag-to-reorder, since order is narratively load-bearing)
- `footer` — singleton, `content/footer/data.yaml` (`tagline`, `contactEmail`, `copyrightText`, `sections` → `links`, each link's `linkType` conditional on `url`/`newsletter`/`comingSoon`, mapped in `footer.tsx`)
- `about` — singleton, `content/about/data.yaml`. Every paragraph/heading/phase/training item/CTA is editable, including `personalDisclosure` (intentionally blank — see Site Map). Photo slot is hardcoded, no image field exists
- `siteSettings` — singleton, `content/site-settings/data.yaml` (`substackSubdomain`, `calComUrl`) — **holds real values but nothing reads from it yet.** `lib/links.ts` and the 5 hardcoded Cal.com URLs (header, hero, connect, footer, about) are not wired to it. Wiring means converting those client components to fetch-and-pass-props.

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
| Cal.com | `bobby-washburn/intro-call` | Direct outbound link — live (all 6 CTAs site-wide: header, hero, footer, connect tile, about page ×2) |
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

- `app/robots.ts`: disallows `/docs/` and `/help/` for all non-Googlebot agents (blocks GPTBot, ClaudeBot, CCBot, PerplexityBot, etc.); Googlebot fully allowed. `/research/` is not disallowed — visibility is per-entry via each bible's `noindex` field.
- `app/sitemap.ts`: static routes + `/docs/[slug]` + `/help/[slug]` + `/research/[slug]` (non-`noindex` only)
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

- **`parent-content-builder` skill fields:** needs `cardTeaser`, `tag`, `icon`, `crisis`, per-age-band scenario content added. Confirm where Claude Code can actually see/edit the live skill definition before editing — don't assume the location.
- **`painPoints`/`awarenessModules` missing fields:** no `cardTeaser` or `crisis` (boolean) field yet — needed once `parent-content-builder` produces them.
- **`files.zip`** sits at the repo root and is git-tracked — confirm with Bobby whether it should be removed.
- **`CPRS_Interactive_Site.html`, `TechConsequences_ParentGuide.html`, `adhd-prototype.html`, `tech_transitions_per_parenting_generation.html`** sit untracked at the repo root as prototype/reference files. Nothing in the live site depends on them — confirm with Bobby whether to delete or relocate.
- **Research Bible Ingestion Pipeline** is uncommitted, in-progress work — see its Verification section for exactly what's unconfirmed before treating it as production-ready.
- **Testimonial publish consent** needs Bobby's explicit confirmation (anonymized, but consent-sensitive population).
- **Substack subdomain** (`roughlyeducated`) needs Bobby's confirmation before the embed ships.

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
