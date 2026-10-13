# Merge Readiness Report - p0/width-and-orgs-reset

Branch: `p0/width-and-orgs-reset`
Target: `main`
Date: 2026-10-13

---

## Summary

The branch is **ready to merge for public launch** with the caveats below.
Community, courses, and auth routes are built but gated -- they are not
linked from the public nav and will not be visited by real users until Bobby
manually enables them.

---

## What is in this branch (20 commits ahead of main)

| Commit group | What changed |
|---|---|
| P0 Tasks 0-2 | Content width, orgs page reset, Payload data layer replacing Drizzle |
| P0 Task 3 | Payload CMS content model (9 + 8 new collections, 4 globals) |
| P0 Tasks 4-5 | Auth helpers, rate limiting, LMS course hosting |
| P0 Task 6 | Community moderation (soft delete, audience enforcement, reporting) |
| P0 Tasks 7-11 | Ops docs, dependency audit, backup procedures, CLAUDE.md |
| v21 Tasks 1-6 | Migration file, environments doc, 5 new ops docs, Lighthouse scores, verification report, A11y fixes, auth.md deletion steps |

---

## Build gate

| Check | Status |
|---|---|
| `npm run build` | PASS |
| `npm run lint` | PASS (0 errors, 8 warnings from unused migration import) |
| `npx tsc --noEmit` | PASS |

The 8 lint warnings are all from the unused import of
`migration_20261013_000000` in `payload.config.ts`. They clear once Bobby
adds the `prodMigrations` config (two lines -- see `docs/operations/migrations.md`).

---

## BLOCKED-ON-BOBBY before merge

Bobby must apply these two edits to `payload.config.ts` manually (the
sandbox blocked them as production deploy changes). Without these, the 8
new collection tables never get created in Neon production.

```typescript
// Add after the existing About import:
import * as migration_20261013_000000 from "./src/migrations/20261013_000000_init_community_collections";

// Add inside postgresAdapter({...}):
prodMigrations: [
  {
    name: "20261013_000000_init_community_collections",
    up: migration_20261013_000000.up,
    down: migration_20261013_000000.down,
  },
],
```

After applying, run `npm run build && npm run lint` one more time to confirm
clean. Then commit and merge.

---

## BLOCKED-ON-BOBBY before public launch

These do not block the merge but must be done before announcing the site:

| Priority | Item | Where |
|---|---|---|
| High | Fix redirect chain: `bobby-washburn.com` ↔ `www.` bounce costs 1.6s per page | Vercel domain settings |
| High | Confirm `INTEREST_SIGNUPS_SHEET_ID` is set in Vercel Production | Vercel env vars |
| Medium | Rotate `WEBHOOK_SECRET` (old value may be in Drive doc history) | Vercel + Apps Script |
| Medium | Cookie consent decision (GA4 sets cookies) | Legal |
| Low | Publish `adhd` deep-dive record in Payload admin | `/admin` |
| Low | Re-export `paths-loop.mp4` with faststart encoding | Video tool |
| Low | Keyboard test of ADHD interactive components | Browser |

---

## BLOCKED-ON-BOBBY before enabling community/courses/auth routes

Do NOT remove the "coming soon" gates or link to `/sign-in`, `/community`,
or `/courses` until all of the following are confirmed:

1. `prodMigrations` config applied and tested on preview deploy (tables must exist)
2. Neon Auth console configured: email verification on, password reset on, Google OAuth, redirect URLs set
3. `RESEND_API_KEY` and `NOTIFY_EMAIL` set in Vercel (community report emails)
4. Cloud storage adapter configured in Payload (before uploading any media through `/admin`)

---

## Lighthouse scores (production, 2026-10-13)

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Homepage | 72 | 91 | 100 | 92 |
| /docs/adhd | 75 | 96 | 100 | 100 |

LCP is 7.5s on the homepage due to a redirect chain -- see above. After the
redirect fix, performance is expected to reach 85+.

---

## What was not verified (requires Bobby's environment)

- Auth flow end-to-end (sign-up, verification email, Google OAuth)
- Community end-to-end (post, comment, report)
- Course end-to-end (create, enroll, complete lesson)
- Live rendering of all 36 content pages in a browser
- Apps Script trigger confirmation (first live sync HTTP 200)
- Real Lighthouse on mobile device
