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
| Hosting | Vercel |

**Do not use:** Framer (no-code builder — rejected, can't support future auth/booking/paywall), Rubix Documents (solo-maintained docs template — rejected, longevity risk), Aceternity UI / Magic UI Pro (paid tiers — cost-prohibitive, avoid), a full SaaS-starter boilerplate (unneeded billing/multi-tenancy plumbing — keep this lean).

## Theme Tokens (locked in)

```
--background: #0F1B2D        (deep navy)
--foreground: #F5F3EC        (off-white)
--card: #16253B              (lifted navy)
--border: #2A3A50
--muted-foreground: #B8AE96  (khaki-gray)

--primary: #1B3A5C           (navy)
--secondary: #C4B896         (khaki)
--accent: #FFFFFF            (white — use SPARINGLY: active states, highlights,
                               current TOC item, hover underlines. Never large blocks.)
```

Typography: Geist or Inter (headings + body), Geist Mono (code/data values).
Spacing: 4px base unit. Radius: 8px cards/panels, 6px buttons/inputs.

## Homepage — build with ShadcnSpace free blocks

| Section | ShadcnSpace category |
|---|---|
| Hero | Marketing → Hero Section |
| About / who it's for | Marketing → About Us Section |
| Services overview (courses, groups, 1-on-1s, CPRS training) | Marketing → Bento Grid or Feature Section |
| Credibility | Marketing → Testimonials |
| Subscribe | Marketing → Feature/CTA block, holding Substack embed |
| Book a call | Pages → Contact (repurposed) or Feature block → Cal.com embed |
| FAQ | Pages → FAQ |
| Footer | Marketing → Footer Section |
| (Future) Gated content login | Marketing → Login — reserved, not needed yet |

## Quick-Reference Dashboard (ShadcnSpace)

This is the standalone dashboard page — a separate surface from the Fumadocs-rendered deep-dive pages, one per topic.

| Need | ShadcnSpace category |
|---|---|
| Dashboard shell / panel layout | Dashboard UI → Dashboard Shell |
| Individual quick-reference cards | Dashboard UI → Widgets Component |
| Consensus meter / data visuals | Dashboard UI → Charts Component |
| "Where Experts Disagree" comparison tables | Dashboard UI → Datatable |
| Intake/contact forms | Dashboard UI → Forms |
| Empty/no-results states | Dashboard UI → Empty State |

**Do NOT use ShadcnSpace's Sidebars block** — Fumadocs already generates the docs nav; a second sidebar component duplicates that work. Ecommerce blocks (checkout, product listing) are also not needed yet — only relevant if a future storefront (e.g. CPRS Training Program) needs a real cart.

## Components usable inside Fumadocs MDX pages

Fumadocs remains the sole shell/nav/TOC framework for all deep-dive pages — that's unchanged. Deep-dive pages are Fumadocs' shell (auto-generated sidebar + TOC from content structure) with custom MDX components dropped into the body — image galleries, embedded video, interactive charts, comparison panels. Not just text.

Two of the Dashboard UI blocks above are dual-purpose: **Charts Component** and **Datatable** can optionally be embedded directly in a deep-dive page's MDX body when that page needs a data visualization or a "Where Experts Disagree"-style comparison table. This is a content choice per page, not a shell change — Fumadocs still owns navigation, TOC, and page layout; the chart/table is just another MDX component dropped into the body alongside galleries and video.

## Why these choices (context if questioned later)

- **Fumadocs over Framer**: Framer can't support future auth/booking/paywall needs. Fumadocs' headless core (fumadocs-core/fumadocs-ui split) can be fully reskinned without fighting the framework.
- **Fumadocs over Rubix Documents**: Rubix is a solo-maintained template (~138 stars) — longevity risk for a durable business asset. Fumadocs is actively maintained with a much larger community.
- **ShadcnSpace over Aceternity/Magic UI**: same shadcn/Tailwind/Motion foundation, but free tier (371+ blocks, 385+ components, 25+ pages) covers everything needed with no paid tier required. Built by an established team (WrapPixel), not a solo project.
- **Lean Next.js app over a full SaaS boilerplate**: avoids inheriting unused billing/multi-tenancy plumbing. Auth/paywall can be added later when actually needed.

## Next Steps

1. Scaffold Next.js + Fumadocs project
2. Set up shadcn/ui + theme tokens above
3. Pull ShadcnSpace free blocks per the homepage map above
4. Build custom MDX components for deep-dive pages (consensus meter, comparison panels)
5. Set up Cal.com event type + embed
6. Set up Substack embed on homepage
