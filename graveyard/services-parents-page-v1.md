# Services / For Parents — Structural Draft v1
**Layout and component spec, borrowing two techniques from bymonolog.com.**

**Flag: the hero copy in Section 1 below (the "bridges" language) is stale.** `Bobby_Washburn_Site_Copy_redux_v1.docx` replaced it with a path/forest metaphor ("We Build Your Path") — use the docx's actual wording, not the placeholder text below. The *technique* described in Section 1 (wedged-photo headline, now with scroll-converge motion — see the new note added there) still applies regardless of which words go in it.

---

## SECTION 1 — Wedged-photo statement hero

Borrowed technique: giant bold uppercase headline split into two halves with a photo wedged inline between them, baseline-aligned as one continuous line. Near-black background (`#111111`). **Use the actual headline from `Bobby_Washburn_Site_Copy_redux_v1.docx`, not the placeholder below:**

```
WE BUILD          [photo]          THOSE BRIDGES     ← placeholder only, see flag above
```

**Scroll-converge motion (new — matches bymonolog.com's exact effect):** on scroll into this section, the two text halves start pulled apart toward the left/right edges of the viewport, with the photo small and centered between them. As the user continues scrolling through the section, the two halves animate horizontally inward — converging toward the center — while the photo grows to its final size, landing in one tight, close-set line (text-image-text nearly touching) by the time the section is fully in view. Scroll-linked transform (Motion's `useScroll`/`useTransform`), same technique as the homepage logo shrink — not a fixed entrance animation, tied to actual scroll position through the section.

Photo candidate: something concrete and human — not stock-photo therapy imagery. A hand reaching, two people mid-conversation, whatever fits once you've got real photo assets.

Small paragraph beneath, same placement pattern as the reference:
```
Every family we work with is standing on one side of a gap they
can't see how to cross alone. We don't hand you a map and walk
away — we build the actual bridge with you, one real step at a
time.
```

---

## SECTION 2 — "The Path We'll Take" (Project Journey pattern)

Borrowed technique: numbered step rows, eyebrow number + bold title + short paragraph on the left, supporting image/diagram on the right, stacked as you scroll. Using your actual four-phase framework as the real content — this isn't generic process filler, it's the same methodology from the homepage marquee and the About page.

```
STEP · 01
Stabilize
Get through the hard moments without making them worse. Before
anything else changes, everyone in the house needs enough safety
to actually think straight.

STEP · 02
Connect
Build enough trust that your child can hear you. Structure
doesn't hold on a relationship that isn't there yet.

STEP · 03
Structure
Create routines, expectations, and follow-through that hold up
at home — the unglamorous stuff that actually changes daily life.

STEP · 04
Adapt
Adjust the tools for your family, your child, and whatever's in
front of you right now — the diagnosis, the school fight, the
teenager, the co-parenting.
```

Each step paired with a supporting image on the right (photo, diagram, or a simple graphic built from the brand system — doesn't need to be a screenshot like the reference, since you're not showing software).

---

## SECTION 3 — Packages/Pricing

Final content is in `Bobby_Washburn_Site_Copy_redux_v1.docx` (1:1 Sessions, Weekly Group, Live Q&A, Cohorts, pricing, sliding scale) — this supersedes the "TBD" placeholder that was here previously.

**New build requirement:** the homepage's redesigned Start Here section (see `homepage-redesign-v3.md`, Section 2, Row 2) links directly to specific parts of this page — "Parents" scrolls to the 1:1 Sessions block, "Groups" scrolls to the Weekly Group block. Both blocks need stable anchor IDs (e.g. `#one-on-one`, `#weekly-group`) so those homepage panels can deep-link to them rather than just landing on top of the page.

---

## SECTION 4 — Closing CTA

Same pattern as your homepage CTA, not a new one:
```
[ Tell Me What's Happening ]
Free 30-minute intro call • No pressure • No judgment
```

---

## Still open

- **"About us draw at the bottom"** — still need that screenshot/description to build it right.
