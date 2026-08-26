# Claude Code Handoff — Full Site Redesign Build + Preview Deploy
**This is the definitive build brief. It supersedes `homepage-redesign-v2.md`, `about-page-copy-v2.md`, `services-parents-page-v1.md`, and the earlier `claude-code-handoff-homepage-redesign.md` — those are left in place for history, not deleted, but do not build from them where they conflict with this doc or the two attached source files.**

**Source of truth for this build:**
- **Content (all final page copy):** `Bobby_Washburn_Site_Copy_redux_v1.docx` — Bobby's edited, approved version. Use this wording exactly, not any earlier draft.
- **Structure/technical spec:** `homepage-redesign-v3.md` — brand system, logo behavior, nav, URL map, sitemap.
- This handoff doc adds: reconciliation against CLAUDE.md, flags on a few discrepancies between the two source docs, real build tasks the content implies, and the deploy step.

---

## THE TASK

1. Implement the full redesign described below across all affected pages.
2. Update CLAUDE.md's affected sections once the build is verified working (checklist at the end).
3. Push to a feature branch and let Vercel generate a **preview deployment** — do not merge to main. Share the preview URL back for Bobby's review.

---

## FLAGS — worth a second look, not blockers

1. **Employer name removed from public copy.** Earlier drafts named "Tides Family Services / Community Care Alliance" in the credentials/bio. The final `_redux_v1` copy drops this everywhere — both the homepage credential bullets and the About page just say "Peer Parent Consultant" with no employer named. Treating this as intentional since it's consistent across both places in Bobby's own edit, but flagging in case it was an oversight rather than a choice.
2. **"Parent Education Workshops" naming, on the Organizations page.** The business plan has two distinct services: "Group-Contracting Engagements" ($850/flat, general contracted group work with orgs) and "Paid Parent-Education Evenings" (a different, $150–300/session school-talk honorarium). The final copy labels the $850 Group-Contracting service as "Parent Education Workshops" — worth double-checking this naming choice doesn't cause confusion with the actual (unbuilt, not on the site) Parent-Education-Evenings offering from the business plan.
3. **About page hero simplified.** Final copy drops the "You don't need fixing. You need someone who's been there." headline and the "Educate · Motivate · Evoke · Empathize" framework strip entirely — H1 is now plain "About Bobby." Also drops the "There's an Order to This" four-phase framework section from the About page entirely (that content now lives only on the Services/Parents page, as "Start Walking Your Path" — don't duplicate it on both pages).
4. **Live Q&A waitlist mechanism is new and unscoped.** The Services/Parents copy calls for "Show interest → enter email to join waitlist" on the Live Q&A card. This needs an actual functional email capture — decide whether this goes into Neon Postgres as a simple waitlist table, routes through Resend, or just links out to the existing Substack subscribe flow. Not specified in either source doc; pick the lowest-effort option consistent with the existing stack unless Bobby says otherwise.
5. **Mid-page CTA on Services/Parents.** The final copy places a "Talk to Bobby" CTA right after the Weekly Group section, in addition to the closing CTA at the bottom of the page — this is two CTA instances on one page, intentional per the copy, not a duplicate to clean up.

---

## STRUCTURAL BUILD TASKS (from `homepage-redesign-v3.md`)

- **Logo behavior:** large on load, scroll-linked shrink into the fixed top-left nav position, cycling through color variants during the transition (see Assets, below, for exact files). Motion's `useScroll`/`useTransform`, continuous motion, not a jump cut.
- **Nav — header and footer differ, not identical:**
  - Header: About (`/about-bobby`) · Start Here (in-page anchor) · **Parents** (`/services` — renamed from "Services") · FAQs (in-page anchor). No dropdown, no Organizations item.
  - Footer: About · Start Here · Parents · **Organizations** (`/services/organizations`) · FAQs — one more item than the header. Bigger type, set in Arvo (see Brand System). Hover state: row fills solid `#f8f8f8`, text inverts to `#111111`, trailing arrow icon appears — matches bymonolog.com's footer nav treatment exactly.
- **Homepage section order:** Hero (Proof Wall) → Start Here (redesigned, see below) → Quick Credential → FAQ → Footer (two-column, nav-mirror left / Connect right).
- **Start Here, fully redesigned** (was a flat 4-tile grid, now two rows):
  - Row 1: left third is the Tech Safety Tool tile (photo of a parent actually using the tool, links to `/tech-safety`); right two-thirds is Common Pain Points as a vertical carousel — shows 3 by default, scrolls through all pain-point topics. **All pain-point items must be in the DOM on load** (not lazy-loaded/JS-fetched-on-interaction) — the point is homepage SEO credit for every pain-point search term, which only works if a crawler sees them in the markup.
  - Row 2: three equal-width panels, touching with no gap, same total width as Row 1. Photo + label each: "Parents." (photo of a parent) → `/services` anchored to the 1:1 Sessions section; "Groups." (photo of a group session) → `/services` anchored to the Weekly Group section; "Organizations." (photo of an org/nonprofit office) → `/services/organizations`, top of page. Parents and Groups are the same page, different anchors — `/services` needs stable anchor IDs on both sections (e.g. `#one-on-one`, `#weekly-group`) for these links to target.
- **Brand system:** colors `#6b0000` / `#111111` / `#f8f8f8`, gradient `#111111`→`#6b0000` at 180° (gradient is a secondary asset, not the hero background — hero and header are both flat `#111111`). Fonts: Title (Philly Sans) is still a placeholder pending Bobby's licensing decision; **Subtitle role is resolved — Arvo**, not Rockwell (free Google Font, no licensing issue); Heading/Subheading/Body (Libre Franklin) and Quotes (Caveat) were already resolved. Build the type system so swapping the remaining placeholder font-family value is a one-line change, not a structural one.
- **Header/hero must be one continuous surface** — no separate lighter header bar above the hero. Fix from the last preview build, which rendered them as visually distinct sections.
- **Hero headline is two-tone** — split across `#6b0000` and `#f8f8f8`, not a single flat color. See `homepage-redesign-v3.md` Section 1 for the exact split.
- **Testimonial cards** should read as sharp-cornered and rectangular, not soft rounded-square — also a fix from the last preview build.
- **About page image field** still doesn't exist in the Keystatic `about` singleton (per CLAUDE.md) — add it. Photo is now available (see Assets section below), so this should be wired up to the real image, not left as an empty slot.
- **Keystatic schema updates** needed to match the new About page layout and content fields (per Bobby's standing request that Keystatic get updated alongside the redesign, not left behind).
- **Services/Parents page — scroll-converge animation** on the wedged-photo hero section (see `services-parents-page-v1.md`): text halves start pulled toward the viewport edges, photo small and centered; as the user scrolls through the section, the halves animate inward and the photo grows, converging into one tight line by the time the section is fully in view — same bymonolog.com effect as the logo shrink, same scroll-linked-transform technique. Note: that file's own hero *copy* is stale (says "bridges," final copy says "path/forest" — use the docx wording, not the placeholder text in that file).
- **Hero headline, confirmed final:**
  ```
  Parenting [sucks] right now.     ← "sucks" in #6b0000, rest in #f8f8f8
  It doesn't have to.              ← in #f8f8f8
  ```
  Subhead: "You've got more parenting advice than you know what to do with. What you're missing isn't information — it's someone to help you actually use it." The earlier personal statement ("I've been through hard things...") is not cut — it's demoted to a smaller supporting line beneath the subhead, not the main hero text.

---

## ASSETS

Bobby's adding real photo and logo files to an `/assets` folder at the ResearchBibleWebsite project root (local dev — confirm actual filenames/paths for photos directly against the filesystem once there). This resolves the earlier "photo not ready" placeholders on the homepage Quick Credential section and the About page — wire up the real files rather than leaving placeholder slots.

**Logo SVGs — confirmed sufficient, all seven files validated:**
- Main mark: `BWPSLogoGray.svg`, `BWPSLogoWhite.svg`, `BWPSLogoRed.svg`, `BWPSLogoGradient.svg` — four color variants, consistent viewBox, use these for the Logo Behavior color-cycling animation.
- Subtitle lockup: `BWPS_Subtitle_Red.svg`, `BWPS_Subtitle_Off_White.svg`, `BWPS_Subtitle_Grey.svg` — a separate wordmark element, available if a subtitle treatment is needed anywhere alongside the main mark.

**Still needed, not yet provided:** photo of a parent using the Tech Safety Tool, a photo of a group session, a photo of an organization/nonprofit office, and the individual "parent" photo for the Start Here Row 2 panel — these are new requirements from today's Start Here redesign, separate from Bobby's own headshot.

---

## URL MAP — all four need 301 redirects

| Old | New |
|---|---|
| `/about` | `/about-bobby` |
| `/tools/tech-safety-tool` | `/tech-safety` |
| `/help` | `/common-pain-points` |
| `/help/[slug]` | `/common-pain-points/[slug]` |

Update `app/robots.ts` and `app/sitemap.ts` in the same pass — both reference the old paths directly.

**`/tech-safety` also needs:** consequence instructions moved to the top of the page. Check the actual current file structure before implementing — not fully spec'd here.

---

## CONTENT — reminder, not a repeat

Full final copy for Homepage, Services, Services/Organizations, About-Bobby, and the new FAQ is in `Bobby_Washburn_Site_Copy_redux_v1.docx`. Pull directly from there section by section rather than any earlier draft. Common Pain Points and Tech Safety keep their existing content — URL and structural changes only, no copy changes.

---

## TESTIMONIALS

Real quotes, pulled from Bobby's feedback spreadsheet, consent confirmed (submission to the feedback form constituted approval for public use). Slot directly into the existing `content/testimonials/*.yaml` collection (`quote`/`attribution` fields) — no schema change needed.

---

## CLAUDE.md updates — after build is verified working

- **Brand System table:** replace with the new fonts/colors once finalized (placeholder fonts noted as pending swap until Bobby resolves licensing).
- **Homepage Structure section:** replace with the new five-section order.
- **Header nav description:** update to About / Start Here (anchor) / Parents (renamed from Services) / FAQs — no dropdown. Note the footer nav is a separate, longer list (adds Organizations) — document both, not just one.
- **Site Map:** add `/services`, `/services/organizations`, update `/about-bobby`, `/tech-safety`, `/common-pain-points` (+ children) with their new paths; remove references to the old paths once redirects are confirmed working.
- **`about` singleton bullet:** update once the image field exists and content matches the new layout.
- **Testimonial consent open item:** remove from Open Items — resolved.

---

## DEPLOY

Once built and self-verified (routes resolve, redirects work, no broken links from the URL renames): commit to a feature branch, push to GitHub, and let Vercel's existing PR-preview integration generate the preview deployment automatically. Share the preview URL. Do not merge to main — that's Bobby's call after review.
