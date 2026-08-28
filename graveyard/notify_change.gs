/**
 * Google Apps Script — Research Bible Change Notifier
 *
 * Deploy this script INSIDE the ADHD research bible Google Doc
 * (Extensions → Apps Script). Run setup() once to install the trigger.
 *
 * How it works:
 *   - An installable onEdit trigger fires when anyone edits the Doc.
 *   - It POSTs to /api/research-bible/notify-change with the topic name
 *     and a timestamp.
 *   - The Next.js endpoint converts the Doc → MDX + Sheet → JSON, stores
 *     a pending review, and emails you to approve/reject before it goes live.
 *
 * Configuration:
 *   Set the three constants below before deploying.
 */

var CONFIG = {
  // Must match WEBHOOK_SECRET in your .env.local / Vercel env vars exactly.
  webhookSecret: "REPLACE_WITH_YOUR_WEBHOOK_SECRET",

  // The topic key as it appears in content/sync-config.json (e.g. "adhd").
  topic: "adhd",

  // Your deployed Vercel URL (no trailing slash).
  siteUrl: "https://REPLACE_WITH_YOUR_VERCEL_URL",
};

// ---------------------------------------------------------------------------

/**
 * Run this function ONCE from the Apps Script editor to install the trigger.
 * After that, editing the Doc triggers onResearchBibleEdit automatically.
 */
function setup() {
  // Remove any existing triggers for this function to avoid duplicates.
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "onResearchBibleEdit") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Install a new installable onEdit trigger bound to THIS document.
  ScriptApp.newTrigger("onResearchBibleEdit")
    .forDocument(DocumentApp.getActiveDocument())
    .onEdit()
    .create();

  Logger.log("Trigger installed. The webhook will fire on every edit to this Doc.");
}

/**
 * Fires on every edit to this Doc (installed via setup()).
 * Sends a POST to the Next.js notify-change endpoint.
 */
function onResearchBibleEdit() {
  var payload = {
    topic: CONFIG.topic,
    changedAt: new Date().toISOString(),
  };

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    headers: {
      Authorization: "Bearer " + CONFIG.webhookSecret,
    },
    // Don't throw on non-2xx — log it instead so a bad deploy doesn't
    // block every Doc edit.
    muteHttpExceptions: true,
  };

  var endpoint = CONFIG.siteUrl + "/api/research-bible/notify-change";

  try {
    var response = UrlFetchApp.fetch(endpoint, options);
    var code = response.getResponseCode();
    var body = response.getContentText();

    if (code === 200) {
      Logger.log("Notify-change webhook succeeded: " + body);
    } else {
      Logger.log("Notify-change webhook returned HTTP " + code + ": " + body);
    }
  } catch (e) {
    Logger.log("Notify-change webhook threw: " + e.toString());
  }
}
