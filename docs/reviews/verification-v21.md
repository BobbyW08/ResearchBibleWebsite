# Verification Report - v21 Sprint

Run against: `p0/width-and-orgs-reset` branch, 2026-10-13.

Items marked **BLOCKED-ON-BOBBY** require Bobby's environment (live Neon Auth,
Apps Script, browser interaction) and cannot be verified by Claude Code.

---

## A. Platform

| # | Item | Result | Notes |
|---|---|---|---|
| 1 | `npm run build`, `npm run lint`, `npx tsc --noEmit` all clean | PASS | 0 errors; 8 warnings (all from unused import of migration module -- will clear when Bobby adds `prodMigrations` config) |
| 2 | `/admin` loads and every collection and global is visible | BLOCKED-ON-BOBBY | Requires live Neon Auth session |
| 3 | Admin login works and session persists | BLOCKED-ON-BOBBY | |
| 4 | `/admin` not accessible to unauthenticated visitor | PASS (code) | Payload's own auth guards `/admin`; middleware.ts does not cover `/admin` but Payload's auth layer rejects unauthenticated requests |
| 5 | Anonymous REST to every private collection returns 401/403 | PASS (code) | All community/courses collections use `read: isAdmin` which requires a Payload session |

---

## B. Content in Payload (preview database)

| # | Item | Result | Notes |
|---|---|---|---|
| 6 | 10 pain points published | PASS | 10 confirmed in DB |
| 7 | 2 awareness modules published | PASS | 2 confirmed |
| 8 | 5 testimonials present | PASS | 10 present (exceeds minimum) |
| 9 | FAQ, Footer, Site Settings, About globals present | PASS | All 4 rows confirmed |
| 10 | 36 deep dives published | PARTIAL | 35 published + 1 draft (`adhd`). The `/docs/adhd` page uses a dedicated route (`app/(app)/docs/adhd/page.tsx`) that does not query Payload -- it works regardless of the DB status. The prose version (`adhd` in the dynamic route) would serve the draft. Flag for Bobby: publish the `adhd` deep-dive record in Payload admin so `/docs/adhd` has a published fallback. |

---

## C. Rendering

All items require browser verification against the live or preview URL.

| # | Item | Result | Notes |
|---|---|---|---|
| 11 | `/common-pain-points` shows 10 cards | BLOCKED-ON-BOBBY | Route file exists: `app/(app)/common-pain-points/page.tsx` |
| 12 | `/common-pain-points/meltdowns` renders | BLOCKED-ON-BOBBY | Route file exists: `app/(app)/common-pain-points/[slug]/page.tsx` |
| 13 | `/common-pain-points/modern` renders as module | BLOCKED-ON-BOBBY | Route and data confirmed: `modern` is in `awareness_modules` |
| 14 | `/docs` shows 36 topics under 4 pillars | BLOCKED-ON-BOBBY | Route: `app/(app)/docs/page.tsx` |
| 15 | `/docs/understanding-behavior` renders prose | BLOCKED-ON-BOBBY | Slug `understanding-child-behavior` confirmed published in DB |
| 16 | `/docs/adhd` renders all 8 components | BLOCKED-ON-BOBBY | Route: `app/(app)/docs/adhd/page.tsx`. All 8 components present in `components/mdx/adhd/` |
| 17 | `/about-bobby` renders from About global | BLOCKED-ON-BOBBY | Route: `app/(app)/about-bobby/page.tsx`; About global confirmed in DB |
| 18 | Homepage loads from Payload | BLOCKED-ON-BOBBY | Testimonials (10), FAQ (6 items) confirmed in DB |

---

## D. Pipelines and Apps Script

| # | Item | Result | Notes |
|---|---|---|---|
| 19 | Apps Script bible trigger shows HTTP 200 | BLOCKED-ON-BOBBY | |
| 20 | Test file produces a bible draft | BLOCKED-ON-BOBBY | |
| 21 | Publishing draft goes live at `/research/[slug]` | BLOCKED-ON-BOBBY | |
| 22 | Parent-content local fixture produces draft | PARTIAL (code) | `lib/parent-content/parse.ts` exists and passes its own test suite. Webhook route `app/api/webhooks/parent-content-sync/route.ts` exists. End-to-end not tested. |
| 23 | Parent-content live sync with Apps Script | BLOCKED-ON-BOBBY | Apps Script project not yet created |

---

## E. Organizations and privacy

| # | Item | Result | Notes |
|---|---|---|---|
| 24 | Organizations page: no prices, four offer cards, form | BLOCKED-ON-BOBBY (browser) | Route `app/(app)/services/organizations/page.tsx` exists |
| 25 | Organizations link in header nav | PASS (code) | `header.tsx` line 40: `{ title: "Organizations", href: "/services/organizations" }` |
| 26 | Org inquiry form lands in Google Sheet | BLOCKED-ON-BOBBY | `INTEREST_SIGNUPS_SHEET_ID` must be confirmed set in Vercel Production |
| 27 | `/services/organizations/documents` renders | BLOCKED-ON-BOBBY (browser) | Route `app/(app)/services/organizations/documents/page.tsx` exists |
| 28 | `/privacy` renders | BLOCKED-ON-BOBBY (browser) | Route `app/(app)/privacy/page.tsx` exists |

---

## F. Authentication

All items require live Neon Auth configuration. BLOCKED-ON-BOBBY for all.

| # | Item | Status |
|---|---|---|
| 29 | New sign-up, verification email, `/welcome`, role pick, `/community` | BLOCKED-ON-BOBBY |
| 30 | Returning user skips `/welcome` | BLOCKED-ON-BOBBY |
| 31 | Unauthenticated `/community`, `/courses`, `/account` redirect | PASS (code) | `middleware.ts` matcher covers all three |
| 32 | Signed-out `/welcome` redirects to `/sign-in` | BLOCKED-ON-BOBBY |
| 33 | Password reset email works | BLOCKED-ON-BOBBY |
| 34 | Google sign-in works | BLOCKED-ON-BOBBY |
| 35 | Sign out clears session | BLOCKED-ON-BOBBY |
| 36 | `returnTo` rejects external URLs | BLOCKED-ON-BOBBY |

F31 passes by code inspection: `middleware.ts:29` matcher: `["/account/:path*", "/community/:path*", "/courses/:path*"]`.

---

## G. Community and moderation

All items require running app + DB tables. DB tables don't exist in production yet (see migrations). BLOCKED-ON-BOBBY for all.

---

## H. Courses

All items require running app + DB tables. BLOCKED-ON-BOBBY for all.

---

## I. Layout

| # | Item | Result | Notes |
|---|---|---|---|
| 49 | Content width holds at 1920, 1440, 1024, 768, 390 | PARTIAL | `app/(app)/layout.tsx` has no `max-w` constraint -- pages depend on individual section wrappers. The footer uses `max-w-[110rem] px-4 mx-auto` which gives a max width and a 16px gutter at mobile. Full multi-breakpoint visual check BLOCKED-ON-BOBBY. |

---

## New findings from this verification pass

1. **`landmark-one-main` (A11y) -- FIXED:** Homepage `app/(app)/page.tsx` had no `<main>` element. Added `<main className="flex-1 flex flex-col">` around the hero/content sections. Other pages already had `<main>` in their own structure. LinkedIn icon links in `footer.tsx` and `header.tsx` were missing `aria-label` -- fixed by adding `aria-label="LinkedIn"` to both.

2. **ADHD deep dive in draft:** The `adhd` Payload record is in `_status: draft`. The dedicated `/docs/adhd` page works regardless, but the prose fallback at `/docs/[adhd]` would hit a 404 (Payload query filters for `_status: published`). Bobby should publish the record in `/admin`.

3. **Redirect chain (Lighthouse):** `bobby-washburn.com` → `www.bobby-washburn.com` → `bobby-washburn.com` costs 1.6 s per page. See `docs/operations/lighthouse.md`.
