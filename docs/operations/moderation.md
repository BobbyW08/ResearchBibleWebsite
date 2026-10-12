# Moderator Guide

## Overview

Moderation happens entirely in the Payload admin at `/admin`. Moderators are separate Payload admin accounts Bobby creates. See the role matrix in `docs/operations/auth.md`.

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

Suspended profiles are immediately blocked from posting, commenting, and accessing gated routes. The Neon Auth session remains valid until it expires or Bobby revokes it in the Neon Auth admin.

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

Pinned posts appear at the top of the feed (the feed query sorts pinned posts first — implement in the feed query when ready).

## BLOCKED-ON-BOBBY: email notifications

Report-filed emails require `RESEND_API_KEY`, a verified Resend sending domain, and `NOTIFY_EMAIL` set in Vercel Production. Until then, Bobby must check `/admin` manually for open reports.

## Community Guidelines

The Community Guidelines page is at `/community-guidelines`. It is not linked live yet — it needs Bobby's text review and approval before it is linked from the composer or footer.
