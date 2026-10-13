# Auth Operations

## Architecture

Two completely independent auth systems coexist.

| System | Used for | Entry point |
|---|---|---|
| Payload CMS auth | `/admin` only | `/admin/create-first-user` (first run) |
| Neon Auth (Better Auth) | Site visitors | `/api/auth/[...path]` → proxied to Neon |

Never cross-check the two. Payload auth never reaches visitor routes; Neon Auth never reaches `/admin`.

## Email verification

Email verification is enforced in `requireSession()` (`lib/auth/require.ts`). A user whose `emailVerified` flag is false is redirected to `/sign-in?error=unverified`. The verification email is sent by Neon Auth automatically on sign-up. If a user did not receive it, they can request a new one via the sign-in page.

## Moderator role matrix

Admin users in Payload can have `role: admin` or `role: moderator`.

| Collection / Global | Admin | Moderator |
|---|---|---|
| Posts | Full CRUD | Read + Update status |
| Comments | Full CRUD | Read + Update status |
| Reports | Full CRUD | Read + Update status |
| Visitor Profiles | Full CRUD | Read + Update status |
| Deep Dives | Full CRUD | No access |
| Pain Points | Full CRUD | No access |
| Awareness Modules | Full CRUD | No access |
| Research Bibles | Full CRUD | No access |
| Courses | Full CRUD | No access |
| Lessons | Full CRUD | No access |
| Testimonials | Full CRUD | No access |
| All Globals | Full CRUD | No access |

Moderator role enforcement is currently Payload's collection-level access rules — at launch, both roles use `isAdmin = !!user` (any authenticated Payload user). A full per-role moderator access matrix is a post-launch hardening item.

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
3. Bobby deletes from Payload in this order (Local API or `/admin`).
   Order matters: child records before parent records.
   - `lesson-progress` where `userId = <id>`
   - `enrollments` where `userId = <id>`
   - `entitlements` where `userId = <id>`
   - `community_reports` where `reporterUserId = <id>` (see note below)
   - `comments` where `author = <profileId>`
   - `posts` where `author = <profileId>`
   - `visitor-profiles` where `userId = <id>`
4. Bobby removes the user from the Neon Auth admin panel.
5. Bobby confirms deletion to the user.

Note on reports: The `community_reports` collection stores the reporter's `userId`. Deleting these removes the record of who filed reports. An alternative is to set `reporterUserId` to an anonymized value (e.g., `deleted-user`) rather than deleting the report, which preserves the moderation audit trail. Bobby decides which approach to take.

A self-service delete action on `/account` is a post-launch backlog item.

## Suspended profiles

Setting `visitor-profiles.status = "suspended"` in `/admin` blocks the user from:
- Accessing `/community`, `/courses`, `/account` (redirected to `/sign-in?error=suspended`)
- POSTing to `/api/community/posts` or `/api/community/comments`

The session itself remains valid; only Payload-backed routes enforce the suspension. Revoking the Neon Auth session is a separate step Bobby can take in the Neon Auth admin.

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
