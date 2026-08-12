import { getGoogleAccessToken, GOOGLE_SCOPES } from "@/lib/google/serviceAccountAuth";

/**
 * Fetches the raw content of a Drive file (e.g. an `RB_*.md` bible source)
 * via the Drive API's `alt=media` download endpoint. Uses direct `fetch`
 * with a Bearer token — no `googleapis` package (banned per CLAUDE.md),
 * matching `lib/google/docs.ts`'s existing pattern.
 */
export async function fetchDriveFileContent(fileId: string): Promise<string> {
  const token = await getGoogleAccessToken([GOOGLE_SCOPES.driveReadonly]);

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.ok) {
    throw new Error(
      `Drive file download failed for file ${fileId}: HTTP ${response.status} — ${await response.text()}`,
    );
  }

  return response.text();
}
