# Parent Content Sync — Apps Script Setup (Pain Points + Awareness Modules only)

**Status:** reference documentation only — this is not runnable by Claude Code. Bobby
pastes the script below into a **brand-new, standalone** Apps Script project at
script.google.com and runs `syncParentFacingContent()` by hand, from the function
dropdown, whenever he has new or updated content ready.

This is a **completely separate script from `drive_content_sync_setup.md`'s** (the
Research Bible pipeline). Do not add anything here to that project, and do not add
anything from that project here — they must be able to change or break independently.
The only things they share are the target repo and the generic GitHub REST helpers on
the webhook side (`lib/github/contents.ts`) — nothing at the Apps Script layer.

## What it does

1. **No trigger, ever.** There is no `setup()` function here and nothing installs a
   time-based trigger. Bobby runs `syncParentFacingContent()` manually from the Apps
   Script editor whenever he wants to sync — as often or as rarely as he likes. A run
   against an unchanged folder is a no-op.
2. On each manual run, lists files in a single Drive folder (the one whose ID goes in
   `content/sync-config.json`'s `parentFacingContent.driveFolderId`) modified since the
   last run.
3. Persists "last run" as a timestamp in this project's own `PropertiesService` (script
   properties) — separate storage from the bible script's, since this is a separate
   Apps Script project entirely.
4. For each changed file matching `PainPoint_*.md` or `Module_*.md`, POSTs
   `{ fileId, fileName }` to `/api/webhooks/parent-content-sync`, with an
   `X-Webhook-Secret` header matching `PARENT_CONTENT_WEBHOOK_SECRET` (a different
   secret from the bible pipeline's `WEBHOOK_SECRET`).
5. The webhook route (`app/api/webhooks/parent-content-sync/route.ts`) does the actual
   fetch-from-Drive / parse / validate / dedup / GitHub-PR work — this script's only job
   is "tell the webhook what changed."

Any other file in the folder is filtered out here (not sent) — and even if sent, the
webhook itself 400s on any filename that isn't `PainPoint_*.md` or `Module_*.md`.

## Script

```javascript
const CONFIG = {
  // content/sync-config.json -> parentFacingContent.driveFolderId
  driveFolderId: "111KCplYo8z-HccO-tnRRGr0apxtxQUeq",
  webhookUrl: "https://bobby-washburn.com/api/webhooks/parent-content-sync",
  // Must match the PARENT_CONTENT_WEBHOOK_SECRET env var on Vercel exactly.
  // NOT the same value as the bible pipeline's WEBHOOK_SECRET.
  webhookSecret: "REPLACE_WITH_PARENT_CONTENT_WEBHOOK_SECRET",
};

const LAST_RUN_PROPERTY_KEY = "parentContentSync_lastRunIso";

/**
 * The only function in this project. Run it manually from the Apps Script
 * editor's function dropdown whenever there's new/updated content ready.
 * Nothing calls this automatically — there is no trigger.
 */
function syncParentFacingContent() {
  const props = PropertiesService.getScriptProperties();
  const lastRunIso = props.getProperty(LAST_RUN_PROPERTY_KEY) || "1970-01-01T00:00:00.000Z";
  const runStartedAt = new Date().toISOString();

  const query =
    `'${CONFIG.driveFolderId}' in parents and trashed = false and modifiedTime > '${lastRunIso}'`;

  let pageToken = null;
  let syncedCount = 0;
  do {
    const response = Drive.Files.list({
      q: query,
      fields: "nextPageToken, files(id, name, modifiedTime)",
      pageToken: pageToken,
    });

    (response.files || []).forEach((file) => {
      if (!/^(PainPoint|Module)_.*\.md$/i.test(file.name)) return;
      postToWebhook(file.id, file.name);
      syncedCount++;
    });

    pageToken = response.nextPageToken;
  } while (pageToken);

  props.setProperty(LAST_RUN_PROPERTY_KEY, runStartedAt);
  Logger.log(`Done. Checked for changes since ${lastRunIso}. Sent ${syncedCount} file(s) to the webhook.`);
}

function postToWebhook(fileId, fileName) {
  const payload = {
    fileId: fileId,
    fileName: fileName,
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: { "X-Webhook-Secret": CONFIG.webhookSecret },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(CONFIG.webhookUrl, options);
  Logger.log(`${fileName}: HTTP ${response.getResponseCode()} — ${response.getContentText()}`);
}
```

## Setup steps (Bobby)

1. In Apps Script (script.google.com), create a **new** project — do not reuse or add
   to the project backing `drive_content_sync_setup.md`.
2. Enable the **Drive API advanced service** (`Drive.Files.list` above needs it):
   Services (+) → Google Workspace APIs → "Drive API" → Add.
3. Paste the script above. `CONFIG.driveFolderId` is already filled in (matches
   `content/sync-config.json`'s `parentFacingContent.driveFolderId`) — just fill in
   `CONFIG.webhookSecret` to match the `PARENT_CONTENT_WEBHOOK_SECRET` env var you set
   on Vercel.
4. Select `syncParentFacingContent` from the function dropdown and click Run
   (authorize when prompted). This is also how you run every future sync — there's no
   separate one-time setup step, because there's no trigger to install.
5. Confirm the Triggers panel (clock icon, left sidebar) shows **no triggers at all**
   for this project — that's expected and correct, not a missing step.

## Running a sync

Whenever there's new or updated Pain Point / Awareness Module content ready in the
`Parent Facing Content` Drive folder:

1. Open this Apps Script project.
2. Select `syncParentFacingContent` from the function dropdown, click Run.
3. Check the execution log for what got sent and the webhook's response per file.
4. Review and merge the resulting PR(s) on GitHub, same as any other content PR.

A run against a folder with nothing new since the last run sends nothing and is a
no-op — safe to run as often as you want, "just in case."

## Known limitations

- No retry/backoff on webhook failures — a failed POST is logged (Apps Script
  execution log) but not retried automatically. Since this is manual-only anyway, the
  fix is simply: fix whatever's wrong, then run `syncParentFacingContent()` again. If
  the file's `modifiedTime` hasn't changed since the failed attempt, temporarily edit
  `LAST_RUN_PROPERTY_KEY`'s stored value back (Project Settings → Script Properties) or
  just re-save the file in Drive to bump its `modifiedTime`.
- Single folder only, matching this pipeline's scope (`parentFacingContent`). Deep Dive
  Page ingestion (`Website Copy` folder, `DeepDive_*.md`) is a later phase — not this
  script's job, and not this repo's webhook's job either yet.
