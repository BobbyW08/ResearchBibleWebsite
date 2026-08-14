# Parent Content Pipeline — Claude Code Handoff

**Goal:** extend the already-working Research Bible Drive→GitHub-PR pipeline to also cover Pain Point Pages and Awareness Modules, so all three content types are Drive-authored → auto-synced → PR → Bobby merges. This doc is the spec for that extension. It corrects two factual errors in an earlier draft of this doc — see "Corrections" below — verify against the live codebase before starting, don't assume this doc is still accurate by the time you read it.

## Corrections from the prior version of this doc

1. **Pain Point Pages and Awareness Modules render via the `painPoints` / `awarenessModules` Keystatic collections at `/help/[slug]`** — `content/pain-points/*.yaml` and `content/awareness-modules/*.yaml`, both YAML data files, not MDX. They do **not** go through `content/docs/`. `/docs/[topic]` is a separate, unrelated Fumadocs collection (36 hand-authored deep-dive pages) — do not touch it as part of this work.
2. **The `parent-content-builder` skill has now been fully rewritten and matches §2 below exactly** (done 2026-08-13, via Claude Desktop/Cowork, outside this repo). Earlier drafts of this doc went back and forth on whether this fix had actually landed — it has, now. Still not your job to touch the skill itself (it lives outside this repo, in Claude Desktop's skill storage) — but §2 is no longer speculative, it's the live contract.

## What's already built and working — reference pattern, don't change

- Research bible pipeline: `content/research-bibles/*/index.mdx` Keystatic collection, `/research/[slug]` route, `lib/research-bibles/{parse,frontmatter,render-mdx}.ts`, `lib/google/drive.ts`, `lib/github/contents.ts`, and the bible half of `app/api/webhooks/drive-content-sync/route.ts`. Fully coded, unit-tested (`lib/research-bibles/parse.test.ts`, 15/15 passing), `lint`/`tsc` clean. **Merged to `main` and deployed** (PR #1, merged 2026-08-13) — this is no longer branch-only work. The Apps Script trigger for the `researchBibles` Drive folder is installed and confirmed running (`setup()` executed successfully). **Still not proven:** a real end-to-end run — dropping an actual `RB_*.md` file in Drive and confirming it produces a real PR — hasn't happened yet. That's the one open item on the bible half, separate from the pain-point build below.
  - Note for context: while PR #1 was open, a second, independent commit landed directly on `main` that also touched `lib/research-bibles/parse.ts` (title extraction/changelog logic) with a regressed approach — it reintroduced Setext-title support and dropped the filename-based changelog fallback, both of which CLAUDE.md documents as verified-wrong/needed based on real Drive files. That commit's version was discarded in favor of this branch's version when resolving the merge conflict. If you see that alternate approach referenced anywhere (e.g. in git history), it was superseded — don't reintroduce it.
- Keystatic schema for `painPoints` and `awarenessModules` (`keystatic.config.ts`) — already complete. Has every field needed: `cardTeaser`, `tag`, `icon`, `crisis`, per-age-band scenarios, etc. **Do not change this schema.**
- The 10 live pain-point YAML files (`content/pain-points/*.yaml`) and 2 awareness-module files (`content/awareness-modules/*.yaml`) already conform to this schema. Use them as ground truth for exact field shapes — e.g. `content/pain-points/meltdowns.yaml` and `content/awareness-modules/modern.yaml`.
- The `Parent Facing Content` Drive folder is real and wired: `content/sync-config.json`'s `parentFacingContent.driveFolderId` is set (see §1). Nothing has been dropped in it yet by the updated skill — it's plumbing-ready, not yet content-tested.

## What you're building

### 1. `content/sync-config.json` — already done

The `parentFacingContent.driveFolderId` entry is already set to the real folder (`111KCplYo8z-HccO-tnRRGr0apxtxQUeq`, from Bobby's Drive share link). Nothing to do here — just confirming it's live so you don't overwrite it with a placeholder.

### 2. Source-file contract (what the skill produces in Drive now)

Files land in the `Parent Facing Content` Drive folder as `PainPoint_[Name].md` or `Module_[Name].md`. This is the exact frontmatter + section-header shape the live, updated `parent-content-builder` skill now produces — verified against the skill definition itself, not just described secondhand. If a real file ever looks different from this, the parser is wrong or the skill drifted, not this contract — flag the mismatch rather than silently adapting.

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
defaultAge: "6-9"            # one of 2-5 / 6-9 / 10-12 / 13+
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

## Age Scenario: 2-5
<text>

## Age Scenario: 6-9
<text>

## Age Scenario: 10-12
<text>

## Age Scenario: 13+
<text>

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

**Awareness Module frontmatter:** same shape minus `defaultAge`, `deepDiveLabel`, `deepDiveHref`; `type: awareness-module` instead.

**Awareness Module body:** `## Intro` then one or more repeatable `## Section: <Heading>` blocks — each becomes one `sections[]` entry, its paragraphs split into `p`/`stat` blocks same as pain points' `whatHappening`.

### 3. New parser — `lib/pain-points/parse.ts`

Mirror `lib/research-bibles/parse.ts`'s style (hand-rolled, no new dependencies — same "no general YAML/Markdown parser dependency" rule CLAUDE.md already enforces for bibles).

- Frontmatter parse: check whether `lib/research-bibles/frontmatter.ts`'s YAML parser can be generalized and reused rather than duplicated. If the schemas diverge too much to share cleanly, a second small hand-rolled parser scoped to this schema is fine — same pattern, not a new abstraction.
- Section-splitter keyed on `## Heading` / `### Subheading` markers into the structures above.
- **Hard validation — reject with a clear structured error, never open a partial PR:**
  - `status` missing or not exactly `ready` → skip silently, not an error (file just isn't finished yet)
  - `crisis` missing or not literal `true`/`false`
  - `icon` not one of the 12 approved values — list the valid options in the error message
  - Any field or section still containing a placeholder marker (`NEEDS SLUG`, `TODO`, `[GAP:`, `[ACCURACY FLAG:`)
  - `deepDiveHref` or any `related[].href` not starting with `/docs/` or `/help/`
  - Any required section missing for the declared `type`

### 4. Webhook route — `app/api/webhooks/drive-content-sync/route.ts`

- Add a `folderKey === "parentFacingContent"` branch alongside the existing `researchBibles` one. Classify by filename prefix: `PainPoint_*.md` vs `Module_*.md`, same pattern as the existing `RB_*.md` regex check.
- Add `handlePainPointSync` and `handleAwarenessModuleSync`, structurally mirroring `handleBibleSync`: fetch from Drive → parse → validate → dedup (hash the parsed field set, not the raw file, since whitespace/formatting shouldn't trigger a resync) → build the YAML file content matching the exact Keystatic shape → branch → `putFile` → `openPullRequest`, reusing the existing generic `lib/github/contents.ts` helpers unchanged.
- `featured` (pain points only) is **site-owned**, same pattern as the bible's `tags`/`noindex`: default `false` on first sync, never touched on resync — Bobby sets it manually in Keystatic.
- PR description should list which fields are new/changed, in the same spirit as the bible flow's changelog summary in its PR body.

### 5. Apps Script — `drive_content_sync_setup.md`

Extend the reference script to poll **two** Drive folders (`researchBibles` + `parentFacingContent`), each with its own `folderKey` and filename filter, both posting to the same webhook. This file is documentation only — Bobby pastes the updated script into Apps Script himself; you're not running it.

### 6. Testing

- Unit tests for the new parser, built from fixtures that reverse-engineer the real `meltdowns.yaml` and `modern.yaml` content back into the §2 source-file contract shape.
- `npm run build && npm run lint && npx tsc --noEmit` must all exit zero before any commit — no exceptions, per CLAUDE.md.
- Before wiring the automatic write path: hand-craft one real `PainPoint_*.md` test file matching §2, run its output through `/keystatic`'s own editor once (once Keystatic's GitHub App env vars are set — see CLAUDE.md's Keystatic CMS section) to confirm your generated YAML round-trips cleanly, same caution CLAUDE.md already documents for the bible flow.

### 7. Retire the old topic-doc pipeline — sequence this last

Only after §1–6 are live and producing correct PRs for real test content:

1. Delete `app/api/refresh`, `app/api/research-bible/notify-change`.
2. Delete the `pending_reviews` table and `/api/account/pending-reviews/*` routes.
3. Remove the old `adhd` docId/sheetId entry from `content/sync-config.json`.

Don't do this first — the 12 live `/help/*` pages must not go dark mid-migration.

### 8. CLAUDE.md

Once this lands, update: the Research Bible Ingestion Pipeline section's scope note (currently says "bible sync only"), the Site Map's dormant-routes table (once §7 is done), and remove the now-stale Open Items bullet about `painPoints`/`awarenessModules` missing `cardTeaser`/`crisis` fields — those fields already exist; the gap was always the Drive-side skill and webhook, not the schema.

## Manual steps only Bobby can do

1. ~~Create the `Parent Facing Content` Drive folder and supply its real ID.~~ Done — folder ID is already in `content/sync-config.json`.
2. Confirm `GITHUB_CONTENT_SYNC_TOKEN` and `WEBHOOK_SECRET` are set in Vercel Production (already an open item for the bible half too — same variables cover both).
3. Update and re-run the Apps Script per §5.

## Verification checklist

- [ ] Unit tests pass for the new parser
- [ ] `npm run build && npm run lint && npx tsc --noEmit` all clean
- [ ] A hand-crafted `PainPoint_*.md` test payload produces a PR whose merged diff renders correctly at `/help/<slug>` and matches the shape of the 10 existing hand-authored entries
- [ ] Same for one `Module_*.md` test payload
- [ ] Missing/invalid `crisis`, bad `icon`, and placeholder-marker cases all reject with clear errors — no PR opened
- [ ] Re-sending an unchanged file is a no-op (dedup guard works for this content type too)
- [ ] An unrelated file dropped in either Drive folder never reaches a write path (400, ignored)
- [ ] Old pipeline removal (§7) only happens after the above is proven against real content, not just fixtures

## Explicitly not in scope for this round

- Deep Dive Pages ingestion (`Website Copy` Drive folder, `DeepDive_*.md`) — later phase, once the parent/practitioner content split is actually prioritized. The `parent-content-builder` skill already has a Deep Dive Page format defined for when that phase starts.
- Any access gate on `/help/` or `/research/` pages.
- Fixing the `parent-content-builder` skill itself — separate task, outside this repo.
