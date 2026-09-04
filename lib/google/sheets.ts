import { getGoogleAccessToken, GOOGLE_SCOPES } from "@/lib/google/serviceAccountAuth";

/**
 * Fetches a single tab's raw values from a Google Sheet via `values.get`.
 * Direct `fetch` + Bearer token — no `googleapis` package (banned per CLAUDE.md).
 */
export async function fetchSheetValues(sheetId: string, tab: string): Promise<string[][]> {
  const token = await getGoogleAccessToken([GOOGLE_SCOPES.spreadsheetsReadonly]);

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${encodeURIComponent(
      tab,
    )}?valueRenderOption=UNFORMATTED_VALUE`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.ok) {
    throw new Error(
      `Sheets values.get failed for sheet ${sheetId} tab "${tab}": HTTP ${response.status} — ${await response.text()}`,
    );
  }

  const data = (await response.json()) as { values?: string[][] };
  return data.values ?? [];
}

/**
 * Appends a single row to a Google Sheet tab via `values.append`. Direct
 * `fetch` + Bearer token, same pattern as `fetchSheetValues` above, but
 * requests the read-write `spreadsheets` scope instead of the read-only one.
 */
export async function appendSheetRow(sheetId: string, tab: string, row: string[]): Promise<void> {
  const token = await getGoogleAccessToken([GOOGLE_SCOPES.spreadsheets]);

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${encodeURIComponent(
      tab,
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Sheets values.append failed for sheet ${sheetId} tab "${tab}": HTTP ${response.status} — ${await response.text()}`,
    );
  }
}

interface DashboardStat {
  value: string;
  label: string;
  detail?: string;
  citationId?: string;
}

interface ConsensusItem {
  treatment: string;
  evidenceLevel: string;
  effectSize: string;
  note?: string;
  citationId?: string;
}

interface DisagreementRow {
  topic: string;
  strongClaim: string;
  softerClaim: string;
  citationId?: string;
  flaggedForReview?: boolean;
}

interface CoOccurringRow {
  condition: string;
  rate: string;
  note?: string;
  citationId?: string;
}

/**
 * Row shape, per `section` column value (v1 scope — flat/row-shaped fields
 * only; `panels`/`redFlags`/`resources`/`openQuestionsForReview` and all
 * section titles/descriptions stay hand-edited in the JSON, untouched here).
 *
 *   heroStat        | value | label | detail | citationId
 *   quickStat       | value | label | detail | citationId
 *   consensusItem   | treatment | evidenceLevel | effectSize | note | citationId
 *   disagreementRow | topic | strongClaim | softerClaim | citationId | flaggedForReview
 *   coOccurring     | condition | rate | note | citationId
 *   citation        | citationId | fullText
 */
export function buildDashboardJson(
  existing: Record<string, unknown>,
  rows: string[][],
): Record<string, unknown> {
  const [, ...dataRows] = rows; // first row is the header, not data

  const quickStats: DashboardStat[] = [];
  const consensusItems: ConsensusItem[] = [];
  const disagreementRows: DisagreementRow[] = [];
  const coOccurringRows: CoOccurringRow[] = [];
  const citations: Record<string, string> = {};
  let heroStat: DashboardStat | undefined;

  for (const row of dataRows) {
    const [section, c2, c3, c4, c5] = row;
    if (!section) continue;

    switch (section) {
      case "heroStat":
        heroStat = { value: c2, label: c3, detail: c4 || undefined, citationId: c5 || undefined };
        break;
      case "quickStat":
        quickStats.push({ value: c2, label: c3, detail: c4 || undefined, citationId: c5 || undefined });
        break;
      case "consensusItem": {
        const [, treatment, evidenceLevel, effectSize, noteAndCitation] = row;
        const [note, citationId] = (noteAndCitation ?? "").split("|").map((s) => s?.trim());
        consensusItems.push({ treatment, evidenceLevel, effectSize, note: note || undefined, citationId: citationId || undefined });
        break;
      }
      case "disagreementRow": {
        const [, topic, strongClaim, softerClaim, citationAndFlag] = row;
        const [citationId, flag] = (citationAndFlag ?? "").split("|").map((s) => s?.trim());
        disagreementRows.push({
          topic,
          strongClaim,
          softerClaim,
          citationId: citationId || undefined,
          flaggedForReview: flag === "true" || undefined,
        });
        break;
      }
      case "coOccurring":
        coOccurringRows.push({ condition: c2, rate: c3, note: c4 || undefined, citationId: c5 || undefined });
        break;
      case "citation":
        if (c2) citations[c2] = c3;
        break;
      default:
        // Unknown section — ignore rather than throw, so an extra sheet row
        // doesn't take down the whole sync.
        break;
    }
  }

  const result: Record<string, unknown> = { ...existing };

  if (heroStat) result.heroStat = heroStat;
  if (quickStats.length) result.quickStats = quickStats;

  if (consensusItems.length) {
    const consensusMeter = (existing.consensusMeter as Record<string, unknown>) ?? {};
    result.consensusMeter = { ...consensusMeter, items: consensusItems };
  }

  if (disagreementRows.length) {
    const whereExpertsDisagree = (existing.whereExpertsDisagree as Record<string, unknown>) ?? {};
    result.whereExpertsDisagree = { ...whereExpertsDisagree, rows: disagreementRows };
  }

  if (coOccurringRows.length) {
    const coOccurringConditions = (existing.coOccurringConditions as Record<string, unknown>) ?? {};
    result.coOccurringConditions = { ...coOccurringConditions, rows: coOccurringRows };
  }

  if (Object.keys(citations).length) {
    result.citations = { ...(existing.citations as Record<string, string> | undefined), ...citations };
  }

  return result;
}
