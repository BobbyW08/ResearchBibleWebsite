# Auth Operations

## Architecture

Two completely independent auth systems coexist.

| System | Used for | Entry point |
|---|---|---|
| Payload CMS auth | `/admin` only | `/admin/create-first-user` (first run) |
| Neon Auth (Better Auth) | Site visitors | `/api/auth/[...path]` → proxied to Neon |

Never cross-check the two. Payload auth never reaches visitor routes; Neon Auth never reaches `/admin`.

## Email verification

Email verification is enforced when a visitor creates their profile: `/api/auth/set-role` rejects a session whose `emailVerified` flag is false. Every gated page redirects a visitor without a profile to `/welcome`, so an unverified visitor cannot reach community, courses or account content. The verification email is sent by Neon Auth on sign-up.

`lib/auth/require.ts` defines `requireSession()` (redirects unverified users to `/sign-in?error=unverified`) and `requireProfile()` (redirects suspended users), but no page or route calls them. Gated pages call `auth.getSession()` and look up the profile themselves.

## Admin roles as enforced

Payload users have `role: admin` or `role: moderator` (new users default to `moderator`).

| Collection / Global | Admin | Moderator |
|---|---|---|
| Visitor Profiles | Read, update, delete | Read; update `status` only; no delete |
| Users | Full CRUD (Payload default, no `access` block) | Full CRUD, including changing any user's `role` |
| Every other collection and global | Full CRUD | Same as admin |

Only `VisitorProfiles` checks the role. Every other collection uses an `isAdmin` helper that checks only `!!user`. Do not create moderator accounts until `Users` and the community collections check the role (see `docs/operations/launch-review.md`).

## Account recovery (manual)

If a user loses access to their email address and cannot sign in:

1. Bobby verifies the user's identity (photo ID or equivalent).
2. Bobby signs in to Neon Auth admin and locates the user account.
3. Bobby resets the email address to a new verified one using the admin API.
4. User signs in with the new email and sets a new password.

No self-service bypass is provided. This keeps the trust model simple.

## Account deletion

The privacy page promises deletion on request. Deletion is manual at launch:

1. User contacts Bobby via the contact email.
2. Bobby identifies the Neon Auth user ID from the admin panel.
3. Bobby deletes from Payload in this order (Local API or `/admin`), using collection slugs.
   Order matters: child records before parent records.
   - `lesson-progress` where `userId = <id>`
   - `enrollments` where `userId = <id>`
   - `entitlements` where `userId = <id>`
   - `reports` where `reporterUserId = <id>` (see note below)
   - `comments` where `author = <profileId>`
   - `posts` where `author = <profileId>`
   - `visitor-profiles` where `userId = <id>`
4. Bobby removes the user from the Neon Auth admin panel.
5. Bobby confirms deletion to the user.

Note on reports: The `reports` collection (table `community_reports`) stores the reporter's `userId`. Deleting these removes the record of who filed reports. An alternative is to set `reporterUserId` to an anonymized value (e.g., `deleted-user`) rather than deleting the report, which preserves the moderation audit trail. Bobby decides which approach to take.

A self-service delete action on `/account` is a post-launch backlog item.

## Suspended profiles

Setting `visitor-profiles.status = "suspended"` in `/admin` blocks the user from:
- Creating posts (`POST /api/community/posts`) and comments (`POST /api/community/comments`)
- Opening a lesson page (`/courses/[slug]/[lesson-slug]` redirects to `/sign-in?error=suspended`)

A suspended user can still read `/community`, `/community/post/[id]`, `/courses`, `/courses/[slug]` and `/account`, and can still call the post and comment edit routes, `/api/community/report`, `/api/courses/complete` and `/api/account/profile`. Wiring `requireProfile()` into those pages and routes closes this gap.

The session itself remains valid. Revoking the Neon Auth session is a separate step Bobby can take in the Neon Auth admin.

## BLOCKED-ON-BOBBY (Neon Auth console config)

Before auth flows are testable end-to-end, Bobby must confirm in the Neon Auth console:
- Email verification is required before sign-in
- Password reset is enabled
- Email sender is configured and delivers
- Google OAuth credentials are set
- Allowed redirect URLs include:
  - `https://www.bobby-washburn.com/api/auth/callback`
  - `https://bobby-washburn.com/api/auth/callback`
  - `http://localhost:3000/api/auth/callback`
