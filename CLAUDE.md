# CLAUDE.md — ResearchBibleWebsite
**Last updated:** 2026-08-03 (reconciled against Claude Code audit)
**Repo:** BobbyW08/ResearchBibleWebsite · `master` branch
**Local path:** `C:\Users\robwa\Documents\Claude\ResearchBibleWebsite`
**Shell:** PowerShell
**Hosting:** Vercel (watches `main` — force-push alignment required with `master`)

---

## What This Project Is

**bobby-washburn.com** — a parenting education website for Bobby Washburn's private practice. The site:
- Establishes Bobby as open for business and credible
- Connects visitors to booking (Cal.com), newsletter (Substack), and social (LinkedIn, Facebook, Instagram)
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
- **Booking:** Cal.com embed
- **Newsletter:** Substack embed
- **CMS:** Keystatic (metadata layer; topic body content stays Google Drive–sourced)
- **Database:** Neon (Postgres) — real and provisioned, all tables exist, `neon_auth` schema live
- **Auth:** Better Auth via Neon Managed — enabled and committed; reachable but unproven past sign-up (1 real user signed up, never completed onboarding)
- **Hosting:** Vercel

Do NOT use: Framer, Rubix Documents, Aceternity UI, Magic UI Pro (paid), Supabase, self-hosted better-auth, any SaaS boilerplate.

---

## Site Map

### Public Routes (no auth, no gate)

| Route | Purpose | Status |
|---|---|---|
| `/` | Homepage | Live — some content placeholders remain (bio, testimonials, JSON-LD jobTitle) |
| `/about` | Standalone About Bobby page | Live — bio/credential placeholders remain |
| `/help/[slug]` | Pain Point pages (11 total) | Not built — template not yet designed |
| `/docs` | 36-topic categorized gallery (Stabilize / Connect / Structure / Adapt) | Live — all topic pages resolve |
| `/docs/adhd` | ADHD Deep Dive — flagship, full interactive components | Live |
| `/docs/[topic]` | 35 remaining deep dives — prose complete at webpage copy tier | Live as prose — no dashboard JSON yet |
| `/dashboard` | Quick-reference index | Live (redirects to /dashboard/adhd) |
| `/dashboard/adhd` | ADHD quick-reference dashboard | Live |
| `/dashboard/[topic]` | Future topic dashboards | Not built — needs JSON data per topic |

### CMS / Admin Routes

| Route | Purpose | Status |
|---|---|---|
| `/keystatic` | Keystatic CMS admin UI | Config complete |
| `/api/keystatic` | Keystatic API handler | Config complete |

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

Long-form landing page. Sections in order:

1. Hero / Banner — photo of Bobby, headline, who this is for
2. Credentials / trust bar
3. Cards for Immediate Help (3 featured cards linking to /help/[slug])
4. Service Offerings (1-on-1, groups, CPRS training, etc.)
5. Testimonials
6. Deeper Content (links to /docs — positioned as free resource)
7. About Bobby
8. Book a Meeting (Cal.com embed)
9. Subscribe (Substack embed)
10. Contact
11. Footer — social links (LinkedIn, Facebook, Instagram), email

**Known placeholders still to replace before launch:**
- About Bobby bio, credentials, years of experience (bracketed placeholders in both `/` and `/about`)
- Real testimonial quote + name
- Person JSON-LD `jobTitle` field
- Cal.com link: `bobby-washburn/1on1` — implemented as direct outbound link (not embedded widget — by design)
- Substack link: `roughlyeducated` — implemented as direct outbound link (not embedded widget — by design)
- Social links: LinkedIn, Facebook, Instagram — implemented as direct outbound links (footer + nav)
- Lorem Ipsum credibility strip in `hero.tsx` — to be removed (identified by Claude Code, not yet committed)

---

## Pain Point Pages (`/help/[slug]`)

11 total. Custom layout — NOT Fumadocs. Template to be designed.
Each card appears on the homepage and links to its `/help/[slug]` page.

| Slug | Topic |
|---|---|
| `/help/meltdowns` | Meltdowns / Tantrums |
| `/help/screens` | What Do I Do About Screens? |
| `/help/defiance` | Won't Listen / Defiance |
| `/help/anxiety` | Anxiety / Worry / School Refusal |
| `/help/sleep` | Sleep / Bedtime Battles |
| `/help/homework` | Homework Wars |
| `/help/aggression` | Aggression (Hitting, Biting, Throwing) |
| `/help/routines` | Routines |
| `/help/teens` | Teen Rebellion / Teen Brain |
| `/help/parent-burnout` | Parent Burnout |
| `/help/modern-parenting` | Modern Parenting |

Each page: ~600–900 words, triage format, links to relevant Deep Dive topics.
Template not yet built — needs design pass before any pages are written.

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

Four config files created: `keystatic.config.ts`, admin UI component, layout, API route handler.
Manages: blog posts, testimonials, homepage copy, FAQ, footer, About Bobby page.
Topic page body content stays Google Drive–sourced. Keystatic manages companion metadata (SEO, featured images, CTAs) as a hybrid layer.

---

## Social & Integrations

| Platform | Handle / URL | Status |
|---|---|---|
| LinkedIn | Bobby's personal account | Direct link in footer — live |
| Facebook | Bobby's personal account | Direct link in footer — live |
| Instagram | Bobby's personal account | Direct link in footer — live |
| Cal.com | `bobby-washburn/1on1` | Direct outbound link — live (not an embedded widget, by design) |
| Substack | `roughlyeducated` | Direct outbound link — live (not an embedded widget, by design) |

All outbound links are implemented as direct links, not embedded widgets. This is a deliberate design decision — do not convert to embeds without explicit approval.

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
- **Hero Lorem Ipsum:** A leftover Lorem Ipsum credibility strip exists in `hero.tsx`. Remove before launch — not yet committed.
- **Untracked folders at repo root** (not committed, not in `.gitignore` — clarify intent before next push): `E-Books/`, `Instruction Docs/`, `Parent Facing Content/`, `Planning Docs/`, `Quick Guides/`, `Research Bibles/`, `Website Copy/`, `CPRS_Interactive_Site.html`. These should either be gitignored or moved out of the repo root entirely — raw content does not belong in the repo.

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
- Pain point page template (needs design pass first)
- ADHD interactive components (integration pending)

---

## Skills in This Project

- `research-bible-builder` — builds comprehensive research bibles from source documents
- `parent-content-builder` — transforms research bibles into parent-facing content (3 stages: bible → webpage copy → MDX/JSON)
- `content-development-from-trends` — develops content packages from trend report topics
- `video-script-format` — produces video scripts in consistent format
- `substack-voice-structure` — writes Substack articles in consistent voice

