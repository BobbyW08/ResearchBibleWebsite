# Google Drive → Website Content Sync — Setup Package

**Goal:** Edit the ADHD research bible Doc or dashboard-data Sheet in Google Drive →
site reflects it within minutes, no manual export.

**Two triggers, two mechanisms:**
| Content | Trigger type | Why |
|---|---|---|
| Research bible **Doc** (deep-dive prose) | Time-driven Apps Script check (every 5–10 min), fires only on real change | Docs have no native edit-event trigger in Apps Script |
| Dashboard-data **Sheet** | Installable `onEdit` trigger | Sheets support real edit events — this one is instant |

Both call the same webhook on your Next.js app, just with a different `type` and `topic`.

---

## Part 1 — Apps Script (paste into script.google.com, NOT your repo)

1. Go to [script.google.com](https://script.google.com) → New Project.
2. Name it something like `research-bible-sync`.
3. Replace `Code.gs` with the script below.
4. Update the `CONFIG` block: doc IDs, sheet ID, your webhook URL, and a shared secret.
5. Run `setup()` once manually (this creates both triggers and grants permissions).

```javascript
/**
 * research-bible-sync
 * Watches a Google Doc (via polling last-modified time) and a Google Sheet
 * (via real onEdit trigger) and calls a webhook on the Next.js site when
 * either changes.
 */

const CONFIG = {
  webhookUrl: 'https://YOUR-SITE.vercel.app/api/refresh',
  webhookSecret: 'REPLACE_WITH_A_LONG_RANDOM_STRING', // must match Next.js env var

  // One entry per topic whose Doc you want watched.
  // topic = the slug used in content/docs/[topic].mdx and content/data/[topic].json
  watchedDocs: [
    { topic: 'adhd', docId: 'REPLACE_WITH_ADHD_DOC_ID' },
  ],

  // The Sheet holding dashboard data (one tab per topic, or one sheet per topic — your call)
  dashboardSheetId: 'REPLACE_WITH_DASHBOARD_SHEET_ID',

  // How often to poll Doc modified-time, in minutes
  docCheckIntervalMinutes: 10,
};

/**
 * Run this once manually from the Apps Script editor to install both triggers.
 */
function setup() {
  // Clear any existing triggers from this project first (avoids duplicates on re-run)
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  // Time-driven trigger for Doc polling
  ScriptApp.newTrigger('checkWatchedDocs')
    .timeBased()
    .everyMinutes(CONFIG.docCheckIntervalMinutes)
    .create();

  // Installable onEdit trigger for the dashboard Sheet
  const sheetFile = SpreadsheetApp.openById(CONFIG.dashboardSheetId);
  ScriptApp.newTrigger('onDashboardSheetEdit')
    .forSpreadsheet(sheetFile)
    .onEdit()
    .create();

  Logger.log('Triggers installed: checkWatchedDocs (every %s min), onDashboardSheetEdit (live)',
    CONFIG.docCheckIntervalMinutes);
}

/**
 * Time-driven: checks each watched Doc's last-modified time against the
 * last-seen value stored in Script Properties. Only fires the webhook if
 * it actually changed since the last check.
 */
function checkWatchedDocs() {
  const props = PropertiesService.getScriptProperties();

  CONFIG.watchedDocs.forEach(({ topic, docId }) => {
    const file = DriveApp.getFileById(docId);
    const lastUpdated = file.getLastUpdated().getTime().toString();
    const propKey = `doc_${topic}_lastUpdated`;
    const previous = props.getProperty(propKey);

    if (previous !== lastUpdated) {
      Logger.log('Doc changed for topic "%s" — firing webhook', topic);
      const ok = callWebhook({ type: 'doc', topic, docId });
      if (ok) {
        // Only record the new timestamp if the webhook succeeded —
        // so a failed sync gets retried next check instead of silently skipped.
        props.setProperty(propKey, lastUpdated);
      }
    }
  });
}

/**
 * Real edit event on the dashboard Sheet. Fires immediately.
 * e.range gives us the sheet/tab that was edited so we can pass the
 * right topic if you're using one-tab-per-topic.
 */
function onDashboardSheetEdit(e) {
  const sheetName = e.range.getSheet().getName(); // e.g. tab named "adhd"
  Logger.log('Sheet edit detected on tab "%s" — firing webhook', sheetName);
  callWebhook({ type: 'sheet', topic: sheetName, sheetId: CONFIG.dashboardSheetId });
}

/**
 * POSTs to the Next.js refresh endpoint. Returns true on 2xx, false otherwise.
 */
function callWebhook(payload) {
  try {
    const response = UrlFetchApp.fetch(CONFIG.webhookUrl, {
      method: 'post',
      contentType: 'application/json',
      headers: { 'X-Webhook-Secret': CONFIG.webhookSecret },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });
    const code = response.getResponseCode();
    if (code >= 200 && code < 300) {
      return true;
    }
    Logger.log('Webhook call failed: HTTP %s — %s', code, response.getContentText());
    return false;
  } catch (err) {
    Logger.log('Webhook call threw: %s', err);
    return false;
  }
}
```

### Notes on this script
- **Idempotent setup:** re-running `setup()` clears and reinstalls triggers, so you can safely tweak `CONFIG` and re-run without piling up duplicate triggers.
- **Fail-safe on Doc polling:** if the webhook call fails, the stored timestamp isn't updated, so the next poll retries automatically instead of silently marking a failed sync as done.
- **Adding a new topic later:** add one line to `watchedDocs`, re-run `setup()`. No new trigger needed — one time-driven trigger checks the whole list each run.
- **Multi-tab Sheet:** the `onDashboardSheetEdit` handler already reads which tab was edited (`e.range.getSheet().getName()`), so if you go with one-tab-per-topic in a single Sheet, this needs no changes.

---

## Part 2 — Prompt for Claude Code (build the Next.js side)

Paste this into Claude Code in your repo:

```
Build the /api/refresh webhook endpoint that Apps Script calls when a Drive Doc or Sheet changes.

Context: CLAUDE.md documents the full sync architecture. This endpoint is the receiving end —
Apps Script (running in Google's environment, not this repo) POSTs to it with a JSON body like:
  { "type": "doc", "topic": "adhd", "docId": "..." }
  { "type": "sheet", "topic": "adhd", "sheetId": "..." }

Requirements:
1. Route: app/api/refresh/route.ts (POST only)
2. Auth: reject unless header `X-Webhook-Secret` matches process.env.WEBHOOK_SECRET exactly.
   Return 401 on mismatch or missing header. Add WEBHOOK_SECRET to .env.local.example.
3. For type "doc":
   - Export the Google Doc as HTML via the Docs/Drive API (service account credentials —
     check if we already have a service account set up from earlier Drive integration
     planning; if not, flag it rather than inventing new auth)
   - Convert HTML to MDX (reuse or build the converter scoped in the Google Drive
     integration plan section of CLAUDE.md)
   - Write to content/docs/[topic].mdx — but do NOT overwrite if the conversion fails
     or produces empty/malformed output. Log and return a 500 with details instead of
     silently writing a broken file.
4. For type "sheet":
   - Pull values via the Sheets API (values.get) for the given sheetId/tab (topic)
   - Build the JSON shape matching content/data/[topic].json's existing schema
     (see adhd.json as the reference structure)
   - Same non-destructive-on-failure rule as above.
5. After a successful write, trigger revalidation for the affected route
   (revalidatePath for /docs/[topic] and/or /dashboard/[topic]) rather than requiring
   a full rebuild.
6. Return a clear JSON response: { success: boolean, topic, type, error?: string }
   so Apps Script's Logger output is meaningful if something goes wrong.
7. Add a short section to CLAUDE.md under the Google Drive Integration plan marking
   this endpoint as built, and note the trigger mechanism is Apps Script
   (time-driven poll for Docs, installable onEdit for the Sheet) rather than
   Vercel Cron or Drive API push notifications — so that decision doesn't get
   re-litigated later.

Ask me before proceeding if the service account / Docs API credentials aren't already
set up somewhere in this repo or its env vars — don't create a new auth path without checking first.
```

---

## What you still need to fill in before this works
- [ ] `docId` for the ADHD research bible Doc (Part 1 `CONFIG.watchedDocs`)
- [ ] `sheetId` for the dashboard-data Sheet (Part 1 `CONFIG.dashboardSheetId`)
- [ ] A generated `webhookSecret` — put the same value in Apps Script `CONFIG` and Next.js `WEBHOOK_SECRET` env var
- [ ] Confirm whether the Docs/Sheets API service account from the earlier integration planning session already exists, or needs to be created (Claude Code will flag this if missing per the prompt above)
- [ ] Share both the Doc and the Sheet with the service account's email address (Drive sharing, same as any other collaborator)