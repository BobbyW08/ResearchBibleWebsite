# Moderator Guide

## Overview

Moderation happens entirely in the Payload admin at `/admin`. Moderators are separate Payload admin accounts Bobby creates. Role checks are not yet enforced outside Visitor Profiles; see `docs/operations/auth.md` before creating a moderator account.

## Reviewing a report

1. Sign in at `/admin` with your moderator account.
2. Go to **Reports** in the left nav.
3. Filter by **Status: Open** to see unreviewed reports.
4. Click a report to see the target type, target ID, reason, and reporter's note.
5. Open the target (copy the target ID, navigate to **Posts** or **Comments**, find by ID).
6. Decide:
   - **Action:** set the post/comment status to `Hidden` or `Removed`, then set the report status to `Actioned` and fill in `resolvedAt`.
   - **Dismiss:** set the report status to `Dismissed` and fill in `resolvedAt`.

## Suspending a profile

1. Go to **Visitor Profiles** in the left nav.
2. Find the profile (search by display name or userId).
3. Set **Status** to `Suspended`.
4. Save.

Suspended profiles are immediately blocked from new posts, new comments and lesson pages. They can still read the community and edit their own recent posts; see "Suspended profiles" in `docs/operations/auth.md`. The Neon Auth session remains valid until it expires or Bobby revokes it in the Neon Auth admin.

## Hidden vs. Removed

| Status | Visible to members | Visible in admin |
|---|---|---|
| Visible | Yes | Yes |
| Hidden | No | Yes |
| Removed | No | Yes |

Use **Hidden** when content needs a second look or when you're unsure. Use **Removed** for confirmed violations.

## Pinning a post

1. Open the post in **/admin/collections/posts**.
2. Check **isPinned**.
3. Save.

The feed in `app/(app)/community/page.tsx` sorts by newest first only, so `isPinned` is stored but does not yet move a post to the top.

## BLOCKED-ON-BOBBY: email notifications

Report-filed emails require `RESEND_API_KEY`, a verified Resend sending domain, and `NOTIFY_EMAIL` set in Vercel Production. Until then, Bobby must check `/admin` manually for open reports.

## Community Guidelines

The Community Guidelines page is at `/community-guidelines`. It is not linked live yet - it needs Bobby's text review and approval before it is linked from the composer or footer.
