/**
 * Pure, no-I/O parsing functions for the Research Bible content-sync pipeline.
 * Given the raw Markdown text of an `RB_*.md` source file (as fetched from
 * Drive), these extract the pieces the webhook needs: title, the latest
 * changelog entry, and the cleaned MDX body.
 *
 * IMPORTANT — no real `RB_*.md` fixtures exist in this repo checkout. Every
 * pattern matched here (title line, Refinement Log block shape, the
 * `{.underline}` Pandoc span) comes from the handoff doc and prior
 * investigation, NOT from a real file. Unit tests below use synthetic
 * fixtures constructed to match the documented shape exactly. Bobby must
 * manually verify these regexes against a real `RB_*.md` (ideally
 * `RB_Anxiety_and_Depression.md`, flagged separately as having a possibly
 * malformed header) before trusting this in production. See the "manual
 * steps" list in the handoff round's final report.
 */

export class BibleParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BibleParseError";
  }
}

/**
 * Strict title extraction. Only accepts a Setext-style H1 of the exact form:
 *
 *   Research Bible: <Title>
 *   ========================
 *
 * on the first non-blank lines of the file. No fuzzy matching, no fallback —
 * title is core identity, so a non-conforming file should fail loudly (the
 * webhook route turns this into a 400) rather than guess.
 */
export function extractTitle(raw: string): string {
  const lines = raw.split(/\r\n|\r|\n/);
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;

  const titleLine = lines[i];
  const underlineLine = lines[i + 1];

  if (titleLine === undefined || underlineLine === undefined) {
    throw new BibleParseError(
      "Could not extract bible title: file has fewer than two non-blank lines at the top",
    );
  }

  const titleMatch = /^Research Bible: (.+)$/.exec(titleLine);
  if (!titleMatch) {
    throw new BibleParseError(
      `Could not extract bible title: first non-blank line does not match "Research Bible: <Title>" (got: ${JSON.stringify(titleLine)})`,
    );
  }

  if (!/^=+$/.test(underlineLine.trim())) {
    throw new BibleParseError(
      `Could not extract bible title: expected a Setext underline ("===...") on the line after the title (got: ${JSON.stringify(underlineLine)})`,
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
 * Extracts the most recent changelog entry from a `**Refinement Log —
 * [Month Year]**` block: `Date:` (falls back to today, UTC, if missing or
 * unparseable) and `Findings integrated:` (used verbatim as the summary, not
 * synthesized).
 *
 * FALLBACK (resolved decision, no real fixtures to validate the alternative
 * against): if no Refinement Log block exists at all — expected on a
 * bible's very first-ever sync, before any refinement round has run — this
 * does NOT throw. It returns a placeholder entry dated today so the first
 * sync can proceed. This differs from `extractTitle`, which DOES reject on
 * failure: title is core identity and blocking is correct there; changelog
 * is supplementary, and blocking first ingestion on it would defeat the
 * pipeline's purpose.
 */
export function extractChangelogEntry(raw: string): { date: string; summary: string } {
  const blockMatch = REFINEMENT_LOG_BLOCK_RE.exec(raw);
  if (!blockMatch) {
    return {
      date: todayUtcIsoDate(),
      summary: "Initial sync — no refinement log entry found in source.",
    };
  }

  const block = blockMatch[1];

  const dateMatch = DATE_LINE_RE.exec(block);
  const date = (dateMatch && tryParseDate(dateMatch[1])) || todayUtcIsoDate();

  const findingsMatch = FINDINGS_LINE_RE.exec(block);
  const summary = findingsMatch ? findingsMatch[1].trim() : "";

  return { date, summary };
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
 * title/module/doc-type header block and the Refinement Log block (both
 * already captured structurally by extractTitle/extractChangelogEntry).
 *
 * Caller is expected to have already run `stripPandocArtifacts` on `raw`
 * before calling this (order matters for the dedup-guard hash, see webhook
 * route), but this function itself does not assume that — it only removes
 * structural header/log content.
 */
export function extractBody(raw: string): string {
  const lines = raw.split(/\r\n|\r|\n/);

  // Skip leading blank lines, then the Setext title line + underline.
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  if (/^Research Bible: /.test(lines[i] ?? "") && /^=+$/.test((lines[i + 1] ?? "").trim())) {
    i += 2;
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
