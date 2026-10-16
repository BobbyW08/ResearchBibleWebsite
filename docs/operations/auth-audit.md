# Authorization Audit

## API Routes

| Route | Method | Auth check | Guard |
|---|---|---|---|
| `/api/auth/[...path]` | GET, POST | Public (Neon Auth proxy) | Neon Auth handles internally |
| `/api/auth/set-role` | POST | `auth.getSession()` + `emailVerified` | Session + verified email + duplicate guard |
| `/api/account/profile` | PATCH | `auth.getSession()`, profile by userId | Session |
| `/api/community/posts` | GET | `auth.getSession()`, profile | Session + profile |
| `/api/community/posts` | POST | `auth.getSession()`, profile, suspension check, rate limit | Session + profile + 429 |
| `/api/community/posts/edit` | PATCH, DELETE | `auth.getSession()`, profile, author match, 15 minute edit window | Session + ownership |
| `/api/community/comments` | POST | `auth.getSession()`, profile, suspension check, rate limit | Session + profile + 429 |
| `/api/community/comments/edit` | PATCH, DELETE | `auth.getSession()`, profile, author match, 15 minute edit window | Session + ownership |
| `/api/community/report` | POST | `auth.getSession()`, rate limit (10 per hour) | Session + 429 |
| `/api/courses/complete` | POST | `auth.getSession()` | Session |
| `/api/interest-signups` | POST | No auth (public sign-up) | Email validation + dedup |
| `/api/org-inquiry` | POST | No auth (public form) | Field validation |
| `/api/search` | GET | No auth (public search on public content) | None |
| `/api/webhooks/drive-content-sync` | POST | `X-Webhook-Secret` header, `timingSafeEqual` | Shared secret (`WEBHOOK_SECRET`) + rate limit |
| `/api/webhooks/parent-content-sync` | POST | `X-Webhook-Secret` header, `timingSafeEqual` | Shared secret (`PARENT_CONTENT_WEBHOOK_SECRET`) + rate limit |

Payload's own REST routes live under `app/(payload)/api/[...slug]` and use each collection's `access` rules.

## Gated Pages (App Router)

| Route | Guard | Redirect when missing |
|---|---|---|
| `/welcome` | `auth.getSession()` | `/sign-in` |
| `/account` | `auth.getSession()`, profile | `/sign-in` or `/welcome` |
| `/account/[path]` | Middleware cookie check only (Neon Auth `AccountView`) | `/sign-in` |
| `/community` | `auth.getSession()`, profile | `/sign-in` or `/welcome` |
| `/community/post/[id]` | `auth.getSession()`, profile | `/sign-in` or `/welcome` |
| `/courses` | `auth.getSession()`, profile | `/sign-in` or `/welcome` |
| `/courses/[slug]` | `auth.getSession()`, profile | `/sign-in` or `/welcome` |
| `/courses/[slug]/[lesson-slug]` | `auth.getSession()`, profile, suspension check | `/sign-in`, `/welcome`, or `/sign-in?error=suspended` |
| `/sign-in` | None | None |

## Middleware (`middleware.ts`)

The middleware checks for a Neon Auth session cookie on `/account/*`, `/community/*` and `/courses/*` and redirects to `/sign-in` when none is present. This is a defense-in-depth check only. Every gated page except `/account/[path]` also runs its own server-side session check. Next 16 deprecates this file name in favor of `proxy.ts` (see `docs/operations/launch-review.md`).

## Known gaps

- Payload role checks: only `VisitorProfiles` checks admin vs. moderator. `Users` has no `access` block. See `docs/operations/auth.md`.
- Suspension is checked only on new posts, new comments and lesson pages. `requireProfile()` exists in `lib/auth/require.ts` but is not called.
- `/api/interest-signups` and `/api/org-inquiry` are public by design and have no CAPTCHA.
- Webhook routes rely on a shared secret in a header. `WEBHOOK_SECRET` is in git history and must be rotated (BLOCKED-ON-BOBBY).
