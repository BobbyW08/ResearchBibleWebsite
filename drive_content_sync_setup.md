# Drive Content Sync — Apps Script Setup (Research Bibles + Parent Facing Content)

**Status:** reference documentation only — this is not runnable by Claude Code. Bobby
pastes the script below into Apps Script (script.google.com) himself, fills in `CONFIG`,
and runs `setup()` once from the Apps Script editor to install the time-driven trigger.

This covers **both** the `researchBibles` and `parentFacingContent` Drive folders →
`/api/webhooks/drive-content-sync` webhook. It is a separate script from the existing
`drive_sync_setup/` and `notify_change.gs` files at the repo root, which serve the live old
Doc/Sheet pipeline (`/api/refresh`, `/api/research-bible/notify-change`) — **do not touch
those**, they're unrelated and still in use for their own topics.

## What it does

1. On a time-driven trigger (every N minutes, your choice — 15 is reasonable for a
   low-traffic internal setup), lists files in **each configured Drive folder** (currently
   two: `content/sync-config.json`'s `researchBibles.driveFolderId` and
   `parentFacingContent.driveFolderId`) modified since the last run.
2. Persists "last run" as a timestamp in `PropertiesService` (script properties), so each run
   only looks at what changed since the previous run — no full folder re-scan every time. The
   timestamp is shared across both folders (one `checkForChanges()` pass covers both).
3. For each changed file, POSTs `{ fileId, fileName, folderKey }` to the webhook — `folderKey`
   is whichever folder's config entry matched — with an `X-Webhook-Secret` header matching
   `WEBHOOK_SECRET`.
4. The webhook route (`app/api/webhooks/drive-content-sync/route.ts`) does the actual
   fetch-from-Drive / parse / dedup / GitHub-PR work — this script's only job is "tell the
   webhook what changed."

Only files matching each folder's expected filename pattern are POSTed — `RB_*.md` for
`researchBibles`, `PainPoint_*.md` or `Module_*.md` for `parentFacingContent`. Anything else in
either folder is skipped here (never reaches the webhook), and would 400 with
`{ success: false, error: "not yet supported" }` if it somehow did. Filtering by filename here
too (rather than just relying on the webhook to reject) avoids firing pointless webhook calls
for every unrelated file someone drops in a folder.

## Script

```javascript
const FOLDERS = [
  {
    // content/sync-config.json -> researchBibles.driveFolderId
    driveFolderId: "REPLACE_WITH_RESEARCH_BIBLES_FOLDER_ID",
    folderKey: "researchBibles",
    fileNamePattern: /^RB_.*\.md$/i,
  },
  {
    // content/sync-config.json -> parentFacingContent.driveFolderId
    driveFolderId: "REPLACE_WITH_PARENT_FACING_CONTENT_FOLDER_ID",
    folderKey: "parentFacingContent",
    fileNamePattern: /^(PainPoint|Module)_.*\.md$/i,
  },
];

const CONFIG = {
  webhookUrl: "https://bobby-washburn.com/api/webhooks/drive-content-sync",
  // Must match the WEBHOOK_SECRET env var on Vercel exactly.
  webhookSecret: "REPLACE_WITH_WEBHOOK_SECRET",
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
  // placed in either folder.
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

  FOLDERS.forEach((folder) => {
    const query =
      `'${folder.driveFolderId}' in parents and trashed = false and modifiedTime > '${lastRunIso}'`;

    let pageToken = null;
    do {
      const response = Drive.Files.list({
        q: query,
        fields: "nextPageToken, files(id, name, modifiedTime)",
        pageToken: pageToken,
      });

      (response.files || []).forEach((file) => {
        if (!folder.fileNamePattern.test(file.name)) return;
        postToWebhook(file.id, file.name, folder.folderKey);
      });

      pageToken = response.nextPageToken;
    } while (pageToken);
  });

  props.setProperty(LAST_RUN_PROPERTY_KEY, runStartedAt);
}

function postToWebhook(fileId, fileName, folderKey) {
  const payload = {
    fileId: fileId,
    fileName: fileName,
    folderKey: folderKey,
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: { "X-Webhook-Secret": CONFIG.webhookSecret },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(CONFIG.webhookUrl, options);
  Logger.log(`${fileName} (${folderKey}): HTTP ${response.getResponseCode()} — ${response.getContentText()}`);
}
```

## Setup steps (Bobby)

1. In Apps Script (script.google.com), open the existing project used for the `researchBibles`
   trigger (do not add this to the script backing the old `notify_change.gs` pipeline, keep
   them separate).
2. Enable the **Drive API advanced service** (`Drive.Files.list` above needs it), if not
   already enabled: Services (+) → Google Workspace APIs → "Drive API" → Add.
3. Replace the existing script with the updated version above. Fill in both
   `FOLDERS[0].driveFolderId` (`researchBibles.driveFolderId`) and
   `FOLDERS[1].driveFolderId` (`parentFacingContent.driveFolderId` — matches
   `content/sync-config.json`), plus `CONFIG.webhookSecret` (matches the `WEBHOOK_SECRET` env
   var on Vercel).
4. Run `setup()` once manually from the editor (re-running is safe/idempotent — it replaces
   the existing trigger and reseeds the last-run timestamp).
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
- Both folders share one `lastRunIso` cutoff and one trigger — adding a third folder later
  means adding a third `FOLDERS` entry, not a new trigger.
