import { getGoogleAccessToken, GOOGLE_SCOPES } from "@/lib/google/serviceAccountAuth";

/**
 * Exports a Google Doc as HTML via the Drive API's export endpoint.
 * Uses direct `fetch` with a Bearer token — no `googleapis` package (banned per CLAUDE.md).
 */
export async function fetchDocAsHtml(docId: string): Promise<string> {
  const token = await getGoogleAccessToken([GOOGLE_SCOPES.driveReadonly]);

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(docId)}/export?mimeType=text/html`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.ok) {
    throw new Error(`Drive export failed for doc ${docId}: HTTP ${response.status} — ${await response.text()}`);
  }

  return response.text();
}
