# Parent Content Pipeline — Claude Code Handoff (v5)

**Supersedes `Research-Content-Pipeline-Handoff-v4.md` and `-v3.md`.** Leave both in place at the repo root for history, but treat this file as current — verify against the live codebase before starting either way, since docs can drift from reality.

## What changed from v4

v4 wired the new sync in as a second branch inside the *existing* bible webhook route, and a second function inside the *existing* bible Apps Script project. **That's wrong — Bobby wants Pain Points/Awareness Modules on a genuinely separate pipeline from Research Bibles, not a shared one with an if-branch.** The two should be able to change, break, or get rebuilt independently without either touching the other.

**What "separate" means here, precisely — this is the one thing that changed from v4:**
- **Its own webhook endpoint**, not a new branch in `app/api/webhooks/drive-content-sync/route.ts`.
- **Its own, standalone Apps Script project** (a second script.google.com project), not a second function bolted onto the bible's script.
- **Its own pipeline-specific code** (parsing, frontmatter serialization, validation) in its own files — not shared with or "generalized" out of `lib/research-bibles/*`.
- **It's still fine to call the same low-level, content-agnostic utility code** — `lib/google/drive.ts`'s `fetchDriveFileContent()` and `lib/github/contents.ts`'s REST client (`createBranch`, `putFile`, `openPullRequest`, etc.). Those are generic API wrappers with zero bible-specific logic in them; reusing them isn't "sharing the pipeline," it's not reinventing an HTTP client. Everything that actually encodes *how this content type works* gets its own code.

Everything else — the source-file contract, validation rules, the manual-only trigger model, the retirement plan — is unchanged from v4/v3 and reproduced here in full so Claude Code has one authoritative file to build from.

**Explicitly:** do not touch `app/api/webhooks/drive-content-sync/route.ts` or the existing Apps Script project as part of this work. Not a new branch, not a new function, not even a shared constant. If you find yourself editing either of those two things, stop — that's the v4 mistake repeating itself.

## Goal

Build a second, independent Drive→GitHub-PR pipeline — same *pattern* as the Research Bible pipeline (Drive doc → parse → validate → PR → Bobby reviews and merges), but its own code, its own endpoint, its own trigger — covering Pain Point Pages and Awareness Modules. Manually triggered, not scheduled: Bobby writes/edits this content in bursts, and runs a sync only when something's ready, unlike the bible pipeline's 15-minute auto-poll.

## What's already built and working — reference pattern only, don't touch and don't extend

- Research bible pipeline: `content/research-bibles/*/index.mdx` Keystatic collection, `/research/[slug]` route, `lib/research-bibles/{parse,frontmatter,render-mdx}.ts`, and `app/api/webhooks/drive-content-sync/route.ts`. Fully coded, unit-tested, merged and deployed, with its own 15-minute Apps Script trigger installed and running. **This whole pipeline is a reference to build the new one in the same spirit — it is not a foundation to extend or branch off of.**
- Keystatic schema for `painPoints` and `awarenessModules` (`keystatic.config.ts`) — already complete: `cardTeaser`, `tag`, `icon`, `crisis`, a single all-ages `exampleScenario`, etc. **Do not change this schema.** (The age-band picker/per-age-band scenario fields that used to be here were removed site-wide — see the Pain Point Pages section of `CLAUDE.md`.)
- The 10 live pain-point YAML files (`content/pain-points/*.yaml`) and 2 awareness-module files (`content/awareness-modules/*.yaml`) already conform to this schema. Use them as ground truth for exact field shapes — e.g. `content/pain-points/meltdowns.yaml` and `content/awareness-modules/modern.yaml`.
- The `Parent Facing Content` Drive folder is real and wired: `content/sync-config.json`'s `parentFacingContent.driveFolderId` is set. Nothing has been dropped in it yet by the `parent-content-builder` skill — it's plumbing-ready, not content-tested.
- Generic, reusable helpers — safe to call from the new pipeline as-is, no changes needed: `lib/google/drive.ts` (`fetchDriveFileContent(fileId)`) and `lib/github/contents.ts` (`getDefaultBranchSha`, `createBranch`, `getFileSha`, `getFileContent`, `putFile`, `updateFile`, `openPullRequest`).

## What you're building

### 1. `content/sync-config.json` — already done

`parentFacingContent.driveFolderId` is already set to the real folder (`111KCplYo8z-HccO-tnRRGr0apxtxQUeq`). Nothing to do here — this is a plain data file, not pipeline code, so there's no separation concern with it being alongside `researchBibles`' entry.

### 2. Source-file contract (what the skill produces in Drive now)

Files land in the `Parent Facing Content` Drive folder as `PainPoint_[Name].md` or `Module_[Name].md`. This is the exact frontmatter + section-header shape the `parent-content-builder` skill produces. If a real file ever looks different from this, the parser is wrong or the skill drifted — flag the mismatch rather than silently adapting.

**Pain Point frontmatter:**

```yaml
---
status: ready               # draft | ready — anything other than exactly "ready" is ignored, not an error
type: pain-point
slugName: meltdowns
icon: Flame                  # must exactly match one of the 12 approved values (see keystatic.config.ts PAIN_POINT_ICON_OPTIONS)
tag: "Meltdowns & tantrums"
title: "My kid melts down over everything"
cardTeaser: "Why tiny triggers cause huge reactions — and what to do in the moment."
headline: "Why your kid loses it over small things (and what to do when it happens)"
crisis: false                 # must be an explicit boolean — human-confirmed by whoever authored the file
deepDiveLabel: "De-Escalation and Crisis Planning"
deepDiveHref: /docs/de-escalation-crisis-planning
related:
  - label: "My kid hits, bites, or throws things"
    href: /help/aggression
  - label: "Morning chaos — routines"
    href: /help/routines
---
```

**Pain Point body** (Markdown, section headers are the parse keys):

```markdown
## Intro
<one paragraph>

## Example Scenario
<one paragraph illustrating the pattern, written to apply across ages — not tied to a specific age band>

## What's Happening
<one or more paragraphs — each becomes one `whatHappening` block, discriminant "p">

## Why This Usually Makes It Worse
### <backfire title>
<backfire body>
### <backfire title 2>
<backfire body 2>

## Try This Week
### <try title>
<try body>
### <try title 2>
<try body 2>

## When To Get More Support
<text>
```

**Awareness Module frontmatter:** same shape minus `deepDiveLabel`, `deepDiveHref`; `type: awareness-module` instead.

**Awareness Module body:** `## Intro` then one or more repeatable `## Section: <Heading>` blocks — each becomes one `sections[]` entry, its paragraphs split into `p`/`stat` blocks same as pain points' `whatHappening`.

### 3. New pipeline-specific code — `lib/parent-content/`

New directory, sibling to `lib/research-bibles/`, not inside it and not importing from it. Same *style* (hand-rolled, no new dependencies — the "no general YAML/Markdown parser dependency" rule CLAUDE.md enforces for bibles applies here too), but its own code:

- `lib/parent-content/parse.ts` — frontmatter + section-header parsing for the §2 contract, producing the pain-point/module field structures. Do not import or "generalize" `lib/research-bibles/parse.ts` — that file is scoped to the bible's `# Research Bible: <Title>` H1 format and changelog extraction, none of which applies here. Write this one fresh, scoped to this schema only.
- `lib/parent-content/frontmatter.ts` — hand-rolled YAML serializer that emits the exact `content/pain-points/*.yaml` / `content/awareness-modules/*.yaml` shape (plain YAML data file, not an MDX-with-frontmatter file like bibles — there's no `---`/body split here, the whole file is the YAML). Again, don't try to reuse or generalize `lib/research-bibles/frontmatter.ts` — that one's docstring is explicit that it's purpose-built to the bible schema only; write a second small hand-rolled serializer scoped to this schema, same pattern, separate file.
- **Hard validation — reject with a clear structured error, never open a partial PR:**
  - `status` missing or not exactly `ready` → skip silently, not an error (file just isn't finished yet)
  - `crisis` missing or not literal `true`/`false`
  - `icon` not one of the 12 approved values — list the valid options in the error message
  - Any field or section still containing a placeholder marker (`NEEDS SLUG`, `TODO`, `[GAP:`, `[ACCURACY FLAG:`)
  - `deepDiveHref` or any `related[].href` not starting with `/docs/` or `/help/`
  - Any required section missing for the declared `type`

### 4. New, standalone webhook route — `app/api/webhooks/parent-content-sync/route.ts`

A new route file at a new path — not a branch inside the bible route.

- Own auth: a **new, dedicated** secret, e.g. `PARENT_CONTENT_WEBHOOK_SECRET` (separate Vercel env var from the bible's `WEBHOOK_SECRET`), same timing-safe-compare pattern against an `X-Webhook-Secret` header. Keeping the secret separate means rotating or leaking one never affects the other endpoint.
- Own module-level in-memory rate limiter (a fresh token bucket, just by virtue of living in its own file — don't import the bible route's).
- Body: `{fileId, fileName}`. No `folderKey` field needed — this route only ever handles one folder, so there's nothing to switch on. Classify by filename prefix: `PainPoint_*.md` → pain point handling, `Module_*.md` → awareness-module handling; anything else 400s.
- Flow, per file: fetch from Drive (`lib/google/drive.ts`, shared helper) → parse + validate (`lib/parent-content/parse.ts`) → dedup (hash the parsed field set, not the raw file, since whitespace/formatting shouldn't trigger a resync — own dedup store/logic, separate from the bible route's) → build the YAML via `lib/parent-content/frontmatter.ts` → branch → `putFile` → `openPullRequest` (both from the shared `lib/github/contents.ts` — fine to reuse, see above).
- `featured` (pain points only) is **site-owned**: default `false` on first sync, never touched on resync — Bobby sets it manually in Keystatic.
- PR description should list which fields are new/changed.
- Reuses `GITHUB_CONTENT_SYNC_TOKEN` (same env var the bible route already uses) for the actual GitHub write — that's a shared credential for the same repo, not shared pipeline logic, so no need to mint a second PAT.
- **The route has no concept of "manual" vs "auto."** It's just an authenticated HTTP endpoint — it behaves identically whether the POST came from a script Bobby ran by hand or (hypothetically) a scheduled job. The manual-only property lives entirely in §5 below — there is no trigger for this route, period.

### 5. New, standalone Apps Script project — manual trigger only

A **second, separate** Apps Script project at script.google.com — not a new function added to the existing bible script. Bobby creates it fresh (or you write the script for him to paste in, same as the bible one was handed to him).

- `CONFIG`: `driveFolderId` = the `parentFacingContent` folder ID, `webhookUrl` = the new `/api/webhooks/parent-content-sync` endpoint, `webhookSecret` = the new `PARENT_CONTENT_WEBHOOK_SECRET` value.
- One function, e.g. `syncParentFacingContent()`: list files in the folder, filter to `PainPoint_*.md` / `Module_*.md`, compare each file's `modifiedTime` against a stored cutoff (its own script property, e.g. `LAST_RUN_ISO`, local to this project — there's no shared state with the bible script because it's a different project entirely), POST each changed file to the new webhook.
- **No trigger is installed, ever, for this project.** To run a sync, Bobby opens this (separate) Apps Script project at script.google.com, selects `syncParentFacingContent` from the function dropdown, and clicks Run. Nothing fires on its own. He can run it as often or as rarely as he wants; a run against an unchanged folder is a no-op.
- Document this as its own file — extend `drive_content_sync_setup.md`'s scope, or add a new sibling doc (e.g. `parent_content_sync_setup.md`) at repo root — whichever you judge reads more clearly, but keep the two scripts' instructions clearly separated rather than interleaved in one doc, so nobody mistakes "run this function" instructions for the bible script's.

### 6. Testing

- Unit tests for `lib/parent-content/parse.ts` and `frontmatter.ts`, built from fixtures that reverse-engineer the real `meltdowns.yaml` and `modern.yaml` content back into the §2 source-file contract shape.
- `npm run build && npm run lint && npx tsc --noEmit` must all exit zero before any commit — no exceptions, per CLAUDE.md.
- Before wiring the write path: hand-craft one real `PainPoint_*.md` test file matching §2, run its output through `/keystatic`'s own editor once (once Keystatic's GitHub App env vars are set) to confirm your generated YAML round-trips cleanly.
- Manually exercise `syncParentFacingContent()` from its own Apps Script editor against a real test file, and confirm nothing about the bible pipeline's behavior, trigger, or state changed as a result.

### 7. Retire the old topic-doc pipeline — sequence this last

Only after §1–6 are live and producing correct PRs for real test content:

1. Delete `app/api/refresh`, `app/api/research-bible/notify-change`.
2. Delete the `pending_reviews` table and `/api/account/pending-reviews/*` routes.
3. Remove the old `adhd` docId/sheetId entry from `content/sync-config.json`.

Don't do this first — the 12 live `/common-pain-points/*` pages must not go dark mid-migration.

### 8. CLAUDE.md

Once this lands, add a **new, sibling section** — "Parent Content Sync Pipeline" — next to (not nested inside) "Research Bible Ingestion Pipeline." Make clear in the prose that these are two independent pipelines sharing only generic Drive-fetch/GitHub-write utility code, each with its own webhook route, its own Apps Script project, and its own trigger model (bibles: auto every 15 minutes; parent content: manual-only). Also:
- Update the Research Bible Ingestion Pipeline section's scope note (currently says pain-point/module sync is "in progress").
- The Site Map's dormant-routes table, once §7 is done.
- Remove the now-stale Open Items bullet about `painPoints`/`awarenessModules` missing `cardTeaser`/`crisis` fields — those fields already exist; the gap was always the Drive-side skill and webhook, not the schema.

## Manual steps only Bobby can do

1. ~~Create the `Parent Facing Content` Drive folder and supply its real ID.~~ Done — folder ID is already in `content/sync-config.json`.
2. Add a new `PARENT_CONTENT_WEBHOOK_SECRET` env var in Vercel Production (a new secret, deliberately not reusing the bible's `WEBHOOK_SECRET`). Confirm `GITHUB_CONTENT_SYNC_TOKEN` is still set (already an open item for the bible half; this pipeline reuses it).
3. Create the new, standalone Apps Script project per §5 and paste in the script Claude Code hands you. **Do not add anything to the existing bible Apps Script project.**
4. Run a sync whenever there's new/updated content ready to publish — open the new (separate) Apps Script project, run `syncParentFacingContent()`, then review and merge the resulting PR(s) like any other content PR.

## Verification checklist

- [ ] Unit tests pass for the new parser/frontmatter modules
- [ ] `npm run build && npm run lint && npx tsc --noEmit` all clean
- [ ] A hand-crafted `PainPoint_*.md` test payload produces a PR whose merged diff renders correctly at `/common-pain-points/<slug>` and matches the shape of the 10 existing hand-authored entries
- [ ] Same for one `Module_*.md` test payload
- [ ] Missing/invalid `crisis`, bad `icon`, and placeholder-marker cases all reject with clear errors — no PR opened
- [ ] Re-sending an unchanged file is a no-op (dedup guard works for this content type too)
- [ ] An unrelated file dropped in the folder never reaches a write path (400, ignored)
- [ ] Running `syncParentFacingContent()` twice in a row with no new content is a no-op both times
- [ ] `app/api/webhooks/drive-content-sync/route.ts` has zero diff from before this work started — confirm via `git diff` before opening a PR
- [ ] The bible Apps Script project has zero changes — a second, fully separate project exists instead
- [ ] The Apps Script Triggers panel for the new project shows no triggers at all
- [ ] Old pipeline removal (§7) only happens after the above is proven against real content, not just fixtures

## Explicitly not in scope for this round

- Any automatic/scheduled trigger for the `parentFacingContent` folder — deliberately manual-only per §5. Do not add one without Bobby explicitly asking for it.
- Any code sharing between `lib/parent-content/*` and `lib/research-bibles/*` beyond the generic `lib/google/drive.ts` / `lib/github/contents.ts` helpers already called out above.
- A one-click admin page or button for triggering a sync (bypassing the Apps Script editor) — a reasonable future nicety, not this round.
- Deep Dive Pages ingestion (`Website Copy` Drive folder, `DeepDive_*.md`) — later phase, once the parent/practitioner content split is actually prioritized. The `parent-content-builder` skill already has a Deep Dive Page format defined for when that phase starts.
- Any access gate on `/common-pain-points/` or `/research/` pages.
- Fixing the `parent-content-builder` skill itself — separate task, outside this repo.
