# Roles and Permissions

Two separate identity systems. They never check each other.

---

## Payload admin users (site operators)

**Who:** Bobby and any moderators he creates. Login at `/admin`.

**How they exist:** Created at `/admin/create-first-user` (Bobby's account) or `/admin/users` (new moderators). Stored in `payload_cms.users`. These accounts have no relation to visitor accounts.

**Roles** (set on the `Users` collection `role` field):

| Role | Default | What they can do in `/admin` |
|---|---|---|
| `admin` | No | Full read/write/delete on all Payload collections and globals. Bobby's account. |
| `moderator` | Yes (default on new user creation) | Can read and update `community_posts`, `community_comments`, `community_reports`, `visitor_profiles` (status only). Cannot access financial data, course content editing, or site settings. |

The access control functions in each collection (`isAdmin`) currently check only that a Payload session exists (`!!user`), not the specific role. This means all logged-in Payload users currently have equal access. Per-role Payload access controls are a post-launch hardening task.

**How to create a moderator:**
1. Bobby logs in to `/admin`
2. Navigate to Users collection
3. Create new user with email + temporary password
4. Set role to `Moderator`
5. Share credentials with the moderator, have them reset their password

---

## Visitor accounts (site members)

**Who:** Parents and professionals who sign up at `/sign-in`. Login handled by Neon Auth.

**How they exist:** After sign-up, visitors must complete `/welcome` to create a `visitor_profiles` record. The profile record holds their role.

**Roles** (set on the `VisitorProfiles` collection `userRole` field):

| Role | Who | What they can access |
|---|---|---|
| `parent` | Parents | Community posts/comments with `audience: "parent"` or `audience: "all"`. Courses. Own profile. |
| `professional` | Peer support professionals, therapists, etc. | Community posts/comments with `audience: "professional"` or `audience: "all"`. Courses. Own profile. |

Audience enforcement happens server-side in `app/(app)/community/post/[id]/page.tsx` and the community feed query. The API routes (`/api/community/*`) re-verify the session and profile before writing.

**Suspension:** Bobby can set `status: "suspended"` on a `visitor_profiles` record in `/admin`. The `requireProfile()` helper in `lib/auth/require.ts` redirects suspended visitors to `/sign-in?error=suspended`.

**How to suspend a visitor:**
1. Bobby logs in to `/admin`
2. Navigate to Visitor Profiles collection
3. Find the profile by display name or user ID
4. Set status to Suspended, save

---

## What is NOT currently enforced

- Granular Payload RBAC (admin vs. moderator) -- all logged-in Payload users have equal access to all collections. Post-launch task.
- Rate limiting persistence across Vercel serverless instances -- in-memory only; resets on cold start. Acceptable for launch.
