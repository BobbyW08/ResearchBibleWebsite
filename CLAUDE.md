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
| Subtitle | **Arvo** — real, final (free Google Font, no licensing issue). `arvo` font component and `--font-arvo` variable in `app/layout.tsx`, aliased to `--font-subtitle` / `font-subtitle` in `app/globals.css`. Used for the footer nav (see Homepage Structure) |
| Heading / Subheading / Body | Libre Franklin (real, final — `app/layout.tsx`'s `libreFranklin`, mapped to both `--font-heading` and `--font-sans`) |
| Quotes / testimonial text | Caveat (real, final — `font-quote` utility) |
| Red (primary accent) | `#9F0000` (`--primary` / `bg-primary` / `text-primary`) — confirmed from Bobby's Canva brand guideline as the real logo red, no longer template-scoped (corrected from the earlier `#6B0000`) |
| Near-black | `#111111` (`--foreground`, `--secondary`; also `--brand-black` / `bg-brand-black` for the literal near-black field, e.g. the footer and the Proof Wall hero) |
| Off-white | `#F8F8F8` (`--background`; also `--brand-offwhite` / `bg-brand-offwhite` for literal off-white surfaces, e.g. the Proof Wall's paper testimonial cards) |
| Gradient | Linear, 180°, `#111111` → `#9F0000` — `.bg-brand-gradient` utility class (`app/globals.css`). Secondary brand asset only — not used as the Proof Wall hero background, which is flat `--brand-black` so the header and hero read as one continuous surface (see Homepage Structure) |
| Dark-gray surface (inverted sections) | `#262626` (`--brand-charcoal` / `bg-brand-charcoal`) — used for sections that flip to a dark field, e.g. Services' "My Approach" |
| Bright red (headers on dark surfaces) | `#F0342F` (`--brand-red-bright` / `text-brand-red-bright`) — a brighter tint of the same hue as the primary red, used *only* for heading text on `bg-brand-charcoal`-style surfaces. The base `--brand-red` (`#9F0000`) still doesn't clear the ~3:1 WCAG floor for large/bold text against a dark-gray background — body copy on those surfaces uses `--brand-offwhite` instead, which already contrasts fine |

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
| `/about-bobby` | About Bobby page | Live, CMS-managed via the `about` singleton. The H1 ("About Bobby") and section structure are fixed, not CMS fields — see the `about` singleton notes in the Keystatic CMS section below. Hero is two-column (`lg:grid-cols-2`) — heading/subhead/credential badge/CTA left-aligned on the left, a large (`h-64`–`h-80` responsive) circular photo offset to the right; `photo` is a real Keystatic image field, falling back to a placeholder circle until Bobby uploads one. `/about` 301s here |
| `/services` | Services for Parents | Live, static content (not CMS-managed). Hero — one pinned section built around a looping path-walk video, "We Build"/"Your Path" converging over it (see Services Pages) — → "My Approach" (modalities statement, replaces the old Stabilize/Connect/Structure/Adapt phases grid) → "What I Offer" (1:1 Sessions, Weekly Group, Live Q&As, Cohorts) → closing CTA |
| `/services/organizations` | Services for Organizations & Nonprofits | Live, static content. Hero → "What I Offer" (Staff Training, Case Consultation, Parent Education Workshops, Reintegration Aftercare) → CTA. The CTA is a plain `mailto:` link, not the Cal.com intro-call flow used elsewhere — the org sales cycle is longer/more relationship-driven and there's no dedicated contact form or scheduling link yet |
| `/common-pain-points` | Pain Point index | Live — "Common situations" (10 pain-point cards) + "Big picture" (2 awareness-module cards). `/help` 301s here |
| `/common-pain-points/teen` | Teen pain-point page | Live — static route. **Temporarily renders `PainPointSidebarLayout`, same as the other 9 slugs**, for launch — not the newspaper-mosaic-grid rebuild (that component, `TeenRebellionRoute`, is unwired but untouched in the codebase; the plan is to swap it back in once that build is finished). Still takes precedence over the sibling `[slug]` route for this exact path; excluded from `[slug]`'s `generateStaticParams`. Reads the full `content/pain-points/teen.yaml` via `getHelpEntry('teen')` — all fields, not just `deepDive`/`related` |
| `/common-pain-points/[slug]` | Pain Point pages | Live for the other 9 slugs (see Pain Point Pages table) + 2 awareness modules (`modern`, `mentalhealth`), sidebar/card layout (`PainPointSidebarLayout`). `/help/[slug]` 301s here |
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

1. **Header** (`components/marketing/header.tsx`) — nav: About (`/about-bobby`) · Start Here (in-page anchor, `/#start-here`) · **Parents** (`/services` — renamed from "Services") · FAQs (in-page anchor, `/#faq`). No dropdown. Organizations is deliberately not a header item — reached via Start Here's Row 2 or the footer nav instead (see #6). The header's `Logo` lockup is always visible immediately on every page, including the homepage — there is no page-load intro or scroll-linked crossfade. On the homepage only (`logoAnimatesIn`), while the header is still transparent over the hero (not yet scrolled/"sticky") it renders light-on-dark (`onHeroField` in `header.tsx`) — including a `bg-brand-black` fill on the outer header bar itself, so it reads as one continuous surface with the hero rather than revealing the page's off-white body background behind it. Once scrolled into the sticky frosted-pill state, it reverts to normal dark-on-light. Every other page renders the header with no light-on-dark state (no hero to blend with). The inner nav container is `max-w-[110rem]`, the same width used by every other homepage section's container.
2. **Hero — "Proof Wall"** (`hero.tsx` + `proof-wall-hero.tsx`) — flat `bg-brand-black` field, no gradient (the gradient is a secondary brand asset, not used here), `max-w-[110rem]` outer container. No hero-resident logo and nothing scroll-linked — the persistent header lockup (see #1) is the only logo on this page. Cards live in their own grid column on each side of a fixed-width center column (`lg:grid-cols-[1fr_minmax(0,68rem)_1fr]`) so they can never overlap the headline text at any viewport — 2 left (top/bottom), 2 right (top/bottom), plus a 5th "top-center" card that floats above the grid in the open space between the nav and the headline (not part of either side column, given `pt-20`/`xl:pt-24` clearance on the headline column so the two never collide). All five cards fly into their tilted resting positions (sharply rotated, ±6–10°) via Motion's `whileInView` the first time the hero scrolls into view — a one-time mount-in, not scroll-progress-linked. Five tilted, sharp-cornered "paper" testimonial cards (off-white, tape accent, Caveat quote text, cursor-parallax) surround a central two-tone statement ("Parenting is **hard** for everyone." / "We shouldn't do it alone." — each sentence forced onto its own single line via `lg:whitespace-nowrap`, "hard" in `text-primary`), a regular-weight subhead, and a closing supporting line ("Father. Husband. Army veteran. Lived experience on every side of the system."), sourced live from the `testimonials` Keystatic collection (falls back to hardcoded copy if the collection is empty). CTA ("Tell Me What's Happening") is a sharp-cornered off-white button with a hard `6px` red offset shadow (`shadow-[6px_6px_0_0_var(--primary)]`) that tucks flush into the button on hover (shadow shrinks to 0 while the button translates by the same offset — a "pressed in" effect) — and links straight out to the Cal.com `intro-call` URL, not an internal page. Below `lg` (where the absolute-tilted five-card layout has nowhere to go), `MobileTestimonialCarousel` in `proof-wall-hero.tsx` replaces the old static vertical stack — a native horizontal scroll-snap strip (no library) with a slow auto-advance (every 4s, driven by `scrollTo({ left: next.offsetLeft, behavior: "smooth" })` rather than `scrollIntoView()` — the latter can scroll an ancestor, even the whole document, vertically if the carousel is near the viewport edge when the timer fires) that always re-derives "current card" from actual scroll position rather than a stale index, so it resumes correctly from wherever a user last swiped to, and pauses on pointer/touch-down. Respects `prefers-reduced-motion` (no auto-advance). **At `lg`/`xl` widths specifically** (below the `2xl` breakpoint), the side columns flanking the headline can still be narrower than a card, so a card's edge can bleed into the headline column — rather than chase pixel-perfect non-overlap at every width, cards rest at low opacity there (headline reads through/around them) and hovering one brings up a full-bleed dark scrim that dims everything else, including the headline, while that card rises above it at full opacity; mouse off, everything settles back. At `2xl`+ there's enough room that the overlap never happens, so cards sit at full opacity and the scrim never appears (`matchMedia` check). The opacity is set via Motion's `whileInView`/`whileHover` (inline style, which beats a Tailwind class in the cascade), and the headline's own wrapper needs `pointer-events-none` (not just its text nodes) since its `min-h-[560px]` flex box is hit-testable across its whole height even where there's no visible text.
   - **Logo Behavior:** the real BWPS SVG mark files live in `assets/logo/` — `BWPSLogoRed.svg` (icon) plus `BWPSSubtitleOffWhite.svg`/`BWPSSubtitleGrey.svg` (subtitle wordmark); these three are the only files in that folder and all three are wired into `assets/logo/logo.tsx`'s `Logo` component. `Logo` renders the icon always, and the subtitle wordmark from `sm` up only — the wordmark SVG is a ~16:1 aspect-ratio slug ("Bobby Washburn Parent Support") that renders 200px+ wide even at a small fixed height, which on a phone-width header collides with the mobile nav's hamburger trigger. Below `sm`, headers show icon-only; the wrapping `<Link>`'s `aria-label` (header.tsx / footer.tsx) still carries the full name for assistive tech either way. The subtitle color is `onDark`-aware — off-white while still blended with a dark field, grey once on the light sticky header pill or any other page's header. Note: a self-referencing `clip-path` on an SVG (a `<use>` pointing back at the very group it clips) silently renders as fully invisible when loaded through `next/image`/`<img>` (as opposed to inlined) — browsers can fail to resolve that self-reference outside a full document context. If a future icon re-export from the design tool introduces this pattern, watch for the icon rendering as a correctly-sized-but-blank `<img>` (compare `naturalWidth`/`naturalHeight` vs. visible content) — that's the signature of this bug, not a missing asset.
3. **Start Here** (`start-here.tsx`, async server component) — `max-w-[110rem]` container, two rows, not a flat tile grid:
   - **Row 1:** both tiles are taller than a flat grid would default to. Left third is a Tech Safety Tool tile (`/tech-safety`) — an autoplay/muted/loop `<video>` (`public/videos/tech-safety-tool.mp4`) instead of a photo, with the title/subtitle overlaid bottom-left on a translucent `bg-primary/70` scrim for legibility over the moving footage. Right two-thirds is a Common Pain Points box with a sticky, non-scrolling `bg-primary` header bar ("Common Pain Points" / "Find what's going on at your house.") and every pain-point topic from `getAllPainPoints()` in a plain `overflow-y-auto` list beneath it — scrolling with the cursor over the box moves the list via native browser scroll chaining (no custom JS), and releases back to page scroll automatically at the list's top/bottom edges; the same chaining applies to touch drags on mobile. No longer an auto-scrolling marquee — every pain-point link is still in the initial HTML (SEO requirement: no lazy-loading/fetch-on-interaction), it just doesn't auto-loop anymore. The "START HERE" eyebrow is `font-subtitle` (Arvo) at `text-sm`, and the "Where can you use support today?" heading is forced to one line via `md:whitespace-nowrap`.
   - **Row 2:** three equal-width panels touching with no gap — "Parents." → `/services#one-on-one`, "Groups." → `/services#weekly-group` (both `/services`, deep-linked to stable anchor IDs on the 1:1 Sessions / Weekly Group `OfferCard`s — see Services Pages), "Organizations." → `/services/organizations`. All three use warm-toned Unsplash stock photos (hotlinked via `images.unsplash.com`, added to `next.config.ts`'s `images.remotePatterns` — same hotlinking pattern as the tech-safety tool's Apple CDN screenshots) as temporary placeholders standing in for real photos of Bobby's own parents/groups/office, not yet supplied.
4. **Quick Credential** (`quick-credential.tsx`) — `max-w-[110rem]` container, real photo of Bobby (`assets/bobby-quick-credential.jpg`, static `next/image` import, `object-cover object-top` so the full head clears the frame instead of the default center-crop cutting into it) + 5 bulleted credential lines (CPRS/RI Board ID, current role, military background, training, work history), "Learn more" → `/about-bobby`.
5. **FAQ** — 6 Q&As, CPRS/peer-support framing (opens with "Is this therapy?"). Scroll target for the nav's "FAQs" anchor.
6. **Footer** (two-column, bymonolog.com pattern) — left column is a sitemap list, **not identical to the header nav**: About / Start Here / Parents / **Organizations** / FAQs (one item longer — Organizations is deliberately absent from the header). Set in `font-subtitle` (Arvo), with a bymonolog.com-style hover treatment (row fills solid `bg-brand-offwhite`, text inverts to `text-brand-black`, trailing `ArrowUpRight` icon appears) rather than a simple color-change link. Right column is Connect (Book a Call, Newsletter modal, contact email, LinkedIn/Substack/Instagram-disabled icons). Rendered on every page, not just the homepage.

---

## Services Pages (`/services`, `/services/organizations`)

Static content (not CMS-managed) — `app/services/page.tsx` and `app/services/organizations/page.tsx`, sharing `components/marketing/services/offer-card.tsx` for the pricing/offering cards.

- **`/services` (For Parents):** Hero (`components/marketing/services/wedged-hero-headline.tsx`, `WedgedHeroHeadline` → `PathsHeroSection` + `PathsHeroClosing`) — one pinned section, not a breakpoint-split layout. A tall spacer (`h-[340vh]`) with a `sticky top-0 h-dvh` inner pins the whole hero — eyebrow/headline/paragraph intro copy, the video, and the "Together" reveal — to the screen so the page never visibly jumps; the `bg-brand-black` field just keeps extending downward as the user scrolls, and `PathsHeroClosing` (closing paragraph + CTA, same dark field) only renders once the pin releases at the end. Scroll progress comes from `useScroll({ target: containerRef, offset: ["start start", "end end"] })`. A shared `sr-only` `<h1>We Build Your Path Together</h1>` is the real page heading; "We Build"/"Your Path"/"Together" are `aria-hidden` visual copies, all in **Arvo Bold** (`font-subtitle font-bold`) except "Together" (Caveat/`font-quote`). The `[video]` slot is a looping, muted, autoplaying `<video>` (`public/videos/paths-loop.mp4`) in a large `aspect-[3/4]` frame, capped generously (`max-h-[44rem] max-w-[94vw]`) and sized off available flex height (`flex-1 min-h-0` on its wrapper) so it fits any viewport without pushing content off-screen. "We Build" slides in from the left and "Your Path" from the right — both driven by `useTransform` off the same scroll-progress range as a percentage of each span's own width (not vh/px), so they arrive and meet at the horizontal center simultaneously; neither word ever moves vertically. The headline overlay is a sibling of the video box (not a child of it), so the slide-in isn't clipped by the video's own rounded-corner `overflow-hidden` — it travels, and visually overlaps, across the wider shared wrapper. Once they've met, a beat of dead scroll, then "Together" (brand red, large — `text-7xl`/`sm:text-8xl`/`lg:text-9xl font-bold`, pulled up toward the video via negative margin so it reads as sitting slightly higher/overlapping the video's bottom edge) fades and scales up from behind the composition; the video also shrinks slightly (~12%) at the same point. Reaches full size at `togetherEnd: 0.75` (`PHASES` constant) via `useTransform`'s default clamping — no separate lock state, no `position: fixed`, no portal. Two earlier rounds (see git history on this file/component) tried pinning "Together" to the viewport so it stayed on screen indefinitely past the pin release; Bobby's explicit call after seeing that live is that it should stay at its resting position **on the page**, not the screen — so it's deliberately just normal in-flow content once it settles: part of the sticky panel until the pin releases, then it scrolls away with the rest of the page exactly like everything else. → "My Approach" (eyebrow "My Approach" + H2 "A Blending of Evidence-Based Practices" + one paragraph naming Bobby's actual modalities, followed by `ModalityCards`, `components/marketing/services/modality-cards.tsx`). At `sm`+, a 4-card flip grid naming them individually: Peer Support Principles, Trauma-Informed Parenting, Brain-Based Parenting, DBT-Influenced Skill Building (`h-64`/`sm:h-72` — bumped from an initial `h-56`/`h-60` that clipped the DBT card's back-face text). Each card is a real `<button>` using Tailwind v4's 3D-transform utilities (`perspective-distant`, `transform-3d`, `rotate-y-180`, `backface-hidden`) to flip from a red/white-title front face to a white/red-title/gray-explanation back face on hover, focus, or tap — one-way, no unflip on mouse-leave/blur, `aria-label` itself carries the explanation once flipped. Below `sm`, a different component (`ModalityAccordionMobile`, same file) replaces the flip grid entirely: a vertical accordion with all four titles visible as collapsed rows (red/white, matching the flip card's front-face palette), tapping one expands it in place (one open at a time — opening a new row closes whichever was open, `faq-accordion.tsx`'s `grid-rows-[0fr]`/`[1fr]` transition pattern), and while a row is open, a left/right touch swipe (plain touch-delta detection, clamped at the first/last card) moves to the next/previous card's explanation without collapsing first. The swipe mechanic is a first-pass interpretation of an ambiguous request, not a finalized spec — flagged for Bobby to look at live. Card copy is also a first draft, not yet fully reviewed. Replaces the earlier Stabilize/Connect/Structure/Adapt phases grid, which is cut from this page entirely, not moved elsewhere. This section alone uses an **inverted palette** — `bg-brand-charcoal` dark-gray field, `text-brand-red-bright` eyebrow, off-white H2/body — see Brand System) → "What I Offer" — 1:1 Sessions is `available` with a direct Cal.com link; the other three (Weekly Group `available`, Live Q&As and Cohorts both `comingSoon`) all use the identical `{ kind: "interest-signup", source: ... }` mechanism, `components/marketing/services/interest-signup-widget.tsx` — click slides open an inline email input, a valid email reveals a Submit button, submitting POSTs to `/api/interest-signups` (inserts into the `interest_signups` table, unique on `email`+`source`) and folds back into the button with a persistent green checkmark, tracked client-side via `localStorage` since there's no account system to look it up server-side. Each card's `source` distinguishes it: Weekly Group `"weekly_group"` (label "Join the Group" — Bobby wants an email captured rather than linking straight to Cal.com, before a group actually starts), Live Q&As `"live_qa"`, Cohorts `"cohorts"` (both labeled "Join the waitlist"). Live Q&As and Cohorts previously used the generic `NewsletterDialog` (Substack-embed modal, `{ kind: "newsletter" }`) — switched to match Weekly Group's mechanism per Bobby's explicit ask that all three "capture interest the same way." `NewsletterDialog` is still used elsewhere on this page (the closing CTA's "Join the newsletter →") and site-wide (header, footer) — it isn't retired, just no longer used by any `OfferCard` on this page. → closing CTA. The 1:1 Sessions and Weekly Group `OfferCard`s carry stable anchor IDs (`#one-on-one`, `#weekly-group` — `OfferCardData.anchorId`, rendered onto the `Card` with `scroll-mt-24`) so the homepage Start Here Row 2 panels ("Parents." / "Groups.") can deep-link straight to them.
  - **Known issue, unresolved:** `public/videos/paths-loop.mp4` fails to decode in real Chrome (confirmed live, not just in a sandboxed test browser) — the `<video>` element never leaves `readyState 0`/`HAVE_NOTHING` and fires a `stalled` event, even when loaded as a full local `Blob` (ruling out a streaming/range-request cause). The file's `moov` atom exists but sits at the very end (non-"faststart" encoding) rather than the front; a known-good file in the same repo (`tech-safety-tool.mp4`) decodes correctly in the same browser, so this is specific to this file, not an environment/codec limitation. The frame currently renders as a plain black box. Needs Bobby to re-export/re-upload the video (ideally faststart-encoded) before this is verified working.
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

**All 10 slugs, including `teen`,** render through `PainPointSidebarLayout` (`components/marketing/pain-point-sidebar-layout.tsx`) — a sticky tag/headline header, then a two-column body starting at the same vertical position: a sticky left sidebar (on-page section nav highlighted via `IntersectionObserver`, a collapse toggle, a "Book a session"/"Join a parent group" CTA card, and "Go deeper" links) and a main column whose first block is the intro paragraph + optional single `exampleScenario` callout (age-agnostic — the old 2-5 / 6-9 / 10-12 / 13+ age-band switcher was removed), followed by off-white, rounded, soft-shadow section cards — "What's happening" (mechanism), "Why this usually makes it worse" (X-badge backfires list), "Try this week" (native `<details>` accordion), "When to get more support" (988/Crisis Text Line/211 on `burnout` and `mentalhealth`). This is an interim visual upgrade only — same YAML content as always, no route ball, no newspaper grid; a future pass gives these pages fresh panel-style treatment once Bobby authors new panel content per page. Components: `pain-point-sidebar-layout.tsx`, `awareness-module-detail.tsx`, `pain-point-support-callout.tsx`, `pain-point-content.tsx`, `pain-point-card.tsx`. (`pain-point-detail.tsx`, `pain-point-accordion.tsx`, and `pain-point-age-tabs.tsx` — the prior flat single-column layout and its age-band switcher — are retired to `graveyard/components-marketing/`, superseded by the sidebar layout and its single example scenario.)

**`teen` is a temporary exception to "same YAML, no new content"** — `app/common-pain-points/teen/page.tsx` renders `PainPointSidebarLayout` too (for launch), but reads every field off `content/pain-points/teen.yaml` (intro, `exampleScenario`, `whatHappening`, `backfires`, `tries`, `support`, `deepDive`/`related`) rather than just `deepDive`/`related`. The newspaper-mosaic-grid rebuild (`TeenRebellionRoute`, described in the Teen Page section below) still exists in the codebase and is the intended long-term page for this route — it's just not currently wired into `teen/page.tsx`. Its own hardcoded content in `lib/pain-points/teen-rebellion-panels.ts` is unused while this swap is in place.

---

## Teen Page — Newspaper Mosaic Grid (`TeenRebellionRoute`, not currently live)

**Not currently wired to `/common-pain-points/teen`** — that route temporarily renders `PainPointSidebarLayout` for launch (see Pain Point Pages above). This section describes `TeenRebellionRoute` and its supporting components, which still exist in the codebase, still build, and are the intended long-term page for this route — swap `app/common-pain-points/teen/page.tsx`'s JSX back to `<TeenRebellionRoute deepDive={entry.deepDive} related={entry.related} />` once Bobby is ready to pick this back up.

The one page on the site designed for a dark, editorial "newspaper grid" treatment — deliberately distinct from every other page's off-white identity. Not CMS-managed; not Fumadocs. Content lives in `lib/pain-points/teen-rebellion-panels.ts` as a hardcoded, typed discriminated union (`TeenPanel` — `feature | explanation | comparison | script-quiz | activity-picker | support-signals | cta`), not in Keystatic.

**8 panels, route order:** `teen-hates-me-hook` → `whats-happening` → `the-real-distinction` → `why-it-backfires` → `say-this-instead` → `try-this-week` → `when-to-get-support` → `pick-one-thing`.

**No route ball.** An earlier build had an animated "route ball" wayfinding dot that traveled between panels on scroll/hover; it's been dropped entirely (shelved, not deleted from history — `git log` has the route-ball-provider/route-ball/presets code if it ever comes back) in favor of a real CSS Grid mosaic plus two click interactions. Panel data no longer carries any ball/anchor fields.

**The mosaic grid:** `panel-grid.tsx` is a genuine CSS Grid — `grid-cols-1` below `md`, `md:grid-cols-4` at `md`+, `gap-1.5` on a `bg-brand-black` ground (the gap *is* the thick black gutter, no per-panel border/shadow needed). Each panel gets its column/row span from a `PanelSize` token (`feature` 2×2, `tall` 1×2, `wide` 2×1, `standard` 1×1, `banner` 4×1, set via `SIZE_CLASS` in `panel-shell.tsx`) applied only at `md:`, so mobile always collapses to a plain single column in source order. Auto-placement stays in default (sparse) flow, not `dense` — dense would backfill early gaps with later panels and risks pulling the closing CTA (08) or the safety banner (07) out of their intended trailing position. Two panels (`try-this-week` and `pick-one-thing`) add an explicit `md:col-start-2` to center a `wide`/`feature` tile with symmetric black gutters on both sides rather than sitting flush left with one lopsided gap — a couple of solid-black gap cells elsewhere in the grid are an accepted side effect of the sparse mosaic, not a bug.

**Two click interactions, no accordion anywhere on this page:**
- **Expand-to-read** (`interactions/expand-to-read.tsx`) — for panels whose full copy doesn't fit their tile (`teen-hates-me-hook`, `whats-happening`, `why-it-backfires`, `try-this-week`). Collapsed state is a clamped (`line-clamp-*`) preview with a visible "Read more" cue; clicking pops open a large, inset (not full-bleed) centered card that scales in from the clicked tile's own bounding rect. Close via the × control, clicking the scrim, or Escape (all three return focus to the trigger tile). Deliberately **not** a shared-`layoutId` Motion transition on the way out: with the trigger tile staying permanently mounted, testing showed a shared layoutId between it and the dialog left the exit animation's completion never firing, so the dialog stayed stuck in the DOM — invisible but still a `fixed inset-0`, `pointer-events: auto` layer, accumulating on every open. Opening still animates (scale/opacity pop from the trigger's rect); closing is an immediate, unanimated unmount instead — reliability over a nicety.
- **Rock-to-read** (`interactions/rock-to-read.tsx`) — for panels whose content is already fully visible at their tile size (`the-real-distinction`, `pick-one-thing`): a quick, small rotation wiggle (`useAnimate`) confirms the tap without changing size or position.
- `say-this-instead` keeps its own pre-existing tap-to-reveal (strike-through → replacement line) interaction, untouched, with a small rock layered onto each revealed line.

Both interactions respect `prefers-reduced-motion` (via Motion's `useReducedMotion`) — Expand still opens, just without the scale morph; Rock swaps the rotation for a brief opacity pulse.

**The safety panel rule, absolute:** `when-to-get-support` (the normal/caution/critical triage panel) has no `panelMotion` field at all on its `SupportSignalsPanel` type — a compile-time guarantee, not a null placeholder. Its renderer (`components/pain-points/teen-route/panels/support-signals-panel.tsx`) passes `noMotion` to `PanelShell`, which skips the `whileInView` entrance animation entirely. It has zero click interaction and is placed in the grid (as a `banner`) like any other panel.

**Architecture** (`components/pain-points/teen-route/`):
- `teen-rebellion-route.tsx` — orchestrator, renders `PinnedCtaPanel` + `PanelGrid` (switches on panel `type` to the matching renderer in `panels/`).
- `panel-shell.tsx` — shared per-panel wrapper: does the one-time `whileInView` reveal keyed by `panelMotion` (`panel-motion-variants.ts`, unrelated to the click interactions — this is the mount-in-view fade only), applies grid placement (`SIZE_CLASS`, keyed by `PanelSize`) and emphasis (`important` / `standard` / `caution`) classes.
- `panel-grid.tsx` — the mosaic grid container described above.
- `interactions/expand-to-read.tsx`, `interactions/rock-to-read.tsx` — the two click primitives described above, used by the relevant panel renderers in `panels/`.
- `pinned-cta-panel.tsx` — Book a Session (Cal.com popup embed, `cal-booking-trigger.tsx` — the **only** place on the site using Cal's popup pattern; every other Cal.com link site-wide stays a plain outbound `<Link target="_blank">`), Join the Newsletter (`newsletter-dialog.tsx`, reused as-is), Join the Group (`join-group-widget.tsx`), Go Deeper/Related (`DeeperLinks`, reused from `pain-point-content.tsx`), Download as PDF (`#9F0000` button, "Coming soon" for ~2s, no real PDF yet). Two states of one element via an `IntersectionObserver`'d sentinel: expanded in-flow panel on load → collapsed pinned badge once its sentinel scrolls out, and back, freely, on scroll direction — **not** a one-way lock like the Services page's "Together" section.
- `join-group-widget.tsx` — static "8 parents needed to start a group" copy, no live signup count (Bobby's call — a live-count version briefly existed here, backed by a `GET /api/interest-signups?source=` handler, but it required this page to read live per-request data, which turned out to be the actual cause of an intermittent 404 on this route — see the note on plain static generation in `app/common-pain-points/teen/page.tsx`). Same pill → email reveal → submit → persisted-checkmark pattern as `components/marketing/services/interest-signup-widget.tsx`, new `source` value (`teen_weekly_group`); submissions still land in the real `interest_signups` table via the existing `POST /api/interest-signups`.

**Known gaps, intentionally left open:** the pinned CTA panel's disclaimer copy/placement; whether Join the Group's `8`-parent framing is ever enforced as a real cap; no real PDF yet; the route ball is a possible future follow-on, not scheduled.

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
- `content/sync-config.json` — Drive-folder-ID mapping. `adhd` key serves the dormant `/api/refresh` pipeline (see Dormant Routes); `researchBibles.driveFolderId` serves the active Research Bible Ingestion Pipeline

---

## Research Bible Ingestion Pipeline

Keeps the internal research bibles current in the repo, upstream of the Content Pipeline above. Backs the `/research` and `/research/[slug]` routes.

**Flow:** the `research-bible-refinement` skill runs locally in Claude Desktop (unaware of git/GitHub/website infra by design), updates a bible + a Substack draft companion in a Drive-synced folder → a Drive webhook fires → `app/api/webhooks/drive-content-sync/route.ts` ingests the changed file, converts it to MDX matching the Keystatic schema, opens a GitHub PR with a diff description and the Substack draft attached → Vercel builds a preview deployment → Bobby reviews and merges → merge = publish, the changelog array renders on the live page.

Git PRs are the approval/versioning layer, not a custom UI. `pending_reviews` stays in the schema as an audit log only.

**Scope:** bible sync is built (see below). Pain Point / Awareness Module sync is a **separate, independent pipeline** — see "Parent Content Sync Pipeline" below, not a branch of this one. Full spec for this pipeline in `Research-Content-Pipeline-Handoff-v5.md` at repo root.

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
- `drive_content_sync_setup.md` (repo root) — Apps Script reference for the `researchBibles`-folder-only trigger. The only active Drive-sync setup doc in the repo — the dormant `/api/refresh` pipeline's setup material lives in `graveyard/`.

**Bible metadata rules:**
- `version` is site-owned, never parsed from source. Defaults to `"1.0"` on first sync, auto-increments on every subsequent sync (derived from changelog array length after the new entry is prepended).
- `tags` is site-owned, never sourced from Drive. Defaults to `[]` on first sync; Bobby assigns manually via `/keystatic`. Permanent once set — later syncs must never touch `tags`.

**How the parser matches the real Drive folder (folder ID `1DYDwFPEyWFmsHR-XKvviajypNlDQedT2`, set in `content/sync-config.json`'s `researchBibles.driveFolderId`):**
- Real bibles use an ATX-style H1 (`# Research Bible: <Title>`) — `extractTitle`/`extractBody` are written to match this format.
- The `research-bible-refinement` skill (Step 7) deliberately does not write a `**Refinement Log**` block into the body — it logs externally to `_WeeklyRefinementLog.md` and stamps a `_DDMMYY` date suffix on the filename instead. `extractChangelogEntry` reads that filename suffix as a fallback signal rather than assuming every sync is a fresh "initial sync."
- `RB_Anxiety_and_Depression.md` is malformed: its title was never styled as Heading&nbsp;1 in the source Google Doc, so it exports with no Markdown heading at all. It will 400 on `extractTitle` until Bobby fixes the heading style in the Doc — this is expected/intentional (title parsing stays strict), not a code bug.

**Still outstanding:**
- The frontmatter serializer's output hasn't been diffed against what a real hand-created `/keystatic` entry for this collection actually produces (blocked on Keystatic's GitHub App env vars — see Keystatic CMS section).
- The webhook route hasn't been exercised end-to-end against a live Drive file + real GitHub PAT (only unit-tested against fixtures so far).
- The Apps Script trigger (`drive_content_sync_setup.md`) is not installed yet — manual step for Bobby in script.google.com: paste the script, set `CONFIG.driveFolderId` to `1DYDwFPEyWFmsHR-XKvviajypNlDQedT2` and `CONFIG.webhookSecret` to match `WEBHOOK_SECRET`, then run `setup()` once.

---

## Parent Content Sync Pipeline

A second, independent Drive→GitHub-PR pipeline covering Pain Point Pages and Awareness Modules — same *pattern* as the Research Bible Ingestion Pipeline above (Drive doc → parse → validate → PR → Bobby reviews and merges), but its own code, its own endpoint, its own trigger model. The two pipelines share only generic, content-agnostic utility code (`lib/google/drive.ts`'s `fetchDriveFileContent`, `lib/github/contents.ts`'s REST client) — no parsing/serialization/validation logic, no webhook route, no Apps Script project, no secret. Full spec: `Research-Content-Pipeline-Handoff-v5.md` at repo root.

**Trigger model — the one thing that differs on purpose:** bibles auto-sync every 15 minutes (see above); this pipeline is **manual-only, forever, by design** — Bobby writes/edits this content in bursts and runs a sync when something's ready. There is no trigger installed for it, and none should be added without Bobby explicitly asking.

**Flow:** the `parent-content-builder` skill (Claude Desktop, outside this repo) writes `PainPoint_[Name].md` / `Module_[Name].md` files into the `Parent Facing Content` Drive folder (`content/sync-config.json`'s `parentFacingContent.driveFolderId`) → Bobby manually runs `syncParentFacingContent()` from its own standalone Apps Script project → `app/api/webhooks/parent-content-sync/route.ts` fetches, parses, validates, dedups, and opens a GitHub PR per changed file → Bobby reviews and merges.

**What's built:**
- `lib/parent-content/parse.ts` — parses the source `.md` file's frontmatter + section-header body (contract in the handoff doc §2) into typed fields, and runs the hard validation rules (bad `status` → silent skip, not an error; missing/non-boolean `crisis`, unapproved `icon`, placeholder markers, malformed internal hrefs, or a missing required section → `ParentContentParseError`, no PR opened). Exports `parsePainPointSource` / `parseAwarenessModuleSource`. Unit-tested: `node --experimental-strip-types --test lib/parent-content/parse.test.ts`.
- `lib/parent-content/frontmatter.ts` — a hand-rolled block-YAML reader/writer scoped to exactly the `painPoints`/`awarenessModules` collection shape (`format: { data: "yaml" }` — the whole file is the YAML, no frontmatter/body split like bibles). Unlike the bible serializer's JSON-string-scalar shortcut, this one reproduces Keystatic's own `>-` folded-scalar/block-sequence style, because its reader has to parse the real, pre-existing hand/Keystatic-authored files anyway (for the dedup guard and to preserve the site-owned `featured` flag) — verified to round-trip cleanly against all 10 live `content/pain-points/*.yaml` and both `content/awareness-modules/*.yaml` files. Unit-tested: `node --experimental-strip-types --test lib/parent-content/frontmatter.test.ts`. No YAML dependency added, same rule as the bible pipeline.
- `app/api/webhooks/parent-content-sync/route.ts` — the sync webhook. Own auth (`X-Webhook-Secret` timing-safe compare against `PARENT_CONTENT_WEBHOOK_SECRET` — a separate env var from the bible's `WEBHOOK_SECRET`) and own in-memory token-bucket rate limiter. Body: `{fileId, fileName}` — no `folderKey`, since this route only ever serves one folder; classifies by filename prefix (`PainPoint_*.md` / `Module_*.md`), anything else 400s. Dedup hashes the *parsed field set* (not the raw file) against the existing GitHub file's parsed fields, so whitespace-only Drive edits don't open pointless PRs. `featured` (pain points only) is site-owned — defaults `false` on first sync, preserved untouched on every resync. Reuses `GITHUB_CONTENT_SYNC_TOKEN` for the GitHub write.
- `parent_content_sync_setup.md` (repo root) — Apps Script reference for the standalone `syncParentFacingContent()` project. No `setup()` function and no trigger is ever installed — running the sync function by hand from the Apps Script editor *is* the trigger.

**Known, documented deviation from the handoff doc's literal wording:** the handoff's §3 validation rule says `deepDiveHref`/`related[].href` must start with `/docs/` or `/help/`. The real, live pain-point/module YAML files all link to each other via `/common-pain-points/<slug>` (the canonical current route — `/help/*` 301-redirects to it, it isn't what real content actually links to), plus one bare `/help` link to the index. Validation in `lib/parent-content/parse.ts` accepts `/docs/`, `/common-pain-points/`, and `/help` (bare or with a slug) instead of the handoff's literal wording, to match the site's real routes rather than rejecting every existing file's links.

**Still outstanding:**
- Not yet exercised end-to-end against a live Drive file + real GitHub PAT (only unit-tested against fixtures and round-tripped against the real committed YAML files so far).
- `PARENT_CONTENT_WEBHOOK_SECRET` is not yet set in Vercel Production — manual step for Bobby (see Manual Steps in the handoff doc).
- The standalone Apps Script project (`parent_content_sync_setup.md`) has not been created yet — manual step for Bobby.
- The generated YAML hasn't been round-tripped through a real `/keystatic` save (blocked on the same Keystatic GitHub App env vars as the bible pipeline — see Keystatic CMS section).
- Retiring the old topic-doc pipeline (`/api/refresh`, `/api/research-bible/notify-change`, the `pending_reviews` table, the `adhd` sync-config entry) is explicitly sequenced *after* this pipeline is proven against real content — not done yet, and the Dormant Routes table below is unchanged until it is.

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
- `painPoints` — collection, `content/pain-points/*.yaml`, 10 entries. Every field on `/common-pain-points/[slug]` for these is editable: tag, title, intro, `exampleScenario`, `whatHappening` (conditional block array), `backfires`, `tries`, `support`, `deepDive`, `related`, `featured`, icon (name string)
- `awarenessModules` — collection, `content/awareness-modules/*.yaml`, 2 entries. Same base fields as `painPoints` plus `sections`, no age-tabs/backfires/tries
- `researchBibles` — collection, `content/research-bibles/*/`, no entries yet — see Research Bible Ingestion Pipeline
- `faq` — singleton, `content/faq/data.yaml` (ordered `question`/`answer` array — singleton specifically for native drag-to-reorder, since order is narratively load-bearing)
- `footer` — singleton, `content/footer/data.yaml` (`tagline`, `contactEmail`, `copyrightText`). The sitemap/Connect link columns themselves are hardcoded in `footer.tsx` (a deliberately longer list than the header nav — see Homepage Structure) — not CMS-driven, since header/footer nav is a fixed design decision rather than free-form editable content.
- `about` — singleton, `content/about/data.yaml`. Fields: `heroSubhead`, `credentialBadge`, `photo` (real Keystatic image field — shows a placeholder box on the page until Bobby uploads one), `shortAboutParagraphs`, `cprsId`, `currentRole`, `training`, `prior`, `also`. The H1 ("About Bobby") is fixed copy, not a field. Bobby's full personal account is written directly into `shortAboutParagraphs`; there is no separate `personalDisclosure` field. The modalities statement only appears on `/services` ("My Approach"), not here.
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
- **`interest_signups`** (`email`, `source`, `created_at`, unique on `email`+`source`) — backs the Live Q&A "Show Interest" widget on `/services` (see Services Pages). Schema is in `lib/db/schema.ts`, migration is `drizzle/0002_minor_nextwave.sql`, and it's live — pushed to the real Neon database via `npm run db:push`, verified end-to-end against `/api/interest-signups`.
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

## Analytics

Two separate, unrelated analytics products are wired into `app/layout.tsx` — don't confuse them:
- **Vercel Analytics** (`@vercel/analytics/next`, `<Analytics />`) — Vercel's own first-party product.
- **Google Analytics 4** (measurement ID `G-5ZLMM0G7CV`) — the `gtag.js` snippet, loaded sitewide from the root layout via two `next/script` tags (`strategy="afterInteractive"`), so it initializes once per page load rather than remounting on client-side navigation. Added after Bobby's GA4 property reported "Your Google tag wasn't detected on your website" — the site had Vercel Analytics but no GA4 instrumentation at all.

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
- `parent-content-builder` — transforms research bibles into parent-facing content (bible → webpage copy → MDX/JSON). For Pain Points/Awareness Modules, produces `PainPoint_[Name].md` / `Module_[Name].md` files (frontmatter + section-header body, including `cardTeaser`, `tag`, `icon`, `crisis`, per-age-band scenarios) for the Parent Content Sync Pipeline; also has a Deep Dive Page format defined for a later phase, not yet ingested by any webhook
- `content-development-from-trends` — develops content packages from trend report topics
- `video-script-format` — produces video scripts in a consistent format
- `substack-voice-structure` — writes Substack articles in a consistent voice

---

## Open Items

- **Research Bible Ingestion Pipeline** is uncommitted, in-progress work — see its "Still outstanding" list for what's unconfirmed before treating it as production-ready.
- **Parent Content Sync Pipeline** is uncommitted, in-progress work — see its "Still outstanding" list. Notably: the standalone Apps Script project doesn't exist yet, and `PARENT_CONTENT_WEBHOOK_SECRET` isn't set in Vercel Production.
- **Substack subdomain** (`roughlyeducated`) needs Bobby's confirmation before the embed ships.
- **"Parent Education Workshops" naming** on `/services/organizations`: this is the $850/flat Group-Contracting engagement from the business plan. Worth confirming with Bobby that the name doesn't cause confusion with the separate (unbuilt, not on the site) $150–300/session "Paid Parent-Education Evenings" offering.
- **`/services/organizations`'s "Let's Talk" CTA** currently routes to a plain `mailto:` link as a placeholder — confirm with Bobby whether a dedicated contact form or scheduling link should replace it.
- **Start Here Row 2 photos are temporary stock, not real:** `start-here.tsx`'s Parents/Groups/Organizations panels show warm-toned Unsplash stock photos (hotlinked, see Homepage Structure #3) standing in for real photos of Bobby's own parents/groups/office — swap the three URL constants in `ROW_TWO_PANELS` once real photos exist. (Distinct from the Bobby headshots wired into Quick Credential/About — these Row 2 photos are meant to depict parents/scenarios, not Bobby.)
- **Several page sections are pending final copy from Bobby:** About-Bobby copy, `/services/organizations` copy, and FAQ content all stand as currently written until Bobby supplies replacement copy — nothing to build here until that arrives.

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
| Shared logic | `lib/` — see `lib/auth/`, `lib/db/`, `lib/github/`, `lib/google/`, `lib/research-bibles/`, `lib/parent-content/`, `lib/tools/` |
| CMS schema | `keystatic.config.ts` |
| DB schema | `lib/db/schema.ts`, `drizzle/` migrations |
| Middleware | `proxy.ts` (this project's name for Next.js middleware) |
| Retired/unused files, excluded from the app | `graveyard/` |

---
