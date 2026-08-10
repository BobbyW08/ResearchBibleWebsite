# CLAUDE.md — ResearchBibleWebsite
**Last updated:** 2026-08-06 (reconciled after the CPRS peer-support homepage rebuild + 7-task handoff)
**Repo:** BobbyW08/ResearchBibleWebsite · `main` branch
**Local path:** `C:\Users\robwa\Documents\Claude\ResearchBibleWebsite`
**Shell:** PowerShell
**Hosting:** Vercel (watches `main`)

---

## What This Project Is

**bobby-washburn.com** — a parenting education / peer-support site for Bobby Washburn's private practice. The site:
- Positions Bobby as a Certified Peer Recovery Specialist (CPRS) — peer support, not clinical treatment — open for business and credible
- Connects visitors to booking (Cal.com `/intro-call`), an on-page newsletter signup modal (Substack embed), and social (LinkedIn live; Instagram disabled/"coming soon" — see Social & Integrations)
- Provides free, ungated parent-facing content: Pain Point pages (triage) and Deep Dive pages (research-backed)
- No paywall. No subscription. No auth. No gates. Launch first, monetize later.

The content philosophy: research bibles are internal practitioner documents. Parent-facing content is derived from those bibles using a defined transformation process — warm peer-to-peer tone, 8th-grade reading level, no visible citations, practical examples paired with every concept.

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

Source: Fontpair "Agent" starter kit. Apply automatically to all parenting practice content (decks, handouts, Substack, web) without prompting.

**Note:** CLAUDE.md previously contained a dark navy theme (`#0F1B2D` background, khaki secondary). That is superseded by the light palette above. Do not use the old dark tokens.

---

## Tech Stack (locked — no new dependencies without approval)

- **Framework:** Next.js 15 (App Router)
- **Docs/content shell:** Fumadocs
- **UI components:** shadcn/ui + ShadcnSpace (free tier)
- **Animation:** Motion
- **Booking:** Cal.com — direct outbound links to the `intro-call` event (not embedded)
- **Newsletter:** Substack embed — inside an on-page `Dialog` (shadcn/base-ui) triggered from header, homepage Connect tile, footer, and `/about`. Not a full-page embed and not an outbound link anymore. Component: `components/marketing/newsletter-dialog.tsx`; subdomain constant in `lib/links.ts`.
- **CMS:** Keystatic — **built 2026-08-08, GitHub storage mode.** `keystatic.config.ts` at repo root manages `testimonials`, `painPoints`, `awarenessModules` (collections), plus `faq`/`footer`/`siteSettings`/`about` (singletons). Every editable string on the homepage, `/help`, `/help/[slug]`, and `/about` is now CMS-managed — see Keystatic CMS section for the full list and the two things still deliberately not wired up.
- **Database:** Neon (Postgres) — real and provisioned, all tables exist, `neon_auth` schema live
- **Auth:** Better Auth via Neon Managed — enabled and committed; reachable but unproven past sign-up (1 real user signed up, never completed onboarding)
- **Hosting:** Vercel

Do NOT use: Framer, Rubix Documents, Aceternity UI, Magic UI Pro (paid), Supabase, self-hosted better-auth, any SaaS boilerplate.

---

## Site Map

### Public Routes (no auth, no gate)

| Route | Purpose | Status |
|---|---|---|
| `/` | Homepage | Live — Hero → Pain Points → Connect → Meet Bobby → Testimonials → FAQ → Footer. No more content placeholders (bio, testimonials, and JSON-LD `jobTitle` are all real now) |
| `/about` | Standalone About Bobby page | Live — real bio/credentials (military → business → behavioral health path, CPRS ID, training list), **CMS-managed via the `about` singleton as of 2026-08-08**. One clearly-marked placeholder block remains (personal disclosure paragraph, editable as the `personalDisclosure` field — page shows an amber "Bobby — write this" callout automatically while it's blank) plus a `{/* TODO: photo */}` slot (not CMS-manageable, no image field wired up, no real photo exists yet) — both intentionally left for Bobby, not invented |
| `/help` | Pain Point index | Live — "Common situations" (10 pain-point cards) + "Big picture" (2 awareness-module cards) |
| `/help/[slug]` | Pain Point pages | Live for 10 slugs: `meltdowns`, `screens`, `wontlisten`, `anxiety`, `bedtime`, `homework`, `aggression`, `routines`, `teen`, `burnout` — plus 2 awareness modules, `modern` and `mentalhealth`. See Pain Point Pages section below — slugs differ from the original 11-item plan, reconciled against real content from `CPRS_Interactive_Site.html` |
| `/docs` | 36-topic categorized gallery (Stabilize / Connect / Structure / Adapt) | Live — all topic pages resolve |
| `/docs/adhd` | ADHD Deep Dive — flagship, full interactive components | Live |
| `/docs/[topic]` | 35 remaining deep dives — prose complete at webpage copy tier | Live as prose — no dashboard JSON yet |
| `/dashboard` | Quick-reference index | Live (redirects to /dashboard/adhd) |
| `/dashboard/adhd` | ADHD quick-reference dashboard | Live |
| `/dashboard/[topic]` | Future topic dashboards | Not built — needs JSON data per topic |
| `/tech-consequences` | Tech Safety & Consequence Setup — interactive parental-controls wizard (pick your phone + your child's devices, get tailored step-by-step setup instructions, a workarounds list, and a printable checklist for 11 device types + home Wi-Fi) | Live 2026-08-10 — standalone, unlisted (no header/footer nav link by design). Ported from `TechConsequences_ParentGuide.html` (repo root, kept untracked as reference, same as `CPRS_Interactive_Site.html`). Content is hardcoded in `lib/tech-consequences-data.ts` (not Keystatic — matches how `/docs` deep dives stay hand-authored), components in `components/marketing/tech-consequences/`. Screenshots hotlink Apple's CDN directly (`cdsassets.apple.com`) — not self-hosted, may break if Apple changes those URLs |

### CMS / Admin Routes

| Route | Purpose | Status |
|---|---|---|
| `/keystatic` | Keystatic CMS admin UI | Built 2026-08-08. Reachable but **not yet functional** — needs Bobby to create a GitHub App (walks you through it on first visit) and set 4 env vars (see Keystatic CMS section) before writes work |
| `/api/keystatic` | Keystatic API handler | Built 2026-08-08. Same GitHub App dependency as above |

### Dormant Routes (committed, reachable, not actively used)

| Route | Purpose | Notes |
|---|---|---|
| `/auth/[path]` | Sign in / sign up / reset | Committed (`ae51b02`). Reachable. 1 real signup, onboarding never completed — flow unproven end-to-end. Not needed for launch. |
| `/onboarding` | Account type gate | Committed. Not needed for launch. |
| `/account/[path]` | Account management | Committed. Not needed for launch. |
| `/api/refresh` | Google Drive content sync | Committed. Never run — `sync-config.json` has placeholder IDs, service account credentials blank. |
| `/api/research-bible/notify-change` | Change webhook | Committed. No Apps Script deployed to any Doc — never fired. |
| `/api/account/pending-reviews` | Review approval API | Committed. Table exists in DB but empty. |
| `/api/cascade/update-word-doc` | Word doc cascade | Not built — `app/api/cascade/` doesn't exist. Phase 3. |
| `/api/cascade/update-video-script` | Video script cascade | Not built. Phase 3. |

---

## Homepage Structure

Rebuilt around a CPRS peer-support positioning (superseding the earlier "research platform" framing). Section order in `app/page.tsx`:

1. **Header** — wordmark "Bobby Washburn" (`<md`) / "Bobby Washburn Parenting Support" (`md+`), two-tier responsive text in the same link. Nav: About · Pain Points · FAQ (no "Guides" item — removed from the header nav specifically; the footer still links to `/docs` as "Guides")
2. **Hero** — "You've tried everything... That's exactly where I come in." Primary CTA → `/help`, secondary → Cal.com `intro-call`
3. **Pain Points** — 3 featured cards (`meltdowns`, `wontlisten`, `routines`, via a `featured` checkbox on the Keystatic `painPoints` collection) + "See all pain points" → `/help`
4. **Connect** — 3 tiles: Newsletter (opens the signup modal), Instagram (disabled, "Coming soon"), Book a Call (→ Cal.com `intro-call`)
5. **Meet Bobby** — condensed personal narrative (ADHD/depression/substance use lived experience → CPRS), links to `/about`
6. **Testimonials** — full-bleed, auto-scrolling marquee, inverted navy colors (`bg-primary`/`text-primary-foreground`), 9 real quotes — CMS-managed via the Keystatic `testimonials` collection (`content/testimonials/*.yaml`) as of 2026-08-08; `lib/testimonials.ts` was deleted, it's fully superseded. Pauses on hover/focus, respects `prefers-reduced-motion` (falls back to a swipeable row)
7. **FAQ** — 6 Q&As, CPRS/peer-support framing (first question: "So this isn't therapy?")
8. **Footer** — Sitemap (About/Pain Points/Guides/FAQ) + Connect (Book a Call/Newsletter modal/LinkedIn/Instagram-disabled)

**Resolved placeholders (previously listed here as open):**
- Meet Bobby bio and About page bio — both real now (one disclosure paragraph + a photo slot remain on `/about`, intentionally left blank — see Site Map)
- Testimonials — 9 real, attributed quotes (anonymized) — **consent to publish still needs Bobby's confirmation, even anonymized; peer support + potentially DCYF-involved families is consent-sensitive**
- Person JSON-LD `jobTitle` → "Certified Peer Recovery Specialist (CPRS)"; Instagram removed from `sameAs`
- Lorem Ipsum credibility strip in `hero.tsx` — removed entirely (no more credibility-strip section on the homepage at all)

**Still open:**
- Substack subdomain (`lib/links.ts` → `SUBSTACK_SUBDOMAIN`, currently `"roughlyeducated"`, reused from the pre-existing outbound links) needs Bobby's confirmation before the *embed* ships — an iframe embed is more consequential than an outbound link was

---

## Pain Point Pages (`/help`, `/help/[slug]`)

**Built and live** as of 2026-08-06. Custom layout — NOT Fumadocs. Content ported from `CPRS_Interactive_Site.html` (a standalone prototype Bobby supplied; still sits untracked at the repo root — fully incorporated into the site now, safe to delete or keep as reference, Bobby's call).

**CMS-managed as of 2026-08-08.** Content lives in Keystatic: `painPoints` collection (`content/pain-points/*.yaml`, 10 entries) and `awarenessModules` collection (`content/awareness-modules/*.yaml`, 2 entries — a lighter-weight template: narrative sections instead of age-tabs/backfires/tries). `lib/pain-points.ts` now holds only the shared TypeScript types (`PainPointTopic`, `AwarenessModule`, `ContentBlock`, etc.) — the actual data and the `getHelpEntry(slug)`/`getAllPainPoints()`/`getFeaturedPainPoints()` lookups moved to `lib/pain-points-reader.ts` (async, reads via `lib/keystatic-reader.ts`). Icon fields store a name string (`Flame`, `Smartphone`, ...) resolved back to a `LucideIcon` component via `lib/pain-point-icons.ts` — keep both files' icon lists in sync if a new icon is ever needed. One known tradeoff: `painPoints` is a Keystatic *collection* (one YAML file per entry, for clean per-entry diffs), which means display order comes from the collection's file listing, not authored intent — the 3 featured homepage cards may not appear in exactly the original meltdowns/wontlisten/routines order. Not worth fixing unless it visibly matters; the `faq` singleton pattern was deliberately used elsewhere for order-sensitive content instead.

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

**Reconciliation note:** this slug list supersedes the 11-slug plan previously documented here (`meltdowns`, `screens`, `defiance`, `anxiety`, `sleep`, `homework`, `aggression`, `routines`, `teens`, `parent-burnout`, `modern-parenting`). The real content that shipped uses different slugs for some topics (`wontlisten` not `defiance`, `bedtime` not `sleep`, `teen`/`burnout` not `teens`/`parent-burnout`) and adds a `mentalhealth` context page that wasn't in the original plan. Don't reintroduce the old slugs without checking this table first.

Each pain-point page: tag/eyebrow, headline, intro, an interactive age-band scenario switcher (2-5 / 6-9 / 10-12 / 13+), "What's happening" (mechanism explanation), "Why this usually makes it worse" (backfires list), "Try this week" (accordion), "When to get more support" (with 988/Crisis Text Line/211 resources on `burnout` and `mentalhealth`), and "Go deeper" links (one real `/docs/[slug]` link + related `/help/[slug]` links). Components: `pain-point-detail.tsx`, `awareness-module-detail.tsx`, `pain-point-age-tabs.tsx`, `pain-point-accordion.tsx`, `pain-point-support-callout.tsx`, `pain-point-content.tsx`, `pain-point-card.tsx`.

---

## Deep Dive Topics (`/docs/[slug]`)

Four pillars. 36 topics total. Rendered via Fumadocs.
**All 36 topic pages resolve and are live.** ADHD is the flagship (888 lines, full interactive components). The other 35 are prose-complete at webpage copy tier (200–430 lines each, no stub markers) — genuinely finished prose, but no dashboard JSON, consensus meters, or comparison panel data yet.
Depth standard for flagship pages: 7,000–9,000 words, mechanism-level explanations required.

**🔴 Stabilize (9 topics)**
- What Do You Want
- De-Escalation
- Parent Emotional Regulation
- Structure & Routine
- Understanding Behavior
- **Understanding ADHD** ← content live (`content/docs/adhd.mdx`)
- Understanding Autism Spectrum Disorder
- Understanding Anxiety & Depression
- Trauma Informed Parenting

**🟡 Connect (8 topics)**
- Parental Self Care
- Connection Principles
- Values
- Parenting Styles
- Communication
- Family Dynamics
- Motivation
- Mindsets

**🟢 Structure (6 topics)**
- Applying Parenting Strategies
- Child Development
- Teen Autonomy and Identity – Gradual Release
- Principles of Effective Discipline
- Behavior-Reward-Consequence System
- Co-Parenting

**🔵 Adapt (13 topics)**
- Public Places Without Panic
- Supporting Aggressive Children
- Household Finance & Money Skills
- Healthy Bodies, Calm Homes – Sleep, Food, and Movement
- Big Transitions, Big Feelings
- Raising Resilient and Kind Kids
- Contribution and Chores
- Modern Digital and Social World
- Friendship and Social Coaching
- Parental Mental Health & Substance Abuse
- School Assistance
- High Risk Kids
- Modern Parenting

---

## Content Pipeline

**Source hierarchy (never break this order):**
Research Bible (Google Doc) → Webpage copy document (Google Doc) → MDX/JSON rendering files

Changes always flow downstream. Never modify rendering files without a corresponding upstream source update.

**Depth standard:** 7,000–9,000 words for parent-facing deep-dive pages. Mechanism-level explanations (not just symptom descriptions) required.

**Google Drive sync pipeline (dormant — code exists):**
Apps Script webhook → `/api/refresh` → MDX + JSON → ISR revalidation
Needs real service account + Doc/Sheet IDs to go live. Not needed for launch.

**Content files:**
- `content/docs/adhd.mdx` — ADHD deep dive page
- `content/data/adhd.json` — ADHD dashboard data
- `content/sync-config.json` — topic-to-Drive-ID mapping

---

## ADHD Components (built and integrated — flagship page)

Located at `components/mdx/adhd/` with barrel `index.ts`.
All 8 components are live in `content/docs/adhd.mdx` (888 lines).

- `DualPathwayDiagram` — live
- `DelayAversionSlider` — live
- `EvidenceTierToggle` — live
- `MythbusterCards` — live
- `PathwayComparison` — live (504-vs-IEP comparison)
- `GlossaryTooltip` — live
- `StrategyExplorer` — live
- `TemperamentTimeline` — live (developmental timeline)

**Open data issue:** ADHD co-occurrence data discrepancy — Research Bible shows 20–30% learning disability rate; Parent Guide shows ~46%. Flag as `flaggedForReview` in MDX, do not silently resolve before publication.
**Missing citation:** Jensen et al., 2001 — referenced but not sourced. Resolve before publication.

---

## Reusable MDX Components (`components/mdx/`)

Registered in `mdx-components.tsx`. Any `.mdx` file can use by tag name.

- `ConsensusMeter` — inline evidence-strength bars (lightweight CSS, not Recharts)
- `ComparisonPanel` — strong-claim/softer-claim two-column cards with flagged badge
- `ImageGallery` — responsive grid + click-to-expand lightbox
- `VideoEmbed` — responsive 16:9 iframe with click-to-load facade

---

## Dashboard (`/dashboard/[topic]`)

Own nav shell — outside Fumadocs entirely.
Components: `DashboardShell`, `StatCard`, `ConsensusChart` (Recharts), `DisagreementTable` (TanStack Table).
Data source: `content/data/[topic].json`.

---

## Keystatic CMS

**Built 2026-08-08** on the `feat/keystatic-cms` branch — GitHub storage mode (edits commit directly to `BobbyW08/ResearchBibleWebsite` via a GitHub App; Vercel's serverless filesystem is read-only in production, so local-storage mode wasn't viable).

**What's CMS-managed now:**
- `testimonials` — collection, one YAML file per entry at `content/testimonials/*.yaml` (`quote`, `attribution`)
- `painPoints` — collection, one YAML file per entry at `content/pain-points/*.yaml` (10 entries: `meltdowns`, `screens`, `wontlisten`, `anxiety`, `bedtime`, `homework`, `aggression`, `routines`, `teen`, `burnout`). Every field on `/help/[slug]` for these — tag, title, intro, all 4 age-band scenarios, `whatHappening` (a `p`/`stat`/`list` conditional block array), `backfires`, `tries`, `support`, `deepDive`, `related`, the `featured` flag, and the icon (stored as a name string, e.g. `Flame`, resolved to a `LucideIcon` via `lib/pain-point-icons.ts`) — is editable
- `awarenessModules` — collection, one YAML file per entry at `content/awareness-modules/*.yaml` (`modern`, `mentalhealth`). Same base fields as `painPoints` plus `sections` (heading + the same conditional block array), no age-tabs/backfires/tries
- `faq` — singleton at `content/faq/data.yaml` (ordered array of `question`/`answer`; a singleton rather than a collection specifically so the admin UI gives native drag-to-reorder — order is narratively load-bearing, it opens with "So this isn't therapy?")
- `footer` — singleton at `content/footer/data.yaml` (`tagline`, `contactEmail`, `copyrightText`, and `sections` → `links`, where each link's `linkType` is a conditional field — `url` / `newsletter` / `comingSoon` — that maps onto the existing `NewsletterDialog`/`ComingSoonTrigger`/plain-`<Link>` special-casing in `footer.tsx`)
- `about` — singleton at `content/about/data.yaml`. Every paragraph, heading, the 4 phases, the training list, and the CTA copy on `/about` is editable, including `personalDisclosure` — left blank in the seed content on purpose; the page shows an amber "Bobby — write this" callout automatically whenever that field is empty, same UX as the old hardcoded placeholder, just editable from Keystatic instead of JSX now. The `{/* TODO: photo */}` slot stays hardcoded — no image field exists yet, no real photo to put there
- `siteSettings` — singleton at `content/site-settings/data.yaml` (`substackSubdomain`, `calComUrl`) — **the singleton exists and holds real values, but nothing reads from it yet.** `lib/links.ts` and the 5 hardcoded Cal.com URLs (header, hero, connect, footer, about) were deliberately left unwired — rewiring them means converting several client components to fetch-and-pass-props, which was judged too large to bundle into "infra + easy wins." Next step if this matters: wire those 5 call sites + `lib/links.ts` to `reader.singletons.siteSettings.read()`.

All existing live content (9 testimonials, 6 FAQ items, both footer sections, 10 pain points, 2 awareness modules, the full About page bio) has been carried over verbatim into the seed YAML files, so nothing regressed to empty.

**Reader wiring:** `lib/keystatic-reader.ts` exports a shared `reader = createReader(process.cwd(), keystaticConfig)`. `testimonials.tsx` and `faq.tsx` are async Server Components that read content and pass it to client children (`testimonials-marquee.tsx`, `faq-accordion.tsx`) that keep only the interactive bits. `footer.tsx` and `about/page.tsx` are already Server Components, so they just swapped hardcoded data for reader calls. `pain-points.tsx` (the homepage teaser) is now async too, using the same `FadeInView` client wrapper pattern as `faq.tsx` to preserve its scroll-fade-in animation. `app/help/page.tsx` and `app/help/[slug]/page.tsx` (including `generateStaticParams`) are async and use `lib/pain-points-reader.ts` — this is where the Keystatic-shaped data (icon name strings, the `{discriminant, value}` conditional-field shape) gets transformed back into the pre-existing `PainPointTopic`/`AwarenessModule`/`ContentBlock` TypeScript shapes, so `pain-point-detail.tsx`, `awareness-module-detail.tsx`, `pain-point-content.tsx`, `pain-point-age-tabs.tsx`, `pain-point-accordion.tsx`, `pain-point-support-callout.tsx`, and `pain-point-card.tsx` needed **zero changes** — they still consume exactly the types they always did. `lib/pain-points.ts` now holds only those shared types, not data.

**GitHub App set up and OAuth login confirmed working, 2026-08-08.** App name `research-bible-website`, installed scoped to this one repo. Credentials are in `.env.local` (not committed). Note: this app was **not** created fresh through Keystatic's own setup wizard — it's the same GitHub App Vercel auto-created for its own "Connect to GitHub" project-linking flow (visible from its Homepage URL and two `connect.vercel.com` callback URLs, both harmless to leave in place). Repurposing it worked because its `Contents` repository permission already happened to be `Read and write` — the one permission Keystatic actually needs. If that permission is ever missing (e.g. Vercel resets it, or this needs replicating for another project), create a dedicated GitHub App instead of relying on that coincidence.

**Still to do:**
1. Add the same 4 env vars (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`) to the Vercel project dashboard (Production) — **without them, `npm run build` fails outright**, since the route handler validates them at build time, not just runtime
2. Add a production callback URL on the GitHub App once the domain is ready: `https://bobby-washburn.com/api/keystatic/github/oauth/callback` — Vercel preview URLs are skipped, they're unstable per-deployment
3. Re-seed content once for real through the admin UI (or trust the hand-authored YAML files already committed) to prove the GitHub OAuth → commit write path end-to-end

**Known gotcha #1, fixed 2026-08-08 — `/keystatic` renders blank in a real browser (dev only):** GitHub-storage-mode Keystatic wraps its admin UI in a `RedirectToLoopback` component that, per RFC 8252, hard-navigates `localhost` → `127.0.0.1` on first mount (required for the OAuth loopback flow) and renders nothing until that navigation completes. Next.js 16 added dev-server origin protection (`allowedDevOrigins`) that does not include `127.0.0.1` by default, so the redirected page's own dev assets (HMR socket, RSC chunks) got silently blocked — no console error, no server error, just a permanently blank page. This is a known, open upstream issue (Thinkmill/keystatic #1549). **Fixed** by adding `allowedDevOrigins: ["127.0.0.1"]` to `next.config.ts` — dev-only config, doesn't affect `next build`/production. If `/keystatic` ever goes blank again after an upgrade, check this first before assuming the integration code is wrong — it very likely isn't (confirmed against Keystatic's own compiled source and their current docs, both match this repo's implementation).

**Known gotcha #2, fixed 2026-08-08 — GitHub OAuth fails with "The redirect_uri is not associated with this application":** happens on first login attempt even with a correctly-created GitHub App, because gotcha #1's loopback redirect means the OAuth request is built from the `127.0.0.1` origin, not `localhost`. Keystatic's own server code (`@keystatic/core/dist/keystatic-core-api-generic.node.js`) hints at adding a portless `http://127.0.0.1/api/keystatic/github/oauth/callback` callback URL, but that alone was **not sufficient here** — GitHub Apps did not honor the RFC 8252 "any port for loopback" leniency in practice. **Fixed** by also adding the exact-port callback URL: `http://127.0.0.1:3000/api/keystatic/github/oauth/callback`. Register both — costs nothing, and the exact-port one is what actually resolved it. Also double-check the GitHub App settings were actually **saved** — that tripped this up once too.

**Deliberately not gated by `proxy.ts`:** `/keystatic` and `/api/keystatic` are reachable without a session cookie. `proxy.ts`'s Better Auth check protects a different identity system (end-user `profiles` accounts) — GitHub-mode Keystatic's actual write authorization is GitHub's own permission model (a write attempt from a non-collaborator 403s at the GitHub API regardless of reaching the page). Reachability without write access is Keystatic's documented design intent for GitHub mode.

**Still out of scope:** `content/docs/*.mdx` (37 Fumadocs deep-dive pages) and `content/data/*.json` (dashboard data) stay Google-Drive/hand-authored, matching the original intent below — these were never on the migration list. `/about`, `lib/pain-points.ts`'s content, testimonials, FAQ, and the footer are all CMS-managed as of 2026-08-08 (see "What's CMS-managed now" above) — the only remaining unwired piece is `siteSettings` (see its bullet above for why).

**Known limitation — `painPoints` display order isn't authored order.** Collections don't have native drag-reorder in Keystatic (only singletons/arrays do), so the 3 featured homepage cards and the `/help` grid render in whatever order the collection's file listing returns (alphabetical-ish by slug), not the original meltdowns → wontlisten → routines narrative order. Cosmetic, not a data-integrity issue — flagged in case reordering ever becomes a real ask, in which case the fix is restructuring `painPoints` as a singleton + `fields.array`, same pattern as `faq`.

If Keystatic gets extended further, the original intent still stands: manage blog posts, homepage copy, and the About Bobby page as a metadata layer, while topic page body content stays Google Drive–sourced.

---

## Social & Integrations

| Platform | Handle / URL | Status |
|---|---|---|
| LinkedIn | Bobby's personal account | Direct outbound link — live (header, footer) |
| Instagram | `bobby__washburn` | **Disabled, 2026-08-06.** Zero content lives there; Bobby doesn't want traffic going to an empty profile. Every instance site-wide (header, footer ×2, homepage Connect tile) now renders as a disabled trigger — `components/marketing/coming-soon-trigger.tsx` — with a "Coming soon" tooltip on hover/focus and a "Soon" text badge on touch devices. `aria-disabled="true"` + descriptive `aria-label`. Removed from the Person JSON-LD `sameAs` array in `app/layout.tsx`. Re-enable by swapping the `ComingSoonTrigger` back for a real `<a>` once there's content |
| Facebook | — | **Never actually implemented**, despite earlier versions of this doc listing it as a "live" footer link. No Facebook icon, link, or reference exists anywhere in the codebase. Remove from any future copy/marketing claims unless it gets genuinely built |
| Cal.com | `bobby-washburn/intro-call` | Direct outbound link — live. **Renamed from `/1on1` to `/intro-call` on 2026-08-06** (all 6 CTAs site-wide: header, hero, footer, connect tile, about page ×2). Confirmed live via WebFetch — resolves to "Introduction Call" |
| Substack | `roughlyeducated` | **No longer a direct outbound link as of 2026-08-06.** Every newsletter CTA site-wide (header, homepage Connect tile, footer ×2, about page) now opens an on-page signup modal (`components/marketing/newsletter-dialog.tsx`) containing a Substack embed iframe, with a small "Or read past issues on Substack →" link inside the modal that still goes outbound. Subdomain constant: `lib/links.ts` → `SUBSTACK_SUBDOMAIN`. **Needs Bobby's confirmation the subdomain is correct before the embed ships** — reused the pre-existing value since it was already live everywhere else, but an embed is more consequential than an outbound link was |

The "direct links only, never embeds" design decision noted in earlier versions of this doc has been explicitly reversed for Substack, per Bobby's own instruction. Cal.com and LinkedIn remain direct outbound links.

---

## PII Policy (locked)

**Parent profile:** Name, email, age, gender — no additional PII.
**Children:** Age and gender only — NO names, ever. No column for child name in any database table.
**Partner:** Age and gender only — NO name.

No COPPA exposure. No accidental PII collection for minors. This is a product design and legal decision — do not add name fields for children or partners under any circumstances.

---

## Auth & Database (committed and real — not needed for launch, not to be deleted)

Neon is real and provisioned. All code is committed (`ae51b02` and later). Do not delete.

- **Neon Postgres:** Real project, real database. `neon_auth` schema exists. Managed Better Auth genuinely enabled.
- **Tables in `public` schema (all exist, all empty):** `profiles`, `topic_progress`, `pending_reviews`
- **`profiles`:** `user_id`, `account_type ('parent'|'practitioner')`, age, gender. 1 real user signed up but `profiles` has 0 rows — that user never completed onboarding, so sign-up → onboarding → account flow is unproven end-to-end.
- **`topic_progress`:** `user_id`, `topic_id`, `last_viewed_at`, `completion_state` — empty, expected.
- **`pending_reviews`:** Exists. Empty. No Apps Script deployed yet — never fired.
- Route protection via `proxy.ts` middleware — scoped to `/account` and `/onboarding` only
- Social login intentionally disabled (CVE advisory on bundled better-auth OAuth)

**Vercel project link issue:** Local `.vercel/project.json` points at a stale/deleted project ID. Real Vercel project ID is `prj_2AgBQ4NhUvGsAij6A6N7YLnRovdQ`. GitHub auto-deploys work fine. Local `vercel env` and `vercel deploy` will fail until `vercel link` is re-run.

**To prove auth end-to-end later:** Sign up a test user → complete onboarding → verify `profiles` row created → verify `/account` is accessible.

---

## Housekeeping (flagged by Claude Code audit)

- **Vercel local link:** `.vercel/project.json` points at a stale project ID. Re-run `vercel link` and select `prj_2AgBQ4NhUvGsAij6A6N7YLnRovdQ` before using any local Vercel CLI commands.
- ~~Hero Lorem Ipsum~~ — resolved. `hero.tsx` was fully rewritten with real copy; the credibility-strip section no longer exists on the homepage at all.
- ~~Keystatic doesn't exist~~ — resolved 2026-08-08. Built on `feat/keystatic-cms` (see Keystatic CMS section). Still needs Bobby to create the GitHub App and set 4 env vars before `/keystatic` actually works, and `npm run build` will fail in any environment missing those vars.
- **Untracked folders at repo root** (not committed, not in `.gitignore` — clarify intent before next push): `E-Books/`, `Instruction Docs/`, `Parent Facing Content/`, `Planning Docs/`, `Quick Guides/`, `Research Bibles/`, `Website Copy/`, `CPRS_Interactive_Site.html`. These should either be gitignored or moved out of the repo root entirely — raw content does not belong in the repo. `CPRS_Interactive_Site.html` specifically has now been fully ported into `lib/pain-points.ts` (see Pain Point Pages) — safe to delete or archive elsewhere whenever Bobby confirms, nothing on the live site depends on the file itself anymore.

---

## Content Protection / SEO

- `robots.txt`: disallow `/docs/` and `/help/` for all non-Googlebot agents (blocks GPTBot, ClaudeBot, CCBot, PerplexityBot, etc.)
- Googlebot: full allow (needed for indexing)
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

The following were discussed and deliberately deferred post-launch:
- Subscription / paywall / Stripe
- Auth gates on content
- Onboarding intake flow
- Google Drive sync automation (manual MDX updates for now)
- Pending reviews / approval pipeline (Phase 2)
- Word doc / video script cascade (Phase 3)
- ADHD interactive components (integration pending)

Pain point pages are **no longer** on this deferred list — see Pain Point Pages above, live as of 2026-08-06.

---

## Skills in This Project

- `research-bible-builder` — builds comprehensive research bibles from source documents
- `parent-content-builder` — transforms research bibles into parent-facing content (3 stages: bible → webpage copy → MDX/JSON)
- `content-development-from-trends` — develops content packages from trend report topics
- `video-script-format` — produces video scripts in consistent format
- `substack-voice-structure` — writes Substack articles in consistent voice

