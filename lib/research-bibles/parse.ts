/**
 * Pure, no-I/O parsing functions for the Research Bible content-sync pipeline.
 * Given the raw Markdown text of an `RB_*.md` source file (as fetched from
 * Drive), these extract the pieces the webhook needs: title, the latest
 * changelog entry, and the cleaned MDX body.
 *
 * VERIFIED against real files in the Research Bibles Drive folder
 * (RB_Structures_and_Routines.md, RB_Communication.md,
 * RB_Big_Transitions_Big_Feelings.md, RB_Understanding_Modern_Parenting.md)
 * on 2026-08-12. All four use an ATX-style H1 — `# Research Bible: <Title>`
 * — with NO Setext underline, contradicting the Setext-only assumption this
 * file previously encoded. That assumption has been corrected below.
 *
 * KNOWN OUTLIER: `RB_Anxiety_and_Depression.md` does not match either title
 * pattern — its header is plain text ("RESEARCH BIBLE Anxiety and
 * Depression in Children Stabilize Phase — ...") with no Markdown heading
 * at all, apparently because the title text in the source Google Doc was
 * never styled as Heading 1. `extractTitle` will (correctly) reject this
 * file and the webhook will 400 on it. Fix is on the Doc side: apply
 * Heading&nbsp;1 style to the title line in Google Docs so it exports with
 * a leading `#`. Flagged for Bobby — not something to special-case in code
 * for one file.
 */

export class BibleParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BibleParseError";
  }
}

/**
 * Strict title extraction. Only accepts an ATX-style H1 of the exact form:
 *
 *   # Research Bible: <Title>
 *
 * on the first non-blank line of the file. No fuzzy matching, no fallback —
 * title is core identity, so a non-conforming file should fail loudly (the
 * webhook route turns this into a 400) rather than guess.
 */
export function extractTitle(raw: string): string {
  const lines = raw.split(/\r\n|\r|\n/);
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;

  const titleLine = lines[i];

  if (titleLine === undefined) {
    throw new BibleParseError(
      "Could not extract bible title: file is empty or has no non-blank lines",
    );
  }

  const titleMatch = /^#\s+Research Bible:\s*(.+)$/.exec(titleLine.trim());
  if (!titleMatch) {
    throw new BibleParseError(
      `Could not extract bible title: first non-blank line does not match "# Research Bible: <Title>" (got: ${JSON.stringify(titleLine)})`,
    );
  }

  const title = titleMatch[1].trim();
  if (!title) {
    throw new BibleParseError("Could not extract bible title: title text is empty");
  }

  return title;
}

const REFINEMENT_LOG_BLOCK_RE =
  /\*\*Refinement Log — [^*\n]+\*\*([\s\S]*?)(?=\n\*\*Refinement Log — |\n#{1,6}\s|$)/;
const DATE_LINE_RE = /Date:\s*(.+)/;
const FINDINGS_LINE_RE = /Findings integrated:\s*([\s\S]*?)(?:\n\s*\n|$)/;

// Matches the `_[DDMMYY]` suffix the research-bible-refinement skill (Step 7)
// stamps onto a bible's filename after each refinement round, e.g.
// `RB_ADHD_110826.md` (refined 2026-08-11). Per that skill's own notes:
// "Refinement history lives in `_WeeklyRefinementLog.md` and in each file's
// dated filename — never in the bible body itself."
const FILENAME_DATE_SUFFIX_RE = /_(\d{2})(\d{2})(\d{2})\.md$/i;

function todayUtcIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function tryParseDate(value: string): string | null {
  const trimmed = value.trim();
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

/**
 * Parses a `_DDMMYY` filename suffix into an ISO date, or `null` if the
 * filename has no such suffix or the date it encodes isn't a real calendar
 * date (e.g. rejects a stray `_999999`).
 */
function dateFromFilenameSuffix(fileName: string): string | null {
  const match = FILENAME_DATE_SUFFIX_RE.exec(fileName);
  if (!match) return null;

  const [, dd, mm, yy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = 2000 + Number(yy);
  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const parsed = new Date(`${iso}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== iso) return null;

  return iso;
}

/**
 * Extracts the most recent changelog entry for a sync.
 *
 * Historically this only looked for an in-body `**Refinement Log — [Month
 * Year]**` block (`Date:` / `Findings integrated:` lines). That block is
 * kept as a first-priority match for backward compatibility, but as of the
 * current `research-bible-refinement` skill (Step 7), the skill
 * deliberately does NOT write that block into the bible body anymore — it
 * logs refinement details externally (`_WeeklyRefinementLog.md`) and
 * records the refinement date in the filename instead (`RB_Topic_DDMMYY.md`).
 * So on essentially every real sync, no in-body block will be found.
 *
 * Resolution (webhook reads the filename signal instead of requiring a
 * body change): when no in-body block exists, `fileName` is checked for a
 * `_DDMMYY` refinement-date suffix. If present, that date is used and the
 * summary points at the external log rather than claiming "no refinement
 * happened." If absent (a bible's very first-ever sync, before any
 * refinement round has run), this falls back to today's date with a
 * genuine "initial sync" summary. This does NOT throw either way —
 * changelog is supplementary, and blocking first ingestion on it would
 * defeat the pipeline's purpose (title extraction is what's meant to be
 * strict, see `extractTitle`).
 */
export function extractChangelogEntry(
  raw: string,
  fileName?: string,
): { date: string; summary: string } {
  const blockMatch = REFINEMENT_LOG_BLOCK_RE.exec(raw);
  if (blockMatch) {
    const block = blockMatch[1];

    const dateMatch = DATE_LINE_RE.exec(block);
    const date = (dateMatch && tryParseDate(dateMatch[1])) || todayUtcIsoDate();

    const findingsMatch = FINDINGS_LINE_RE.exec(block);
    const summary = findingsMatch ? findingsMatch[1].trim() : "";

    return { date, summary };
  }

  const filenameDate = fileName ? dateFromFilenameSuffix(fileName) : null;
  if (filenameDate) {
    return {
      date: filenameDate,
      summary:
        "Synced from Drive after a refinement round — see _WeeklyRefinementLog.md for what changed.",
    };
  }

  return {
    date: todayUtcIsoDate(),
    summary: "Initial sync — no prior refinement round recorded in the filename.",
  };
}

/**
 * Strips the single documented Pandoc export artifact found in the corpus:
 * `[text]{.underline}` spans get unwrapped to plain `text` (link markup
 * inside is preserved as-is). This is intentionally narrow — not a general
 * Pandoc-attribute-stripping framework — per the locked decision that this
 * is the only pattern seen so far.
 */
export function stripPandocArtifacts(raw: string): string {
  return raw.replace(/\[([^\]]*)\]\{\.underline\}/g, "$1");
}

/**
 * Returns the remaining Markdown body after stripping the leading
 * title header line and the Refinement Log block (both already captured
 * structurally by extractTitle/extractChangelogEntry).
 *
 * Caller is expected to have already run `stripPandocArtifacts` on `raw`
 * before calling this (order matters for the dedup-guard hash, see webhook
 * route), but this function itself does not assume that — it only removes
 * structural header/log content.
 */
export function extractBody(raw: string): string {
  const lines = raw.split(/\r\n|\r|\n/);

  // Skip leading blank lines, then the ATX title line (`# Research Bible: ...`).
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  if (/^#\s+Research Bible:\s/.test((lines[i] ?? "").trim())) {
    i += 1;
  }

  // Skip any further header metadata lines (e.g. "Module:", "Document Type:")
  // up to the first blank line or the first real Markdown heading.
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
      continue;
    }
    if (/^#{1,6}\s/.test(line) || /^\*\*Refinement Log/.test(line)) break;
    // A metadata line looks like "Label: value" with no leading heading marker.
    if (/^[A-Za-z][A-Za-z /]*:\s*.+/.test(line) && !/^https?:/.test(line)) {
      i++;
      continue;
    }
    break;
  }

  const remaining = lines.slice(i).join("\n");

  // Remove the Refinement Log block wherever it appears in the remaining body.
  const withoutLog = remaining.replace(REFINEMENT_LOG_BLOCK_RE, "").trim();

  return `${withoutLog}\n`;
}

/**
 * Site-owned version string. `existingChangelogLength` is the number of
 * changelog entries that existed BEFORE the new entry produced by this sync
 * is appended. 0 existing entries (first-ever sync) -> "1.0". 1 existing
 * entry -> "1.1", etc.
 */
export function computeVersion(existingChangelogLength: number): string {
  return `1.${existingChangelogLength}`;
}
