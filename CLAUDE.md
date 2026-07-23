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
| Auth library | **Better Auth** |
| Auth UI components | **Better Auth UI** (daveyplate) |
| Hosting | Vercel |

## Auth & Data Layer (added July 23, 2026 — fills the account/progress gap)

**Status:** Locked in for this project. (Note: this project has never used Supabase — the reasoning below references it only because the user's own Supabase free tier, used on an unrelated app, was already exhausted, so Neon was chosen as a fully separate product/account rather than as a "migration.")

**Why this was needed:** ShadcnSpace is UI-only — blocks look right but have no backend. Sign up, sign in, account management, and lesson progress tracking all require an actual auth system and database, which wasn't decided in v2.

| Layer | Tool | Purpose |
| :---- | :---- | :---- |
| Database | **Neon** (serverless Postgres) | User records, subscription/role status, lesson progress tracking. Free tier: up to 100 projects, 0.5 GB storage per project, 100 compute-hours/project/month, no credit card, permanent (not a trial). |
| Auth library | **Better Auth** | Sign up, sign in, sessions, password reset, email verification. Open source, self-hosted in the Next.js app, stores users in our own Neon Postgres — no per-user vendor pricing. Neon offers a one-click Better Auth install when provisioning the database. |
| Auth UI components | **Better Auth UI** (daveyplate) | Prebuilt shadcn/ui components: Sign In, Sign Up, Forgot Password, Email Verification, Reset Password, and Account/Settings cards. MIT licensed, free. Installs via: `bunx shadcn@latest add https://better-auth-ui.com/r/auth.json` — drops straight into the existing shadcn setup, same visual language as ShadcnSpace, nothing to reconcile. |

### Why Neon (over other Postgres/backend options)
- Free tier is genuinely permanent, not a trial, and doesn't require a credit card.
- Pairs natively with Better Auth (Neon even offers one-click provisioning of it).
- Fully separate account from any other project's backend — no shared quota risk.

### Why Better Auth + Better Auth UI (over Clerk, Auth0, NextAuth)
- Clerk/Auth0: hosted, get expensive at scale — not a concern yet, but ownership matters more than free tier here.
- NextAuth (Auth.js): legacy pick for 2026, most teams only keep it if already using it.
- Better Auth: TypeScript-native, we own the user table in our own Neon Postgres, no vendor lock-in.
- Better Auth UI: the actual prebuilt component set that was missing — no need to hand-build sign-in/sign-up/account pages from scratch.

**Reconciling with "lean Next.js app over a full SaaS boilerplate" (see Why These Choices below):** that principle was about avoiding *unused* billing/multi-tenancy plumbing that comes bundled in SaaS starter repos. Auth + a database are not unused — sign-up, account management, and progress tracking are real, needed features for this product. Adding Neon + Better Auth individually keeps the lean-app principle intact; it avoids the boilerplate repo, not the auth requirement itself.

### What this unlocks (previously missing pieces — none of these exist yet)
- [ ] Sign up page — Better Auth UI SignUp component
- [ ] Sign in page — Better Auth UI SignIn component
- [ ] Account management page — Better Auth UI Settings Cards
- [ ] Forgot password / email verification flows — Better Auth UI prebuilt components
- [ ] Lesson/topic progress tracking — custom Neon Postgres table (`user_id`, `topic_id`, `last_viewed`, `completion_state`) — no template for this part, straightforward custom schema
- [ ] Role-based view (parent vs. practitioner) — field on the Better Auth user record set at signup/purchase

**Do not use:** Framer (no-code builder — rejected, can't support future auth/booking/paywall), Rubix Documents (solo-maintained docs template — rejected, longevity risk), Aceternity UI / Magic UI Pro (paid tiers — cost-prohibitive, avoid), a full SaaS-starter boilerplate (unneeded billing/multi-tenancy plumbing — keep this lean), Supabase (not used on this project).

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
| Dashboard shell / panel layout | Dashboard UI → Dashboard Shell | in progress |
| Individual quick-reference cards | Dashboard UI → Widgets Component | in progress |
| Consensus meter / data visuals | Dashboard UI → Charts Component | in progress |
| "Where Experts Disagree" comparison tables | Dashboard UI → Datatable | in progress |
| Intake/contact forms | Dashboard UI → Forms | not started |
| Empty/no-results states | Dashboard UI → Empty State | not started |

**Do NOT use ShadcnSpace's Sidebars block** — Fumadocs already generates the docs nav; a second sidebar component duplicates that work. Ecommerce blocks (checkout, product listing) are also not needed yet — only relevant if a future storefront (e.g. CPRS Training Program) needs a real cart.

Deep-dive pages are Fumadocs' shell (auto-generated sidebar + TOC from content structure) with custom MDX components dropped into the body — image galleries, embedded video, interactive charts, comparison panels. Not just text.

**Route:** `/dashboard/[topic]`, reading data from `content/data/[topic].json`. Dashboard Shell provides this route's own nav/layout since it lives outside Fumadocs entirely. First real topic: ADHD — `content/data/adhd.json` (dashboard data) + `content/docs/adhd.mdx` (deep-dive page), both built from the internal ADHD Research Bible + ADHD Parent Guide v2.

**Known open item in the ADHD data:** the Research Bible cites a 20–30% learning-disability co-occurrence rate; the Parent Guide cites ~46%. Flagged in `adhd.json` (`whereExpertsDisagree` + `openQuestionsForReview`) and in `adhd.mdx` (callout) — reconcile with the source before this goes live. Also missing: full citation for "Jensen et al., 2001" (depression co-occurrence rate), referenced inline but absent from the Research Bible's AMA reference list.

## Google Drive Integration (Plan)

**Status:** Planned — not yet built.
**Goal:** Edit a topic's Google Doc/Sheet → within minutes, the site reflects it. No manual export step, no runtime Drive fetches on every page load.

### Two content types sync differently

| Content type | Where it lives | Sync approach |
|---|---|---|
| Deep-dive prose (Fumadocs `.mdx`) | `content/docs/[topic].mdx` | Direct: Drive Doc → HTML export → MDX conversion → write file |
| Dashboard data (consensus meter, disagreement rows, stats) | `content/data/[topic].json` | Not a natural doc-to-JSON conversion — a Doc's prose doesn't map cleanly to structured rows |

**Decision (recommended):** Deep-dive content syncs from a Google **Doc**. Dashboard data syncs from a Google **Sheet** (one sheet per topic, or one sheet with a tab per topic) — much easier to parse reliably via the Sheets API than extracting structured tables out of Doc formatting.

### Architecture

Google Drive (source of truth)
│
├─ Research Bible Doc ──────► Docs API export (HTML) ──► MDX converter ──► content/docs/[topic].mdx
└─ Dashboard Data Sheet ─────► Sheets API (values.get) ──► JSON builder ──► content/data/[topic].json
│
▼
Vercel Cron (scheduled, e.g. every 15–30 min)
+ manual "Refresh" trigger (admin-only route)
│
▼
Write file → trigger ISR revalidation


### Auth (for the Drive service account — separate from user-facing Better Auth above)

- Service account with a JSON key, scoped read-only (`drive.readonly`, `spreadsheets.readonly`)
- Share each source Doc/Sheet with the service account's email — no OAuth consent flow needed since it's your own content
- Store the key as a Vercel environment variable, never committed to the repo

### Sync mechanism

- Serverless function (e.g. `/api/sync/[topic]`) does fetch → convert → write
- Trigger options, simplest first: (1) Vercel Cron on a schedule, (2) manual "Refresh this bible" button on an admin-only page hitting the same endpoint, (3) both
- After writing, call Next.js on-demand revalidation so changes show without a full redeploy

### Doc → topic mapping

`content/sync-config.json` maps each topic to its Drive IDs so new topics don't require code changes:
```json
{
  "adhd": {
    "docId": "<research-bible-doc-id>",
    "sheetId": "<dashboard-data-sheet-id>"
  }
}
```

### Error handling

- Failed fetch/conversion → log it, do **not** overwrite the existing file (stale-but-correct beats broken)
- Flag conversion mismatches (e.g. a Sheet row missing expected columns) rather than silently dropping data

### Phased build order

1. Service account + credentials; one Doc and one Sheet shared with it
2. Docs API → MDX converter, tested against the real ADHD doc
3. Sheets API → JSON builder, tested against a manually-built ADHD dashboard-data sheet
4. Manual "Refresh" endpoint wired to both
5. Vercel Cron scheduling once the manual path is reliable

### Open questions

1. Build the ADHD dashboard Sheet now (migrating `adhd.json`'s consensus/disagreement rows into sheet format), or keep hand-editing JSON for now and add Sheet sync later?
2. Service account key scoping — Vercel env var is standard, but consider a dedicated Drive folder with only synced docs shared to it, nothing else, for extra isolation.

## Why these choices (context if questioned later)

- **Fumadocs over Framer**: Framer can't support future auth/booking/paywall needs. Fumadocs' headless core (fumadocs-core/fumadocs-ui split) can be fully reskinned without fighting the framework.
- **Fumadocs over Rubix Documents**: Rubix is a solo-maintained template (~138 stars) — longevity risk for a durable business asset. Fumadocs is actively maintained with a much larger community.
- **ShadcnSpace over Aceternity/Magic UI**: same shadcn/Tailwind/Motion foundation, but free tier (371+ blocks, 385+ components, 25+ pages) covers everything needed with no paid tier required. Built by an established team (WrapPixel), not a solo project.
- **Lean Next.js app over a full SaaS boilerplate**: avoids inheriting *unused* billing/multi-tenancy plumbing bundled into SaaS starter repos. This does not mean "no auth" — auth and progress tracking are real product requirements, which is why Neon + Better Auth were added individually (see Auth & Data Layer) instead of adopting a full boilerplate.

## Next Steps

1. ~~Scaffold Next.js + Fumadocs project~~ — done, committed as initial scaffold
2. ~~Set up shadcn/ui + theme tokens above~~ — done
3. ~~Pull ShadcnSpace free blocks per the homepage map above~~ — done (real placeholders noted above still need swapping before launch)
4. Finish the Quick-Reference Dashboard route (`/dashboard/[topic]`) using ShadcnSpace Dashboard Shell + Widgets + Charts + Datatable, reading from `content/data/adhd.json` — in progress
5. Build remaining custom MDX components for deep-dive pages (consensus meter, comparison panels) not already covered by ShadcnSpace Dashboard UI blocks
6. Set up Cal.com event type + embed
7. Set up Substack embed on homepage
8. Build out Google Drive Integration per the plan above, starting with the service account + one test Doc/Sheet
9. Provision Neon Postgres database + run one-click Better Auth install
10. Install Better Auth UI components (`bunx shadcn@latest add https://better-auth-ui.com/r/auth.json`) and wire up Sign Up, Sign In, and Account Settings pages
11. Design and create the lesson/topic progress tracking table in Neon
12. Add role field (parent vs. practitioner) to the Better Auth user record, set at signup/purchase
13. Build Homepage's About Bobby page and remaining placeholder swaps