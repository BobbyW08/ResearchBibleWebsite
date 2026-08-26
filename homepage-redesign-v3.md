# Homepage Redesign v3
**New document — `homepage-redesign-v2.md` is left as-is, not deleted, in case anything there is still needed for reference. This v3 doc is the current source of truth for the homepage.**

---

## BRAND SYSTEM (same as v2 — Bobby will swap actual font files/licensing before Claude Code handoff)

| Role | Font |
|---|---|
| Title (hero-level) | Philly Sans (placeholder — Bobby resolving license or substitute before handoff) |
| Subtitle | **Arvo** — resolved, replaces the Rockwell placeholder (free Google Font, already the flagged substitute) |
| Heading / Subheading / Body | Libre Franklin |
| Quotes / testimonial text | Caveat |

| Role | Color |
|---|---|
| Red (primary accent) | `#6b0000` |
| Near-black | `#111111` |
| Off-white | `#f8f8f8` |
| Gradient asset | Linear, 180°, `#111111` → `#6b0000` — secondary asset only, not for the hero background (see Section 1 — hero background is flat, not gradient) |

---

## LOGO BEHAVIOR

On page load: BWPS logo renders large and prominent (not in a small nav slot). As the user scrolls, the logo shrinks and animates into the top-left corner of the header, where it stays fixed/sticky for the rest of the scroll. Build as a scroll-linked transform (Motion's `useScroll`/`useTransform`), not a hard cutover — should read as one continuous motion, not a jump cut.

**Color-cycling during the transition:** as the logo shrinks, it cycles through the actual provided variants rather than staying static — `BWPSLogoGray.svg`, `BWPSLogoWhite.svg`, `BWPSLogoRed.svg`, `BWPSLogoGradient.svg` are all available and confirmed sufficient for this. Sequence through them across the scroll-linked transform, landing on whichever variant reads best at the final small top-left size (likely White or Gray against the `#111111` field — Claude Code's call on the exact landing variant). The three `BWPS_Subtitle_*` files (Red / Off White / Grey) are a separate wordmark lockup, available if a subtitle treatment is needed anywhere alongside the main mark.

---

## HEADER / NAV

**No separate header bar.** The header and hero are one continuous surface — flat `#111111` background runs from the very top of the page through the entire hero, nav included. Nothing above the hero should read as a distinct lighter section (this was wrong in the last preview build — the nav rendered in a separate light gray bar above a gradient hero; both need fixing).

Full-color BWPS logo (per Logo Behavior above), sitting directly on the `#111111` field. Horizontal nav, left to right:

| Nav item | Behavior |
|---|---|
| About | Page link → `/about-bobby` |
| Start Here | In-page anchor scroll → Section 2 on this same page |
| Parents | Page link → `/services` (renamed from "Services" — the header nav item) |
| FAQs | In-page anchor scroll → Section 4 on this same page |

No dropdown. Organizations is not in the header nav — it's reached via Start Here (Section 2) and the footer nav (see Section 5), not a top-level header item.

---

## SECTION 1 — Hero: "Proof Wall"

**Background: flat `#111111`, no gradient.** The last preview build used a top-to-bottom black-to-red gradient behind the testimonials — that's wrong; the hero (and the header above it) should be one uniform near-black field. The gradient is a separate brand asset for other uses, not the hero background.

Testimonial cards: off-white (`#f8f8f8`) "paper" on the `#111111` field, cursor-parallax, `#6b0000` tape/underline accent, quote text in Caveat. **More rectangular than the last build** — corners should read as sharp/minimally rounded, not soft rounded-square cards, and proportions should be wider than tall rather than close to square.

**Central statement — big, bold, two-tone.** Split across the accent red and off-white, not a single color:
```
Parenting [sucks] right now.           ← "sucks" in #6b0000, rest in #f8f8f8
It doesn't have to.                    ← in #f8f8f8
```

**Subhead (smaller, regular weight):**
```
You've got more parenting advice than you know what to do with.
What you're missing isn't information — it's someone to help you
actually use it.
```

**Supporting line (smaller still — demoted from the previous hero headline):**
```
I've been through hard things. I learned how to build a life
through them. Now I help parents do the same.
```

**CTA:**
```
[ Tell Me What's Happening ]
```
Links straight out to the Cal.com intro-call URL — not an internal booking page.

**Testimonials (verified wording from the feedback spreadsheet):**
```
"Feeling heard and seen by someone that has experienced similar
or same experiences is a welcomed relief."
— Parent peer-support client

"You called me out on my crap — which I needed. I always felt
like you were in my corner."
— Parent peer-support client

"We have more tools to de-escalate situations, and more
confidence as a parent."
— Parent peer-support client

"Real life, honest, lived experiences made me feel heard, seen,
and not alone."
— Parent peer-support client

"If we didn't have Bobby, I don't know if we would be where we
are."
— Parent peer-support client
```

---

## SECTION 2 — Start Here

Redesigned from a flat four-tile grid into two rows, aimed at surfacing the genuinely useful stuff instead of burying it:

**Row 1 — two columns, left 1/3 + right 2/3:**

| Column | Content |
|---|---|
| Left (1/3) — Tech Safety Tool | Links to `/tech-safety`. Shows a photo of a parent actually using the tool — not an icon or a generic screenshot. |
| Right (2/3) — Common Pain Points | Shows 3 pain points by default, in a **vertical carousel** that scrolls through the full list of pain-point topics. **SEO requirement:** all pain-point items must exist in the page's HTML/DOM on load, not fetched or rendered only on interaction — this is a scrollable/overflow carousel, not a paginated or lazy-loaded one, since the point is to get homepage SEO credit for every pain-point search term. |

**Row 2 — three equal-width panels, directly below Row 1, same total width as Row 1, touching with no gap between them:**

| Panel | Image | Label | Destination |
|---|---|---|---|
| Left | Photo of a parent | "Parents." | `/services`, scrolled to the 1:1 Sessions section (needs an anchor ID on that section — see `services-parents-page-v1.md`) |
| Middle | Photo of a group session | "Groups." | `/services`, scrolled to the Weekly Group section (needs its own anchor ID) |
| Right | Photo of an organization/nonprofit office | "Organizations." | `/services/organizations`, top of page |

Parents and Groups both land on `/services` — they're the same page, just deep-linked to different sections. Organizations is the only panel that goes to a different page entirely.

---

## SECTION 3 — Quick Credential Section (replaces "Meet Bobby")

Bullet-point format. Keeps the existing photo slot (Bobby uploading a new photo separately). Bullets: lived experience, credentials (CPRS, RI Board #202153), "worked with 100+ families," etc. Ends with a "Learn more" link → `/about-bobby`.

*Exact bullet copy TBD — draft once `/about-bobby` content is finalized so the two don't repeat verbatim.*

---

## SECTION 4 — FAQs

Lives at the bottom of the homepage, directly above the footer. This is the scroll target for the nav's "FAQs" link.

---

## SECTION 5 — Footer (bymonolog.com pattern)

Two columns:
- **Left:** nav list, bigger type, set in **Arvo** — this footer nav list is not identical to the header nav. It's About, Start Here, Parents, Organizations, FAQs (Organizations appears here even though it's not in the header nav). **Hover state:** matches bymonolog.com's treatment exactly — the row fills with a solid `#f8f8f8` background (text inverts to `#111111`), with a trailing arrow icon that appears on hover.
- **Right:** Connect content — Newsletter signup, social links, Book a Call. Keep as-is, no changes here. This replaces the old standalone mid-page "Connect" section entirely; Connect now lives only in the footer.

---

## URL MAP — renames requiring 301 redirects

| Old | New |
|---|---|
| `/about` | `/about-bobby` |
| `/tools/tech-safety-tool` | `/tech-safety` |
| `/help` | `/common-pain-points` |
| `/help/[slug]` | `/common-pain-points/[slug]` (all child pain-point pages move too) |

All four need redirects from the old paths — CLAUDE.md's `app/robots.ts` and `app/sitemap.ts` reference the old paths directly and need updating in the same pass, or indexed pages/backlinks break.

**Additional content task on `/tech-safety`:** move the consequence instructions to the top of the page. Exact current section order needs checking against the real file — flagging as a task, not fully speccing the reorder here since I don't have the page's current structure in front of me.

---

## SITEMAP (full)

```
bobby-washburn.com
bobby-washburn.com/services
bobby-washburn.com/services/organizations
bobby-washburn.com/tech-safety
bobby-washburn.com/common-pain-points
bobby-washburn.com/common-pain-points/[all sub pain-point pages]
bobby-washburn.com/about-bobby
```

---

## STILL OPEN

1. `/tech-safety` consequence-instructions reorder — needs a look at the actual current page structure before this can be spec'd precisely.
2. `/services` and `/services/organizations` page pricing/audience content — see `services-parents-page-v1.md`.
3. Photos needed for: Tech Safety Tool in use, a parent, a group session, and an organization/nonprofit office (Start Here Row 2 panels).
