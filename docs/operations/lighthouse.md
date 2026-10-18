# Lighthouse Measurements

Measured via `npx lighthouse` (CLI v13.5.0) in headless Chrome against the
live production site (`bobby-washburn.com`). All scores are desktop simulated.
Date: 2026-10-13.

---

## Homepage (`/`)

| Category | Score |
|---|---|
| Performance | 72 |
| Accessibility | 91 |
| Best Practices | 100 |
| SEO | 92 |

### Core Web Vitals

| Metric | Value | Status |
|---|---|---|
| FCP | 2.4 s | Needs improvement |
| LCP | 7.5 s | Poor |
| TBT | 70 ms | Good |
| CLS | 0 | Good |
| Speed Index | 2.4 s | Needs improvement |

### Root cause: LCP 7.5 s

**Primary issue: redirect chain.** Lighthouse traced two unnecessary hops:
`bobby-washburn.com` → `www.bobby-washburn.com` → `bobby-washburn.com`.
This wastes ~1.6 s before a byte of HTML loads.

**BLOCKED-ON-BOBBY:** In the Vercel domain settings, choose one canonical
host (either `bobby-washburn.com` or `www.bobby-washburn.com`) and ensure
the other does a single 301 redirect with no bounce-back. This alone is
expected to bring LCP from 7.5 s to ~5.5-6 s.

Secondary issues (after fixing the redirect):
- 108 KB unused Next.js JS - acceptable for app size; consider lazy-loading
  Recharts on `/docs/adhd` with `next/dynamic` to save ~150 KB on other routes
- GA4 script adds ~71 KB of unused JS on load

### Accessibility issues (3)

| Issue | Impact | Current state |
|---|---|---|
| `color-contrast` | Moderate | Open. `text-primary` (`#9F0000`) on some backgrounds fails the 4.5:1 ratio. Audit which surfaces and adjust small text. |
| `link-name` | Serious | Fixed in code, not yet re-measured. Logo links and LinkedIn links in `header.tsx` and `footer.tsx` have an `aria-label`. |
| `landmark-one-main` | Moderate | Fixed in code, not yet re-measured. `app/(app)/page.tsx` wraps homepage content in `<main>`. |

---

## ADHD Deep Dive (`/docs/adhd`)

| Category | Score |
|---|---|
| Performance | 75 |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 100 |

### Core Web Vitals

| Metric | Value | Status |
|---|---|---|
| FCP | 2.4 s | Needs improvement |
| LCP | 6.1 s | Poor |
| TBT | 70 ms | Good |
| CLS | 0 | Good |
| Speed Index | 2.4 s | Needs improvement |

Root cause is the same redirect chain (1.6 s wasted). After fixing the redirect,
LCP on content pages is expected in the 4-5 s range, which would likely reach
a "Needs improvement" score (60-89).

---

## Summary

| Page | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| Homepage | 72 | 91 | 100 | 92 |
| /docs/adhd | 75 | 96 | 100 | 100 |

The redirect chain is the single largest performance issue and affects every
page. Fixing it is a Vercel domain config change, not a code change.

After the redirect fix, the remaining LCP is likely to come from the hero
section loading (Motion animations, large hero images, or the video on
Services). These are post-launch optimization targets.

---

## Post-launch performance targets

After the redirect fix:

| Metric | Current | Target |
|---|---|---|
| Performance | 72 | 85+ |
| LCP | 7.5 s | 4 s or less |
| Accessibility | 91 | 95+ |

Quickest wins after the redirect:
1. Re-measure to confirm the `link-name` and `landmark-one-main` fixes
2. Lazy-load Recharts on `/docs/adhd` with `next/dynamic` (Perf, ~150 KB)
3. Audit `text-primary` contrast on non-hero surfaces (A11y, medium)
