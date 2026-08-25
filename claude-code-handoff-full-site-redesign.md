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

- **Logo behavior:** large on load, scroll-linked shrink into the fixed top-left nav position. Motion's `useScroll`/`useTransform`, continuous motion, not a jump cut.
- **Nav:** About (`/about-bobby`) · Start Here (in-page anchor) · Services (`/services`) · FAQs (in-page anchor). No dropdown.
- **Homepage section order:** Hero (Proof Wall) → Start Here (4 tiles) → Quick Credential → FAQ → Footer (two-column, nav-mirror left / Connect right).
- **Brand system:** colors `#b40000` / `#111111` / `#f8f8f8`, gradient `#111111`→`#b40000` at 180°. Fonts are placeholders (Philly Sans / Rockwell / Libre Franklin / Caveat) — Bobby is resolving licensing/substitutes and will swap font files before this ships to production; build the type system so swapping the font-family values is a one-line change, not a structural one.
- **About page image field** still doesn't exist in the Keystatic `about` singleton (per CLAUDE.md) — add it, or hardcode a static import if Bobby's not managing the photo via CMS. Photo itself is not ready yet; build the slot regardless.
- **Keystatic schema updates** needed to match the new About page layout and content fields (per Bobby's standing request that Keystatic get updated alongside the redesign, not left behind).

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
- **Header nav description:** update to About / Start Here (anchor) / Services / FAQs (anchor) — no dropdown.
- **Site Map:** add `/services`, `/services/organizations`, update `/about-bobby`, `/tech-safety`, `/common-pain-points` (+ children) with their new paths; remove references to the old paths once redirects are confirmed working.
- **`about` singleton bullet:** update once the image field exists and content matches the new layout.
- **Testimonial consent open item:** remove from Open Items — resolved.

---

## DEPLOY

Once built and self-verified (routes resolve, redirects work, no broken links from the URL renames): commit to a feature branch, push to GitHub, and let Vercel's existing PR-preview integration generate the preview deployment automatically. Share the preview URL. Do not merge to main — that's Bobby's call after review.
