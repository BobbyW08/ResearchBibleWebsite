# Keystatic — How to Edit Site Content

Keystatic is the admin panel for editing content on bobby-washburn.com without touching code. It lives at `/keystatic` on the site. Every save writes a real commit to the GitHub repo — Keystatic is a UI on top of GitHub, not a separate database.

## Is it working right now?

**Not yet in production.** Three things have to happen first:

1. Four environment variables need to be set in the Vercel project (Production): `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. Without these, the site's production build fails outright — the route handler checks for them at build time.
2. The GitHub App backing Keystatic needs its production callback URL registered: `https://bobby-washburn.com/api/keystatic/github/oauth/callback`.
3. Someone needs to actually log in once and confirm a save creates a real commit — this hasn't been proven end-to-end yet.

Until those are done, `/keystatic` is reachable but won't let you log in and save. This guide describes how it will work once that's done.

## Logging in

1. Go to `https://bobby-washburn.com/keystatic`.
2. Click through the GitHub login. You'll need to be a **collaborator on the `BobbyW08/ResearchBibleWebsite` GitHub repo** — Keystatic's write permission is GitHub's own permission model, not a separate password. If someone else needs edit access, add them as a repo collaborator first.
3. You'll land on a list of collections and singletons (see below).

## What you can and can't edit here

**Editable via Keystatic:**

| What | Where it shows up on the site |
|---|---|
| Testimonials | Homepage testimonials marquee |
| Pain Points (10 entries) | `/help/[slug]` pages — Meltdowns, Screens, Won't Listen, Anxiety, Bedtime, Homework, Aggression, Routines, Teen, Burnout |
| Awareness Modules (2 entries) | `/help/modern`, `/help/mentalhealth` |
| Research Bibles | `/research/[slug]` pages (once entries exist) |
| FAQ | Homepage FAQ accordion |
| Footer | Site-wide footer links and text |
| About Page | `/about` |
| Site Settings | Substack subdomain, Cal.com booking URL (not yet wired to anything live — see CLAUDE.md) |

**NOT editable via Keystatic** — these are hand-authored files that live only in the codebase, not the CMS: the 36 `/docs/[topic]` deep-dive pages (`content/docs/*.mdx`) and the ADHD dashboard data (`content/data/*.json`). Changing those requires editing the file directly and committing, or asking Claude Code to do it.

## Making an edit

1. Click into a collection (e.g. "Pain Points") to see the list of entries, or a singleton (e.g. "FAQ") to go straight to its one form.
2. Click an entry to open its edit form. Every field on the live page is editable here — headline, intro, age-band scenarios, "why this backfires" items, etc.
3. Make your change, then hit **Save**.

**Important: Save publishes immediately.** Keystatic is configured to commit straight to the `main` branch — there's no draft or review step for hand-edits made this way (unlike content synced in from Google Drive, which goes through a GitHub pull request Bobby reviews before it goes live). Once you save, Vercel picks up the change and it's live on the site within a minute or two. Double-check before saving, especially on anything crisis/safety-related (the `crisis` checkbox on Pain Points and Awareness Modules).

## A few field-specific notes

- **Slug fields** (e.g. a Pain Point's `slugName`) control the URL. Changing one breaks any existing links to that page — avoid changing slugs on already-published entries.
- **Icon fields** are a fixed dropdown, not free text — you're picking from a preset list of icons already built into the site.
- **The `crisis` checkbox** controls whether the page shows 988 / Crisis Text Line / 211 resources. Treat this as a real judgment call, not a default toggle.
- **Research Bible `version` field** is described as auto-computed — don't hand-edit it once the Drive sync pipeline is live; it's meant to be system-managed.

## If something looks wrong after a save

Every Keystatic save is a real GitHub commit, so you can always see exactly what changed and who changed it in the repo's commit history on `main`. If a save produces something broken, the fix is either another Keystatic edit or a commit reverting the specific change — nothing is unrecoverable.
