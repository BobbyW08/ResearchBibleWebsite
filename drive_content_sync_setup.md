# Drive Content Sync: Research Bible Pipeline

**Status:** reference documentation only. Bobby pastes the script below into Apps Script
(script.google.com), fills in `CONFIG`, and runs `setup()` once from the Apps Script editor to
install the time-driven trigger.

This covers the `researchBibles` Drive folder to `/api/webhooks/drive-content-sync` webhook only.
The parent-facing content pipeline has its own Apps Script project and secret; see
`parent_content_sync_setup.md`.

## What it does

1. Runs on a time-driven trigger (every 15 minutes by default). Lists files in the Drive folder
   (`content/sync-config.json` `researchBibles.driveFolderId`) modified since the last run.
2. Persists "last run" as a timestamp in `PropertiesService`, so each run only processes new
   or changed files.
3. For each `RB_*.md` file, POSTs `{ fileId, fileName, folderKey: "researchBibles" }` to the
   webhook with an `X-Webhook-Secret` header.
4. The webhook route (`app/api/webhooks/drive-content-sync/route.ts`) fetches the file from
   Drive, parses it, and writes a Payload draft in the `research-bibles` collection.
5. Bobby reviews and publishes drafts at `/admin`.

Only files matching `RB_*.md` are treated as bibles. Non-matching files in the folder are
silently skipped.

## Script

```javascript
const CONFIG = {
  // From content/sync-config.json -> researchBibles.driveFolderId
  driveFolderId: "YOUR_DRIVE_FOLDER_ID",
  webhookUrl: "https://bobby-washburn.com/api/webhooks/drive-content-sync",
  // Must match the WEBHOOK_SECRET env var in Vercel exactly.
  // Get this value from Vercel Dashboard -> Project -> Environment Variables.
  // Never commit this value to the repository.
  webhookSecret: "PASTE_SECRET_HERE",
  folderKey: "researchBibles",
};

const LAST_RUN_PROPERTY_KEY = "driveContentSync_lastRunIso";

function setup() {
  ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === "checkForChanges")
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger("checkForChanges")
    .timeBased()
    .everyMinutes(15)
    .create();

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

1. In Apps Script (script.google.com), create a new project scoped to this purpose. Do not
   reuse the parent-content project.
2. Enable the **Drive API advanced service**: Services (+) -> Google Workspace APIs -> "Drive
   API" -> Add.
3. Paste the script above. Fill in:
   - `CONFIG.driveFolderId`: from `content/sync-config.json` `researchBibles.driveFolderId`
   - `CONFIG.webhookSecret`: from Vercel Dashboard -> Project -> Environment Variables ->
     `WEBHOOK_SECRET`. Do not copy this value into the file — paste it directly into the script
     property in Apps Script.
4. Run `setup()` once manually from the editor. Authorize when prompted.
5. Optionally run `checkForChanges()` manually to confirm no errors.
6. Confirm the trigger: Triggers (clock icon) should show `checkForChanges` on a 15-minute
   schedule.

## Secret rotation (action required)

The previous version of this file contained the `WEBHOOK_SECRET` value in the repository.
That value is in git history. Bobby must rotate it:

1. Generate a new secret: `openssl rand -hex 32` (or any long random string).
2. Update `WEBHOOK_SECRET` in Vercel Production (Dashboard -> Project -> Environment Variables).
3. Update `CONFIG.webhookSecret` in the Apps Script project to match.
4. The old secret remains in git history. If this is a concern, contact Bobby about rewriting
   git history (destructive — requires force push and coordination).

## Known limitations

- No retry on webhook failures. A failed POST is logged in the Apps Script Executions log but
  not retried. A file that fails and is not touched again in Drive must be manually re-saved
  (or `checkForChanges()` run after temporarily rolling back `lastRunIso`) to retry.
- Single folder only; one `folderKey`. The parent-content pipeline is a separate script.
