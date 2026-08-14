/**
 * Pure, no-I/O parsing functions for the Parent Facing Content sync pipeline
 * (Pain Point Pages + Awareness Modules). Given the raw Markdown text of a
 * `PainPoint_*.md` or `Module_*.md` source file (as fetched from Drive),
 * these extract and validate the exact field set the `painPoints` /
 * `awarenessModules` Keystatic collections need.
 *
 * Source-file contract is documented in `Research-Content-Pipeline-Handoff-v3.md`
 * §2 — verified against the live, rewritten `parent-content-builder` skill
 * (done 2026-08-13, per that doc's "Corrections" section), not guessed.
 *
 * Mirrors `lib/research-bibles/parse.ts`'s style: hand-rolled, no general
 * YAML/Markdown parser dependency (CLAUDE.md's locked tech-stack rule). The
 * frontmatter shape here (simple `key: value` lines plus one nested
 * `related:` array) is different enough from the bible's frontmatter
 * (`lib/research-bibles/frontmatter.ts`, which serializes/parses the
 * *site's* Keystatic YAML, not a Drive source file) that a second small
 * hand-rolled parser was the right call rather than generalizing that one.
 */

export class ContentParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentParseError";
  }
}

// Keep in sync with keystatic.config.ts's PAIN_POINT_ICON_OPTIONS and
// lib/pain-point-icons.ts's PAIN_POINT_ICONS map.
export const PAIN_POINT_ICON_VALUES = [
  "Flame",
  "Smartphone",
  "Ear",
  "CloudLightning",
  "Moon",
  "Pencil",
  "Hand",
  "Clock",
  "Angry",
  "HeartCrack",
  "Globe",
  "TrendingUp",
] as const;

const PLACEHOLDER_MARKERS = ["NEEDS SLUG", "TODO", "[GAP:", "[ACCURACY FLAG:"];

export interface LinkRef {
  label: string;
  href: string;
}

export interface ListItem {
  title: string;
  body: string;
}

export interface AgeScenarios {
  "2-5": string;
  "6-9": string;
  "10-12": string;
  "13+": string;
}

export interface ParsedPainPoint {
  slugName: string;
  icon: string;
  tag: string;
  title: string;
  cardTeaser: string;
  headline: string;
  intro: string;
  defaultAge: string;
  ageScenarios: AgeScenarios;
  whatHappening: string[];
  backfires: ListItem[];
  tries: ListItem[];
  support: string;
  crisis: boolean;
  deepDiveLabel: string;
  deepDiveHref: string;
  related: LinkRef[];
}

export interface ParsedAwarenessModule {
  slugName: string;
  icon: string;
  tag: string;
  title: string;
  cardTeaser: string;
  headline: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  crisis: boolean;
  related: LinkRef[];
}

function unquote(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // fall through to literal
    }
  }
  return trimmed;
}

/**
 * Returns the file's `status` frontmatter value (or `undefined` if missing),
 * without running full validation. Callers must check this BEFORE calling
 * `parsePainPointSource`/`parseAwarenessModuleSource` — anything other than
 * exactly "ready" means the file isn't finished yet and should be skipped
 * silently, not treated as a parse error (unfinished drafts legitimately
 * contain placeholder markers etc.).
 */
export function getSourceStatus(raw: string): string | undefined {
  const fmMatch = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!fmMatch) return undefined;
  const m = /^status:\s*(.*)$/m.exec(fmMatch[1]);
  return m ? unquote(m[1]) : undefined;
}

interface ParsedSourceFile {
  block: Map<string, string>;
  related: LinkRef[];
  body: string;
}

/**
 * Splits a source file into its frontmatter key/value map (plus the nested
 * `related` array, the one structured field the frontmatter contract has)
 * and the Markdown body. Scoped to exactly the §2 contract shape — not a
 * general YAML parser.
 */
function parseSourceFile(raw: string, fileName: string): ParsedSourceFile {
  const fmMatch = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!fmMatch) {
    throw new ContentParseError(
      `File does not start with a --- frontmatter block (file: ${fileName})`,
    );
  }
  const [, fmBlock, body] = fmMatch;
  const lines = fmBlock.split(/\r?\n/);
  const block = new Map<string, string>();
  const related: LinkRef[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
      continue;
    }
    const kvMatch = /^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/.exec(line);
    if (!kvMatch) {
      i++;
      continue;
    }
    const [, key, rest] = kvMatch;

    if (key === "related") {
      i++;
      while (i < lines.length && /^\s*-\s*label:/.test(lines[i])) {
        const labelMatch = /^\s*-\s*label:\s*(.*)$/.exec(lines[i]);
        const label = labelMatch ? unquote(labelMatch[1]) : "";
        i++;
        let href = "";
        if (i < lines.length && /^\s*href:\s*(.*)$/.test(lines[i])) {
          href = unquote(/^\s*href:\s*(.*)$/.exec(lines[i])![1]);
          i++;
        }
        related.push({ label, href });
      }
      continue;
    }

    block.set(key, unquote(rest));
    i++;
  }

  return { block, related, body };
}

interface RawSection {
  heading: string;
  content: string;
}

/** Splits the body on top-level `## Heading` markers (never matches `###`). */
function splitTopLevelSections(body: string): RawSection[] {
  const lines = body.split(/\r?\n/);
  const sections: RawSection[] = [];
  let currentHeading: string | null = null;
  let buf: string[] = [];

  for (const line of lines) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      if (currentHeading !== null) sections.push({ heading: currentHeading, content: buf.join("\n") });
      currentHeading = m[1];
      buf = [];
    } else {
      buf.push(line);
    }
  }
  if (currentHeading !== null) sections.push({ heading: currentHeading, content: buf.join("\n") });

  return sections;
}

/** Splits a section's content on `### Subheading` markers (backfires/tries items). */
function splitSubSections(content: string): RawSection[] {
  const lines = content.split(/\r?\n/);
  const items: RawSection[] = [];
  let currentHeading: string | null = null;
  let buf: string[] = [];

  for (const line of lines) {
    const m = /^###\s+(.+?)\s*$/.exec(line);
    if (m) {
      if (currentHeading !== null) items.push({ heading: currentHeading, content: buf.join("\n") });
      currentHeading = m[1];
      buf = [];
    } else {
      buf.push(line);
    }
  }
  if (currentHeading !== null) items.push({ heading: currentHeading, content: buf.join("\n") });

  return items;
}

/** Joins a possibly line-wrapped chunk of text into one folded line (matches YAML `>-` folding semantics). */
function toSingleLine(text: string): string {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ");
}

/** Splits section content into paragraphs on blank lines, each folded to a single line. */
function splitParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((p) => toSingleLine(p))
    .filter((p) => p.length > 0);
}

function assertNoPlaceholders(raw: string, fileName: string): void {
  for (const marker of PLACEHOLDER_MARKERS) {
    if (raw.includes(marker)) {
      throw new ContentParseError(
        `File still contains an unresolved placeholder marker "${marker}" — finish the content before marking it "status: ready" (file: ${fileName})`,
      );
    }
  }
}

function validateIcon(icon: string, fileName: string): void {
  if (!(PAIN_POINT_ICON_VALUES as readonly string[]).includes(icon)) {
    throw new ContentParseError(
      `icon "${icon}" is not one of the approved values: ${PAIN_POINT_ICON_VALUES.join(", ")} (file: ${fileName})`,
    );
  }
}

function validateHref(href: string, fieldLabel: string, fileName: string): void {
  // "/help" and "/docs" (no trailing slash) are valid bare index links —
  // e.g. content/awareness-modules/modern.yaml links a related item to the
  // /help index itself, not a specific slug.
  const isValid =
    href === "/help" ||
    href === "/docs" ||
    href.startsWith("/docs/") ||
    href.startsWith("/help/");
  if (!isValid) {
    throw new ContentParseError(
      `${fieldLabel} must start with "/docs/" or "/help/", got "${href}" (file: ${fileName})`,
    );
  }
}

function validateSlug(slug: string, fileName: string): void {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    throw new ContentParseError(
      `slugName "${slug}" must be lowercase alphanumeric with hyphens only (file: ${fileName})`,
    );
  }
}

function parseCrisis(block: Map<string, string>, fileName: string): boolean {
  const crisisRaw = block.get("crisis");
  if (crisisRaw !== "true" && crisisRaw !== "false") {
    throw new ContentParseError(
      `"crisis" must be an explicit literal "true" or "false", got ${JSON.stringify(crisisRaw ?? null)} (file: ${fileName})`,
    );
  }
  return crisisRaw === "true";
}

function requireField(block: Map<string, string>, key: string, fileName: string): string {
  const value = block.get(key);
  if (!value || value.trim().length === 0) {
    throw new ContentParseError(`Missing required frontmatter field "${key}" (file: ${fileName})`);
  }
  return value.trim();
}

function requireSection(sections: Map<string, string>, heading: string, fileName: string): string {
  const content = sections.get(heading);
  if (content === undefined) {
    throw new ContentParseError(`Missing required "## ${heading}" section (file: ${fileName})`);
  }
  return content;
}

/**
 * Parses + validates a `PainPoint_*.md` source file. Throws
 * `ContentParseError` on any structural or content problem — never returns
 * a partial result, per the plan's "reject with a clear structured error,
 * never open a partial PR" rule. Caller must have already confirmed
 * `getSourceStatus(raw) === "ready"` before calling this.
 */
export function parsePainPointSource(raw: string, fileName: string): ParsedPainPoint {
  assertNoPlaceholders(raw, fileName);
  const { block, related, body } = parseSourceFile(raw, fileName);

  const type = block.get("type");
  if (type !== "pain-point") {
    throw new ContentParseError(
      `Expected frontmatter "type: pain-point", got ${JSON.stringify(type ?? null)} (file: ${fileName})`,
    );
  }

  const slugName = requireField(block, "slugName", fileName);
  validateSlug(slugName, fileName);

  const icon = requireField(block, "icon", fileName);
  validateIcon(icon, fileName);

  const tag = requireField(block, "tag", fileName);
  const title = requireField(block, "title", fileName);
  const cardTeaser = requireField(block, "cardTeaser", fileName);
  const headline = requireField(block, "headline", fileName);
  const defaultAge = requireField(block, "defaultAge", fileName);
  const crisis = parseCrisis(block, fileName);

  const deepDiveLabel = requireField(block, "deepDiveLabel", fileName);
  const deepDiveHref = requireField(block, "deepDiveHref", fileName);
  validateHref(deepDiveHref, "deepDiveHref", fileName);

  for (const ref of related) {
    validateHref(ref.href, `related[].href ("${ref.label}")`, fileName);
  }

  const sections = new Map(splitTopLevelSections(body).map((s) => [s.heading, s.content]));

  const intro = toSingleLine(requireSection(sections, "Intro", fileName));
  if (!intro) throw new ContentParseError(`"## Intro" section is empty (file: ${fileName})`);

  const ageScenarios: AgeScenarios = {
    "2-5": toSingleLine(requireSection(sections, "Age Scenario: 2-5", fileName)),
    "6-9": toSingleLine(requireSection(sections, "Age Scenario: 6-9", fileName)),
    "10-12": toSingleLine(requireSection(sections, "Age Scenario: 10-12", fileName)),
    "13+": toSingleLine(requireSection(sections, "Age Scenario: 13+", fileName)),
  };
  for (const [band, text] of Object.entries(ageScenarios)) {
    if (!text) throw new ContentParseError(`"## Age Scenario: ${band}" section is empty (file: ${fileName})`);
  }

  const whatHappening = splitParagraphs(requireSection(sections, "What's Happening", fileName));
  if (whatHappening.length === 0) {
    throw new ContentParseError(`"## What's Happening" section has no content (file: ${fileName})`);
  }

  const backfires = splitSubSections(requireSection(sections, "Why This Usually Makes It Worse", fileName)).map(
    (s) => ({ title: toSingleLine(s.heading), body: toSingleLine(s.content) }),
  );
  if (backfires.length === 0) {
    throw new ContentParseError(`"## Why This Usually Makes It Worse" section has no ### items (file: ${fileName})`);
  }

  const tries = splitSubSections(requireSection(sections, "Try This Week", fileName)).map((s) => ({
    title: toSingleLine(s.heading),
    body: toSingleLine(s.content),
  }));
  if (tries.length === 0) {
    throw new ContentParseError(`"## Try This Week" section has no ### items (file: ${fileName})`);
  }

  const support = toSingleLine(requireSection(sections, "When To Get More Support", fileName));
  if (!support) {
    throw new ContentParseError(`"## When To Get More Support" section is empty (file: ${fileName})`);
  }

  return {
    slugName,
    icon,
    tag,
    title,
    cardTeaser,
    headline,
    intro,
    defaultAge,
    ageScenarios,
    whatHappening,
    backfires,
    tries,
    support,
    crisis,
    deepDiveLabel,
    deepDiveHref,
    related,
  };
}

/**
 * Parses + validates a `Module_*.md` source file. Same contract as
 * `parsePainPointSource` — throws `ContentParseError`, never returns
 * partial data. Caller must have already confirmed
 * `getSourceStatus(raw) === "ready"`.
 */
export function parseAwarenessModuleSource(raw: string, fileName: string): ParsedAwarenessModule {
  assertNoPlaceholders(raw, fileName);
  const { block, related, body } = parseSourceFile(raw, fileName);

  const type = block.get("type");
  if (type !== "awareness-module") {
    throw new ContentParseError(
      `Expected frontmatter "type: awareness-module", got ${JSON.stringify(type ?? null)} (file: ${fileName})`,
    );
  }

  const slugName = requireField(block, "slugName", fileName);
  validateSlug(slugName, fileName);

  const icon = requireField(block, "icon", fileName);
  validateIcon(icon, fileName);

  const tag = requireField(block, "tag", fileName);
  const title = requireField(block, "title", fileName);
  const cardTeaser = requireField(block, "cardTeaser", fileName);
  const headline = requireField(block, "headline", fileName);
  const crisis = parseCrisis(block, fileName);

  for (const ref of related) {
    validateHref(ref.href, `related[].href ("${ref.label}")`, fileName);
  }

  const rawSections = splitTopLevelSections(body);

  const introSection = rawSections.find((s) => s.heading === "Intro");
  const intro = introSection ? toSingleLine(introSection.content) : "";
  if (!intro) {
    throw new ContentParseError(`Missing or empty "## Intro" section (file: ${fileName})`);
  }

  const sections = rawSections
    .filter((s) => s.heading.startsWith("Section:"))
    .map((s) => ({
      heading: toSingleLine(s.heading.replace(/^Section:\s*/, "")),
      paragraphs: splitParagraphs(s.content),
    }));

  if (sections.length === 0) {
    throw new ContentParseError(
      `No "## Section: <Heading>" blocks found — at least one is required (file: ${fileName})`,
    );
  }
  for (const s of sections) {
    if (s.paragraphs.length === 0) {
      throw new ContentParseError(`Section "${s.heading}" has no content (file: ${fileName})`);
    }
  }

  return { slugName, icon, tag, title, cardTeaser, headline, intro, sections, crisis, related };
}
