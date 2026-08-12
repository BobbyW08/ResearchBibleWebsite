# Drive Content Sync — Apps Script Setup (Research Bibles only)

**Status:** reference documentation only — this is not runnable by Claude Code. Bobby
pastes the script below into Apps Script (script.google.com) himself, fills in `CONFIG`,
and runs `setup()` once from the Apps Script editor to install the time-driven trigger.

This covers **only** the `researchBibles` Drive folder → `/api/webhooks/drive-content-sync`
webhook. It is a separate script from the existing `drive_sync_setup/` and `notify_change.gs`
files at the repo root, which serve the live old Doc/Sheet pipeline (`/api/refresh`,
`/api/research-bible/notify-change`) — **do not touch those**, they're unrelated and still in
use for their own topics.

## What it does

1. On a time-driven trigger (every N minutes, your choice — 15 is reasonable for a
   low-traffic internal folder), lists files in a single Drive folder (the one whose ID goes
   in `content/sync-config.json`'s `researchBibles.driveFolderId`) modified since the last
   run.
2. Persists "last run" as a timestamp in `PropertiesService` (script properties), so each run
   only looks at what changed since the previous run — no full folder re-scan every time.
3. For each changed file, POSTs `{ fileId, fileName, folderKey: "researchBibles" }` to the
   webhook, with an `X-Webhook-Secret` header matching `WEBHOOK_SECRET`.
4. The webhook route (`app/api/webhooks/drive-content-sync/route.ts`) does the actual
   fetch-from-Drive / parse / dedup / GitHub-PR work — this script's only job is "tell the
   webhook what changed."

Only files matching `RB_*.md` are treated as bibles by the webhook — anything else in that
folder currently 400s with `{ success: false, error: "not yet supported" }`. Filtering by
filename here too (rather than just relying on the webhook to reject) avoids firing pointless
webhook calls for every unrelated file someone drops in the folder.

## Script

```javascript
const CONFIG = {
  // content/sync-config.json -> researchBibles.driveFolderId
  driveFolderId: "REPLACE_WITH_RESEARCH_BIBLES_FOLDER_ID",
  webhookUrl: "https://bobby-washburn.com/api/webhooks/drive-content-sync",
  // Must match the WEBHOOK_SECRET env var on Vercel exactly.
  webhookSecret: "REPLACE_WITH_WEBHOOK_SECRET",
  folderKey: "researchBibles",
};

const LAST_RUN_PROPERTY_KEY = "driveContentSync_lastRunIso";

function setup() {
  // Removes any pre-existing trigger for this function before creating a
  // fresh one, so re-running setup() is idempotent.
  ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === "checkForChanges")
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger("checkForChanges")
    .timeBased()
    .everyMinutes(15)
    .create();

  // Seed last-run so the first real run doesn't try to sync every file ever
  // placed in the folder.
  PropertiesService.getScriptProperties().setProperty(
    LAST_RUN_PROPERTY_KEY,
    new Date().toISOString(),
  );

  Logger.log("Trigger installed. Run checkForChanges() manually any time to test.");
}

function checkForChanges() {
  const props = PropertiesService.getScriptProperties();
  const lastRunIso = props.getProperty(LAST_RUN_PROPERTY_KEY) || "1970-01-01T00:00:00.000Z";
  const runStartedAt = new Date().toISOString();

  const query =
    `'${CONFIG.driveFolderId}' in parents and trashed = false and modifiedTime > '${lastRunIso}'`;

  let pageToken = null;
  do {
    const response = Drive.Files.list({
      q: query,
      fields: "nextPageToken, files(id, name, modifiedTime)",
      pageToken: pageToken,
    });

    (response.files || []).forEach((file) => {
      if (!/^RB_.*\.md$/i.test(file.name)) return;
      postToWebhook(file.id, file.name);
    });

    pageToken = response.nextPageToken;
  } while (pageToken);

  props.setProperty(LAST_RUN_PROPERTY_KEY, runStartedAt);
}

function postToWebhook(fileId, fileName) {
  const payload = {
    fileId: fileId,
    fileName: fileName,
    folderKey: CONFIG.folderKey,
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

1. In Apps Script (script.google.com), create a new project (or reuse an existing one scoped
   to this purpose — do not add this to the script backing the old `notify_change.gs`
   pipeline, keep them separate).
2. Enable the **Drive API advanced service** (`Drive.Files.list` above needs it): Services (+)
   → Google Workspace APIs → "Drive API" → Add.
3. Paste the script above, fill in `CONFIG.driveFolderId` (matches
   `content/sync-config.json`'s `researchBibles.driveFolderId`) and `CONFIG.webhookSecret`
   (matches the `WEBHOOK_SECRET` env var on Vercel).
4. Run `setup()` once manually from the editor (authorize when prompted).
5. Optionally run `checkForChanges()` manually once to confirm it doesn't error before relying
   on the trigger.
6. Confirm the trigger exists: Triggers (clock icon in the left sidebar) should show
   `checkForChanges` on a time-based 15-minute schedule.

## Known limitations

- No retry/backoff on webhook failures — a failed POST is logged (Apps Script execution log)
  but not retried until the next changed-file scan, and even then only if the file's
  `modifiedTime` still falls after the (now-advanced) `lastRunIso` cutoff. A file that fails to
  sync and isn't touched again in Drive will need a manual re-save (or a manual
  `checkForChanges()` run after temporarily rolling back `lastRunIso`) to retry.
- Single folder only, matching this round's bibles-only scope — extending to a second folder
  for pain-point/module sync is explicitly out of scope (see CLAUDE.md's Content Sync
  Pipeline section) and would need its own `folderKey` + filename-matching branch here.
