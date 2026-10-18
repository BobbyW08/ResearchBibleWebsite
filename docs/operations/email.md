# Email

## Current state

**Resend is not yet configured.** The community report notification route (`app/api/community/report/route.ts`) imports Resend and attempts to send an email when a report is submitted, but it is guarded by an env var check:

```typescript
if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
  // send email
}
```

Without both variables, report submissions are still saved to the Payload `reports` collection (table `community_reports`) - only the email notification is skipped.

## What email is used for

One use case: moderation report notifications. When a visitor submits a report, an email goes to `NOTIFY_EMAIL` so Bobby knows to check the Payload admin.

No other transactional email is in scope at launch. Password reset and auth emails are handled by Neon Auth directly.

## Setup (before enabling community)

**BLOCKED-ON-BOBBY:**

1. Create a Resend account at resend.com.
2. Add and verify a sender domain (e.g. `notifications@bobby-washburn.com`).
3. Create an API key with Send permission only.
4. Set `RESEND_API_KEY` in Vercel Production and Preview scopes.
5. Set `NOTIFY_EMAIL` to the address that should receive report notifications.

The sender is hardcoded as `notifications@bobby-washburn.com` in `app/api/community/report/route.ts`. Verify that domain in Resend, or change the `from` address to match the domain that is verified.

## Env vars required

| Variable | Value | Scope |
|---|---|---|
| `RESEND_API_KEY` | API key from Resend dashboard | Production + Preview |
| `NOTIFY_EMAIL` | Bobby's notification email address | Production + Preview |
