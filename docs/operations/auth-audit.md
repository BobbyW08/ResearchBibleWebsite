# Authorization Audit

## API Routes

| Route | Method | Auth check | Guard |
|---|---|---|---|
| `/api/auth/[...path]` | GET/POST/... | Public (Neon Auth proxy) | None needed — Neon Auth handles internally |
| `/api/auth/set-role` | POST | `auth.getSession()` + emailVerified check | Session + verified email + duplicate guard |
| `/api/account/profile` | PATCH | `auth.getSession()` → finds profile by userId | Session |
| `/api/community/posts` | GET | `auth.getSession()` → profile | Session + profile |
| `/api/community/posts` | POST | `auth.getSession()` → profile + suspension check + rate limit | Session + profile + 429 |
| `/api/community/comments` | POST | `auth.getSession()` → profile + suspension check + rate limit | Session + profile + 429 |
| `/api/interest-signups` | POST | No auth (public sign-up) | Email validation + dedup |
| `/api/org-inquiry` | POST | No auth (public form) | Field validation |
| `/api/search` | GET | No auth (public search on public content) | None |
| `/api/webhooks/drive-content-sync` | POST | `X-Webhook-Secret` header | Shared secret (WEBHOOK_SECRET) |
| `/api/webhooks/parent-content-sync` | POST | `X-Webhook-Secret` header | Shared secret (PARENT_CONTENT_WEBHOOK_SECRET) |

## Gated Pages (App Router)

| Route | Guard | Redirect when missing |
|---|---|---|
| `/welcome` | `auth.getSession()` | → `/sign-in` |
| `/account` | `auth.getSession()` → profile | → `/sign-in` or `/welcome` |
| `/community` | `auth.getSession()` → profile | → `/sign-in` or `/welcome` |
| `/community/post/[id]` | `auth.getSession()` → profile | → `/sign-in` or `/welcome` |
| `/courses/[slug]` | `auth.getSession()` → profile | → `/sign-in` or `/welcome` |
| `/courses/[slug]/[lesson-slug]` | `auth.getSession()` → profile | → `/sign-in` or `/welcome` |
| `/sign-in` | None | — |

## Middleware (`middleware.ts`)

The middleware checks Neon Auth cookies on `/community/*`, `/courses/*`, `/account`. This is a belt-and-suspenders check only — every gated page also runs its own server-side session check. Do NOT rely solely on the middleware cookie check.

## Known gaps

- Moderator role enforcement in Payload admin is currently `!!user` (any Payload user). Per-role access rules are a post-launch hardening item.
- `/api/interest-signups` and `/api/org-inquiry` are public by design but have no CAPTCHA.
- Webhook routes rely on a shared secret in a header — rotate `WEBHOOK_SECRET` and `PARENT_CONTENT_WEBHOOK_SECRET` if ever exposed.
