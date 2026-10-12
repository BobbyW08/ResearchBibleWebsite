# Launch Review — Security, Privacy, Mobile, Performance, Accessibility

This document records findings from the pre-launch review pass. Items marked **BLOCKED-ON-BOBBY** require a decision or action from Bobby before they can be closed.

---

## Security

### Findings — Green

| Area | Finding |
|---|---|
| Webhook auth | Both webhook routes (`/api/webhooks/drive-content-sync`, `/api/webhooks/parent-content-sync`) use `crypto.timingSafeEqual` for constant-time secret comparison — safe against timing attacks |
| Payload REST auth | Public content collections have `read: () => true`; write operations are `isAdmin` (requires Payload session). Lesson bodies are `read: isAdmin` to prevent paid content leakage |
| Community rate limiting | Post: 20/hr, Comment: 60/hr, Set-role: covered by emailVerified check. In-memory sliding window; resets on server restart (acceptable for now) |
| Suspension enforcement | Suspended profiles are blocked at the API layer (`status === "suspended"` check) on every write route |
| JSON-LD in layout | `JSON.stringify(personJsonLd)` passed to `dangerouslySetInnerHTML` — the object is hardcoded in the file, not user-controlled, so XSS is not possible here |
| Middleware | Cookie-presence gate on `/community/*`, `/courses/*`, `/account/*`. Full session + profile validation happens server-side on each page; middleware is defense-in-depth |
| No SQL injection surface | All DB access goes through Payload Local API (parameterized) — no raw SQL |
| robots.txt | `/api/`, `/admin`, `/community`, `/courses`, `/account`, `/sign-in`, `/welcome` disallowed for all crawlers |

### Findings — Action Required

| Severity | Area | Finding | Action |
|---|---|---|---|
| High | Production migrations | 8 new collection tables don't exist in Neon production. Payload's `pushDevSchema` is skipped in `NODE_ENV=production`. See `docs/operations/migrations.md` for the full fix procedure. | **BLOCKED-ON-BOBBY:** generate migration file on Node 20, add `postbuild` hook to `package.json`, commit and deploy — required before enabling community/courses/auth routes |
| Medium | Account deletion / data export | No "delete account" or "export my data" button exists on the account page. Required for GDPR Article 17/20 if serving EU users. | **BLOCKED-ON-BOBBY:** legal decision on whether this is required at launch; if yes, add to `/account` post-launch |
| Medium | Rate limiting | In-memory store resets on every Vercel cold start (multiple serverless instances don't share state). A determined actor can bypass by hitting multiple instances. | Acceptable for launch; upgrade to Redis/Upstash if abuse materializes |
| Low | `WEBHOOK_SECRET` rotation | `drive_content_sync_setup.md` still mentions the old secret value. | **BLOCKED-ON-BOBBY:** rotate `WEBHOOK_SECRET` in Vercel and the Apps Script CONFIG, then rewrite `drive_content_sync_setup.md` to remove the hardcoded value |
| Low | Session cookie on HTTP | `neon-auth.session_token` (no `__Secure-` prefix) is used in local dev. In production Vercel always uses HTTPS, so only `__Secure-neon-auth.session_token` is set | No action needed — Vercel enforces HTTPS |
| Low | Missing CSP headers | No `Content-Security-Policy` header is set. Vercel's default headers apply. | Post-launch hardening; add a CSP response header in `next.config.ts` when the page's iframe/script inventory is stable |
| Low | Media uploads ephemeral | Payload writes media to `public/media/` — lost on every Vercel deploy. See `docs/operations/migrations.md`. | **BLOCKED-ON-BOBBY:** configure a cloud storage adapter before uploading media through `/admin`. Not needed at launch if all images are committed to the repo. |

---

## Privacy

### Findings — Green

| Area | Finding |
|---|---|
| PII schema | Visitor profiles store: userId, userRole, displayName, bio, status. No email (email lives only in Neon Auth's `neon_auth` schema). No child names, no partner names — compliant with the locked PII policy |
| Children's data | No child-name column anywhere in Payload collections or the schema. Tech Safety tool text mentions "child's name" only as instruction copy inside Google/Apple UI strings — not collected data |
| Analytics | Vercel Analytics + Google Analytics 4 (`G-5ZLMM0G7CV`). GA4 is loaded via `next/script` with `strategy="afterInteractive"` — fires after hydration, not on server |
| Privacy policy | `/privacy` route exists and is live |
| robots.txt training block | All known training crawlers (GPTBot, ClaudeBot, CCBot, etc.) are blocked site-wide |

### Findings — Action Required

| Severity | Area | Finding | Action |
|---|---|---|---|
| Medium | Cookie consent | No cookie consent banner is shown. GA4 sets cookies. GDPR/CCPA compliance depends on Bobby's legal advice and target audience geography. | **BLOCKED-ON-BOBBY:** confirm whether a consent banner is required for the launch audience |
| Low | GA4 data processing agreement | A Google DPA should be in place for GA4 if any EU traffic is expected. | **BLOCKED-ON-BOBBY:** confirm with Bobby's legal counsel |

---

## Mobile

### Findings — Green

| Area | Finding |
|---|---|
| Viewport meta | `<meta name="viewport" content="width=device-width, initial-scale=1">` is set in `app/(app)/layout.tsx` |
| Mobile testimonial carousel | `MobileTestimonialCarousel` (horizontal scroll-snap, auto-advance) used on hero below `md:` breakpoint |
| Pain point layout | `PainPointSidebarLayout` renders a single-column layout on mobile; sidebar collapses |
| Services modality cards | `ModalityCards` uses accordion pattern on mobile (< `sm`) |
| Side gutters | 16px side gutter (`px-4`) used throughout — no horizontal scroll on content pages |
| Cal.com links | Direct outbound links, not embeds (except Teen page popup) — no iframe sizing issues on mobile |

### Findings — Action Required

| Severity | Area | Finding | Action |
|---|---|---|---|
| Medium | Services hero video | `public/videos/paths-loop.mp4` fails to decode in Chrome (non-faststart encoding) — renders as a black box. This is a known open item. | **BLOCKED-ON-BOBBY:** re-export the video with `-movflags +faststart` |
| Low | Teen page pinned CTA | Cal.com popup (`data-cal-link`) on the Teen page's pinned CTA — untested on small screens. | Test on mobile before enabling the Teen route |

---

## Performance

### Findings — Green

| Area | Finding |
|---|---|
| Next.js Image optimization | `next/image` used for all images in components (hero, credential, pain point icons) |
| Static prerendering | Homepage, About, Services, Legal, Privacy, Docs index, ADHD page are all statically prerendered (`○` in build output) |
| `force-dynamic` scoped correctly | Only routes that need per-request data (`/community`, `/community/post/[id]`, `/courses`, `/courses/[slug]`, `/courses/[slug]/[lesson-slug]`) are marked `force-dynamic` |
| Script loading | GA4 scripts use `strategy="afterInteractive"` — no render blocking |
| Vercel Analytics | `<Analytics />` component — lightweight, async |

### Findings — Action Required

| Severity | Area | Finding | Action |
|---|---|---|---|
| Low | Recharts bundle size | Recharts adds ~150 KB to the ADHD page JS bundle. It's only used on `/docs/adhd`. | Acceptable for launch; lazy-load with `next/dynamic` if Lighthouse score becomes a concern |
| Low | Motion library | `motion` adds bundle weight. Currently used for hero parallax only. | Same — acceptable for launch |

---

## Accessibility

### Findings — Green

| Area | Finding |
|---|---|
| Semantic HTML | Page-level `<main>`, `<header>`, `<footer>` elements present in all templates |
| Heading hierarchy | H1 present on all content pages; H2/H3 used for subsections |
| Focus visible | Tailwind `focus-visible` ring utilities used on interactive elements |
| Color contrast | Brand red `#9F0000` on white `#F8F8F8`: contrast ratio ~5.5:1 — passes WCAG AA for normal text |
| Alt text | `next/image` `alt` props set on media components |

### Findings — Action Required

| Severity | Area | Finding | Action |
|---|---|---|---|
| Medium | ADHD interactive components | `DelayAversionSlider`, `EvidenceTierToggle`, `StrategyExplorer` — keyboard accessibility not audited. | **BLOCKED-ON-BOBBY:** manual keyboard and screen reader test before promoting `/docs/adhd` as a flagship page |
| Low | Tech Safety wizard | Step-by-step wizard — focus management between steps not audited. | Test with keyboard-only navigation before launch |
| Low | Flip cards (Services page) | `ModalityCards` flip cards at `sm`+: confirm keyboard focus enters the card back. | Test with keyboard-only navigation |

---

## Summary: BLOCKED-ON-BOBBY items from this review

**Before enabling community/courses/auth routes:**
1. Run Payload migrations — see `docs/operations/migrations.md` for the full procedure (needs Node 20; edit `package.json` build script)
2. Configure cloud media storage before uploading images through `/admin`

**Before public launch:**
3. Rotate `WEBHOOK_SECRET` and rewrite `drive_content_sync_setup.md`
4. Cookie consent banner decision (GDPR/CCPA)
5. Google DPA confirmation
6. Re-export `paths-loop.mp4` with faststart encoding
7. Keyboard + screen reader test of ADHD interactive components

**Post-launch backlog:**
8. Set `PARENT_CONTENT_WEBHOOK_SECRET` in Vercel Production (parent content sync pipeline)
9. Set `RESEND_API_KEY` + verified sender domain + `NOTIFY_EMAIL` (community report emails)
10. Account deletion / data export button on `/account` (legal decision)

**Not covered by code review (requires Bobby's environment):**
- Auth flow end-to-end test (sign-up, email verification, password reset, Google OAuth)
- Course end-to-end test (create a course, enroll, complete a lesson)
- Community end-to-end test (post, comment, report)
- Real Lighthouse measurements (mobile performance scores)
- Apps Script 49-item verification list — not in the materials Claude Code received; Bobby must confirm or share
