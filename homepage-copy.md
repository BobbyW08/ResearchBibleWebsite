# bobby-washburn.com — Full Homepage Copy
**Source of truth for all homepage components. Drop into Claude Code for implementation.**
Brand: Space Grotesk (headlines) / DM Sans (body) · #F1F5FF bg · #1E1527 text · #343F58 accent

---

## SEO METADATA (Page-level)

```
<title>Bobby Washburn | Parenting Support</title>

<meta name="description"
  content="Struggling with your kid and don't know why? Bobby Washburn is a CPRS
  and peer educator who works with parents at their wits' end — whatever the challenge." />

<meta property="og:title" content="Bobby Washburn | Parenting Support" />
<meta property="og:description"
  content="You've tried everything. Something still isn't working. That's exactly where I come in." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://bobby-washburn.com" />

<link rel="canonical" href="https://bobby-washburn.com" />

<!-- Schema.org Person markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Bobby Washburn",
  "url": "https://bobby-washburn.com",
  "jobTitle": "Certified Peer Recovery Specialist (CPRS)",
  "description": "Peer educator with lived experience in mental health and substance use recovery. Helping parents at their wits' end find a way through.",
  "sameAs": [
    "https://www.instagram.com/bobby__washburn/",
    "https://www.linkedin.com/in/bobby-washburn/",
    "https://roughlyeducated.substack.com/"
  ]
}
</script>
```

---

## BROWSER TAB / SITE TITLE

```
Bobby Washburn | Parenting Support
```
*(Not "Research Bible" — update <title> tag and any site-level title config in Next.js layout.tsx)*

---

## NAV BAR

| Element | Copy |
|---|---|
| Logo wordmark | Bobby Washburn |
| Nav links | About · Guides · Pain Points · FAQ |
| Primary CTA button | Book a Call |

**Notes:**
- Remove "Research Bible" and "Subscribe" from nav
- "Pain Points" links to `/help` (the pain point cards page)
- "Guides" links to `/docs` (the deep-dive topic library)
- "Book a Call" links to Cal.com outbound link

---

## HERO SECTION

### H1
```
You've tried everything.
Something still isn't working.
That's exactly where I come in.
```

### Subheadline
```
Every parent I work with has felt like they were the only one dealing with this.
They weren't. Neither are you.
```

### Hero CTAs (two buttons)

**Primary:** `What's Your Pain Point? →`
*(links to /help — the pain point cards page)*

**Secondary:** `Book a Call with Bobby`
*(links to Cal.com outbound link)*

### Hero eyebrow label (small text above H1)
```
Peer Support · Lived Experience · CPRS
```

---

## MEET BOBBY SECTION

*(This is the about block — sits below hero, before pain points)*

### Section eyebrow
```
Meet Bobby
```

### H2
```
Someone who's been on both sides of this.
```

### Body
```
I grew up as the kid that parents didn't know what to do with. ADHD, depression,
substance use — I was in the thick of it for years. I found my way through,
got educated, and became a Certified Peer Recovery Specialist (CPRS) because
I knew there were families out there who needed someone who actually understood
what they were living with.

I don't hand you a pamphlet. I sit with you and figure out what's actually going on.
Whether your kid has a diagnosis, you think they might, or you just know something
isn't right and nobody seems to get it — that's exactly the kind of situation I work in.

Years of working directly with families. No clipboard. No timer on the session.
Just someone in your corner who's been there.
```

### Pill tags (existing component)
```
Evidence-based · Peer Support · CPRS
```

### CTA link
```
Read more about Bobby →
```
*(links to /about)*

---

## PAIN POINTS SECTION

*(This replaces the old "Guides" card section as the first content hook on the page)*
*(Show the 3 most-clicked / most relatable pain points as cards. Full list lives at /help)*

### Section eyebrow
```
Pain Points
```

### H2
```
Pick the one that sounds most like your week.
```

### Supporting paragraph
```
You don't need to have the right words for it. Just find the situation that feels
closest to what's happening at home — and start there.
```

### 3 Featured Pain Point Cards
*(These are the top 3 — chosen for broadest relatability across diagnoses and ages)*

**Card 1: Morning Meltdowns**
- Label: `Mornings feel impossible`
- Body: `Every morning is a battle — getting out of bed, getting dressed, getting out the door. By the time they leave, you're already exhausted.`
- CTA: `See what's happening →` *(links to /help/morning-meltdowns)*

**Card 2: My Kid Won't Listen**
- Label: `Nothing I say lands`
- Body: `You give a direction. They ignore it, argue it, or melt down. You've tried calm, firm, rewards, consequences. Nothing sticks.`
- CTA: `See what's happening →` *(links to /help/wont-listen)*

**Card 3: After-School Explosions**
- Label: `They hold it together all day, then fall apart at home`
- Body: `School is fine, teachers say. But the moment they walk in the door, everything unravels. You've become the safe place for every emotion they've stored up all day.`
- CTA: `See what's happening →` *(links to /help/after-school-explosions)*

### Section CTA (below cards)
```
See all pain points →
```
*(links to /help)*

---

## TESTIMONIALS SECTION

*(Real client quotes — identifying details anonymized per HIPAA: randomized ages, Rhode Island towns, first names only or relationship labels. All quotes are verbatim from client feedback forms.)*

### Section eyebrow
```
What parents say
```

### H2
```
From parents in the thick of it.
```

---

**Testimonial 1** — Mornings / routines / co-parenting
> "For the most part our morning and nightly routines are a little bit easier. Maintaining healthy boundaries while co-parenting — not becoming emotional during disagreements and letting the little things not get in the way of the bigger picture. Having someone sit down with ME to ask me about my values and what matters to me was a really important step. I still look back on my notes from when I worked with Bobby."

*— Mom, 34, Cranston, RI*

---

**Testimonial 2** — Feeling heard, not clinicalized
> "We could actually talk without some sort of imbalanced power dynamic. All the years of therapy with my kid — no one ever spent as much time with me as with my kiddo. Which helped my kid, because I was feeling seen and supported. Almost annoyingly positive all the time (I kid, it wasn't annoying) — and there didn't feel like an expiration date. You were in it for the long haul."

*— Mom, 41, North Kingstown, RI*

---

**Testimonial 3** — Total family turnaround
> "If we didn't have Bobby I don't know if we would be where we are. Yes, we still have blips — but we now feel like we can move past our blips instead of the blips dragging on. Taking our calls when we felt lost and completely by ourselves, talking us down, having us realize that little steps are wins — and to look at the wins even during the bad times."

*— Dad, 47, Warwick, RI*

---

**Testimonial 4** — Confidence + practical tools
> "I have a lot more confidence as a parent. I feel more connected and in charge. You were there beyond your schedule — knowing I could reach out in a more crisis mode helped a lot. We still use the diagrams and lists you helped make. We hold family meetings and make sure everyone is heard. This program helped in so many ways. I'm forever grateful."

*— Mom, 38, West Warwick, RI*

---

**Testimonial 5** — Peer support difference
> "It feels easier to be heard and seen by someone that isn't 'clinical.' Feeling heard by someone who has experienced similar or the same experiences is a welcomed relief. Having that consistent person I could reach out to was a big deal for me."

*— Mom, 29, Providence, RI*

---

## CONNECT SECTION

*(Replaces the old Subscribe block — sits below testimonials. Three ways to stay connected.)*

### H2
```
Want to keep going?
```

### Supporting paragraph
```
There's more where this came from. Follow along, go deeper, or just reach out.
```

### Three connection tiles

**Tile 1: Substack**
- Icon: newsletter/envelope
- Label: `Read the newsletter`
- Body: `Parenting insights, real talk, and practical strategies — no jargon, no fluff.`
- CTA: `Follow on Substack →` *(links to https://roughlyeducated.substack.com/)*

**Tile 2: Instagram**
- Icon: instagram
- Label: `Follow on Instagram`
- Body: `Short, honest content for parents navigating the hard stuff. Show up when you need a reminder you're not alone.`
- CTA: `Follow on Instagram →` *(links to https://www.instagram.com/bobby__washburn/)*

**Tile 3: Book a Call**
- Icon: phone/calendar
- Label: `Reach out to Bobby`
- Body: `Not sure where to start? Book a free 30-minute call. No pressure, no pitch — just a conversation.`
- CTA: `Book a Call →` *(links to Cal.com outbound link)*

---

## FAQ SECTION

### Section eyebrow
```
FAQ
```

### H2
```
Questions people ask before they reach out.
```

### FAQ Items

**Q: Is this therapy?**
A: No. This is peer support and parenting education — not therapy, diagnosis, or clinical care. I'm a CPRS (Certified Peer Recovery Specialist), which means I'm trained to support families from a peer perspective, not a clinical one. If your family needs clinical support, I'll say so directly and help point you in the right direction.

**Q: Do I need a diagnosis to work with you?**
A: No. Most of the families I work with are somewhere in the middle — something's hard, they're not sure exactly why, and they haven't necessarily gotten an official label for it. You don't need a diagnosis to start a conversation.

**Q: What makes this different from regular parenting advice?**
A: I've been on the other side of this. I was the kid parents didn't know what to do with. That lived experience — combined with years of working directly with families and a CPRS credential — means I come to this differently than a therapist or a parenting blogger. I'm not just telling you what the research says. I'm sitting with you in the specific situation you're in.

**Q: Who is this for?**
A: Any parent who's struggling — whether your child has a diagnosis, you think they might, or you just know something isn't working and you can't figure out why. There's no label required to reach out.

**Q: What does a session look like?**
A: It's a conversation. No clipboard, no clinical intake forms, no timer counting down. We talk about what's actually happening at home, figure out what the real pressure points are, and work on what you can do differently. Some families work with me for a few sessions. Some stay connected longer. It depends entirely on what you need.

**Q: How do I get started?**
A: Book a free 30-minute call. That's it. We'll talk and figure out together what kind of support makes sense.

---

## FOOTER COPY

```
Logo wordmark: Bobby Washburn

Tagline: Parenting support from someone who's been there.

Column 1 — Sitemap:
  - About (→ /about)
  - Pain Points (→ /help)
  - Guides (→ /docs)
  - FAQ (→ #faq)

Column 2 — Connect:
  - Book a Call (→ Cal.com link)
  - Newsletter (→ https://roughlyeducated.substack.com/)
  - Instagram (→ https://www.instagram.com/bobby__washburn/)
  - LinkedIn (→ https://www.linkedin.com/in/bobby-washburn/)

Legal / fine print:
  © 2026 Bobby Washburn. Peer support and parenting education —
  not therapy, diagnosis, or medical advice.

Social icon links: Instagram · LinkedIn · Substack
```

---

## PAGE STRUCTURE SUMMARY (section order for implementation)

1. Nav bar
2. Hero (H1 + subheadline + two CTAs + eyebrow)
3. Meet Bobby
4. Pain Points (3 featured cards + "See all" link)
5. Testimonials (5 real quotes)
6. Connect (Substack · Instagram · Book a Call)
7. FAQ
8. Footer

**Removed from old structure:**
- ❌ Credibility strip (Lorem Ipsum box with credentials)
- ❌ Services section (courses, groups, CPRS training)
- ❌ Subscribe/free guide CTA box
- ❌ Book a Call standalone section (folded into Connect tiles)
- ❌ "Research Bible" nav item
- ❌ "Subscribe" nav item

---

## SEO KEYWORD TARGETS

**Homepage (navigational/brand):**
- `Bobby Washburn`
- `bobby-washburn.com`
- `parenting support CPRS`
- `peer parenting support`

**Pain point pages carry the long-tail load:**
- `why won't my kid listen`
- `after school meltdowns`
- `morning routine ADHD child`
- `my child has behavior problems`
- `parenting help struggling`

**SEO structural notes:**
- H1 is emotional hook, not keyword-stuffed — topic and pain point pages carry the ranking weight
- FAQ items are written to match People Also Ask phrasing
- Schema.org Person markup establishes Bobby's identity and credential in search

---

*HIPAA note: All testimonials use randomized ages and Rhode Island towns. No last names, no child details, no identifying information. Quotes are verbatim from client feedback forms with no clinical content included.*
