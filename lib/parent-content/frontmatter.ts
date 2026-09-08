/**
 * Purpose-built (NOT general-purpose) YAML reader/writer for exactly the
 * `painPoints` and `awarenessModules` Keystatic collection schemas
 * (`format: { data: "yaml" }` — the whole file IS the YAML data, no
 * frontmatter/body split like the research-bibles collection).
 *
 * Deliberately separate from `lib/research-bibles/frontmatter.ts` — this
 * schema is nested (arrays of objects, arrays of content blocks) rather than
 * flat frontmatter, so it needs its own small hand-rolled YAML-subset reader
 * instead of that file's flat regex approach. No `js-yaml`/`yaml` dependency
 * is added — CLAUDE.md's locked tech stack forbids new deps, and this repo's
 * convention (see research-bibles/frontmatter.ts) is to hand-roll a reader
 * scoped to exactly the shape this file itself writes, not a spec-complete
 * YAML implementation.
 *
 * The writer emits Keystatic's own style — `>-` folded block scalars for
 * free text, block sequences (`- key: value`) for arrays of objects — which
 * is what the 10 real `content/pain-points/*.yaml` files already look like
 * (verified against `meltdowns.yaml`, `modern.yaml`, `mentalhealth.yaml`).
 * This is different from the research-bible serializer's JSON-string-scalar
 * shortcut: this file's reader is needed to parse those *real, existing*
 * hand/Keystatic-authored files back (for the dedup guard and to preserve
 * the site-owned `featured` flag on resync), so it has to understand the
 * real style regardless — once that reader exists, writing the same style
 * back out is barely more work and produces output much closer to what
 * Keystatic itself would write.
 *
 * Known simplification: the writer never wraps long folded-scalar lines
 * (matches the real files — none of them wrap either, e.g. `intro` in
 * `meltdowns.yaml` is one long unwrapped line). Multi-paragraph content
 * within a single folded scalar (blank-line-separated) is supported by the
 * reader (folded-scalar semantics: single newline -> space, blank line ->
 * newline) but this schema never actually needs it — multi-paragraph
 * content always lives in arrays (`whatHappening`, `sections[].body`), never
 * embedded newlines inside one scalar field.
 *
 * FLAG FOR BOBBY: same as the bible pipeline — verify this against a real
 * entry saved by hand through `/keystatic` once that's reachable, before
 * fully trusting it in production (see CLAUDE.md's Keystatic CMS section).
 */

export type ContentBlock =
  | { discriminant: "p"; value: string }
  | { discriminant: "stat"; value: string }
  | { discriminant: "list"; value: string[] };

export interface TitledBody {
  title: string;
  body: string;
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface PainPointYaml {
  slugName: string;
  icon: string;
  featured: boolean;
  tag: string;
  title: string;
  cardTeaser: string;
  headline: string;
  intro: string;
  exampleScenario: string;
  whatHappening: ContentBlock[];
  backfires: TitledBody[];
  tries: TitledBody[];
  support: string;
  crisis: boolean;
  deepDiveLabel: string;
  deepDiveHref: string;
  related: RelatedLink[];
}

export interface AwarenessModuleSection {
  heading: string;
  body: ContentBlock[];
}

export interface AwarenessModuleYaml {
  slugName: string;
  icon: string;
  tag: string;
  title: string;
  cardTeaser: string;
  headline: string;
  intro: string;
  sections: AwarenessModuleSection[];
  crisis: boolean;
  related: RelatedLink[];
}

// ---------------------------------------------------------------------------
// Generic (but scoped) block-YAML reader.
//
// Understands exactly the subset this schema uses: top-level mappings of
// `key: value`, `key: >-` / `key: |-` folded/literal block scalars, `key: []`
// empty sequences, and `key:` followed by an indented block sequence
// (`- item`) whose items are either scalars (optionally themselves folded
// block scalars) or inline mappings (`- firstKey: value` then sibling keys
// at the same indent). This exactly matches the indentation Keystatic's own
// YAML writer produces (verified against the real content files) — it is
// NOT a general YAML parser (no flow collections, no anchors, no multi-doc).
// ---------------------------------------------------------------------------

export type YamlNode = string | boolean | YamlNode[] | { [key: string]: YamlNode };

function indentOf(line: string): number {
  let i = 0;
  while (i < line.length && line[i] === " ") i++;
  return i;
}

/**
 * Strips a trailing ` # comment` from an inline scalar (the source-file
 * contract's documented examples use these on `status`/`icon`/`crisis`,
 * e.g. `status: ready               # draft | ready — ...`). Only a `#`
 * preceded by whitespace (or at the very start) starts a comment — matches
 * real YAML comment semantics — and a `#` inside a quoted string is never
 * treated as one, so quoted values can contain a literal `#`.
 */
function stripInlineComment(text: string): string {
  let quote: string | null = null;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === "#" && (i === 0 || /\s/.test(text[i - 1]))) {
      return text.slice(0, i);
    }
  }
  return text;
}

function parseScalarInline(text: string): string | boolean {
  const trimmed = stripInlineComment(text).trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed.startsWith('"')) {
    try {
      return JSON.parse(trimmed) as string;
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

function peekNextNonBlank(lines: string[], from: number): number | null {
  for (let i = from; i < lines.length; i++) {
    if (lines[i].trim() !== "") return i;
  }
  return null;
}

function parseFoldedScalar(lines: string[], pos: { i: number }, indent: number, literal: boolean): string {
  const collected: string[] = [];
  while (pos.i < lines.length) {
    const line = lines[pos.i];
    if (line.trim() === "") {
      collected.push("");
      pos.i++;
      continue;
    }
    if (indentOf(line) < indent) break;
    collected.push(line.slice(indent));
    pos.i++;
  }
  while (collected.length > 0 && collected[collected.length - 1] === "") collected.pop();

  if (literal) return collected.join("\n");

  let result = "";
  let prevWasBlank = false;
  for (const line of collected) {
    if (line === "") {
      result += "\n";
      prevWasBlank = true;
    } else {
      if (result !== "" && !prevWasBlank) result += " ";
      result += line;
      prevWasBlank = false;
    }
  }
  return result;
}

function parseSequence(lines: string[], pos: { i: number }, indent: number): YamlNode[] {
  const items: YamlNode[] = [];
  while (pos.i < lines.length) {
    const line = lines[pos.i];
    if (line.trim() === "") {
      pos.i++;
      continue;
    }
    const lineIndent = indentOf(line);
    if (lineIndent < indent) break;
    if (lineIndent > indent) {
      throw new Error(`Unexpected indentation in YAML sequence at line ${pos.i + 1}: ${JSON.stringify(line)}`);
    }
    const trimmed = line.slice(indent);
    if (!trimmed.startsWith("-")) {
      throw new Error(`Expected sequence item ("- ...") at line ${pos.i + 1}: ${JSON.stringify(line)}`);
    }
    const afterDash = trimmed.slice(1).replace(/^ /, "");
    const virtualIndent = indent + 2;

    if (afterDash.trim() === "") {
      pos.i++;
      items.push(parseMapping(lines, pos, virtualIndent));
    } else if (/^[A-Za-z0-9_]+:(\s|$)/.test(afterDash)) {
      // Inline first key of a mapping item — splice a synthetic line at the
      // item's virtual indent so parseMapping can read it uniformly with
      // this item's other (really indented) sibling keys.
      lines[pos.i] = " ".repeat(virtualIndent) + afterDash;
      items.push(parseMapping(lines, pos, virtualIndent));
    } else if (afterDash.trim() === ">-" || afterDash.trim() === "|-") {
      const literal = afterDash.trim() === "|-";
      pos.i++;
      items.push(parseFoldedScalar(lines, pos, virtualIndent, literal));
    } else {
      pos.i++;
      items.push(parseScalarInline(afterDash));
    }
  }
  return items;
}

function parseMapping(lines: string[], pos: { i: number }, indent: number): Record<string, YamlNode> {
  const result: Record<string, YamlNode> = {};
  while (pos.i < lines.length) {
    const line = lines[pos.i];
    if (line.trim() === "") {
      pos.i++;
      continue;
    }
    const lineIndent = indentOf(line);
    if (lineIndent < indent) break;
    if (lineIndent > indent) {
      throw new Error(`Unexpected indentation in YAML mapping at line ${pos.i + 1}: ${JSON.stringify(line)}`);
    }
    const trimmed = line.slice(indent);
    const keyMatch = /^([A-Za-z0-9_]+):\s?(.*)$/.exec(trimmed);
    if (!keyMatch) {
      throw new Error(`Expected "key: value" at line ${pos.i + 1}: ${JSON.stringify(line)}`);
    }
    const [, key, rest] = keyMatch;
    pos.i++;

    if (rest === ">-" || rest === "|-") {
      result[key] = parseFoldedScalar(lines, pos, indent + 2, rest === "|-");
    } else if (rest === "[]") {
      result[key] = [];
    } else if (rest === "") {
      const nextIdx = peekNextNonBlank(lines, pos.i);
      const seqIndent = indent + 2;
      if (nextIdx !== null && indentOf(lines[nextIdx]) === seqIndent && lines[nextIdx].slice(seqIndent).startsWith("-")) {
        result[key] = parseSequence(lines, pos, seqIndent);
      } else {
        result[key] = [];
      }
    } else {
      result[key] = parseScalarInline(rest);
    }
  }
  return result;
}

/** Parses a full block-YAML document (no `---` markers) into a plain object tree. */
export function parseYamlDocument(raw: string): Record<string, YamlNode> {
  const lines = raw.split(/\r\n|\r|\n/);
  const pos = { i: 0 };
  return parseMapping(lines, pos, 0);
}

// ---------------------------------------------------------------------------
// Writer
// ---------------------------------------------------------------------------

function pad(indent: number): string {
  return " ".repeat(indent);
}

function emitFolded(key: string, value: string, indent: number): string[] {
  const lines = value.split("\n");
  const out = [`${pad(indent)}${key}: >-`];
  const inner = indent + 2;
  for (const line of lines) {
    out.push(line === "" ? "" : `${pad(inner)}${line}`);
  }
  return out;
}

function emitPlain(key: string, value: string, indent: number): string {
  return `${pad(indent)}${key}: ${value}`;
}

function emitBool(key: string, value: boolean, indent: number): string {
  return `${pad(indent)}${key}: ${value ? "true" : "false"}`;
}

function emitContentBlock(block: ContentBlock, indent: number): string[] {
  const out: string[] = [`${pad(indent)}- discriminant: ${block.discriminant}`];
  if (block.discriminant === "list") {
    out.push(`${pad(indent + 2)}value:`);
    for (const item of block.value) {
      out.push(`${pad(indent + 4)}- >-`);
      out.push(`${pad(indent + 6)}${item}`);
    }
  } else {
    out.push(...emitFolded("value", block.value, indent + 2));
  }
  return out;
}

function emitTitledBody(item: TitledBody, indent: number): string[] {
  const [firstLine, ...rest] = emitFolded("title", item.title, indent + 2);
  return [`${pad(indent)}- ${firstLine.trim()}`, ...rest, ...emitFolded("body", item.body, indent + 2)];
}

function emitRelatedLink(item: RelatedLink, indent: number): string[] {
  const [firstLine, ...rest] = emitFolded("label", item.label, indent + 2);
  return [`${pad(indent)}- ${firstLine.trim()}`, ...rest, `${pad(indent + 2)}href: ${item.href}`];
}

export function serializePainPointYaml(data: PainPointYaml): string {
  const lines: string[] = [];
  lines.push(emitPlain("slugName", data.slugName, 0));
  lines.push(emitPlain("icon", data.icon, 0));
  lines.push(emitBool("featured", data.featured, 0));
  lines.push(...emitFolded("tag", data.tag, 0));
  lines.push(...emitFolded("title", data.title, 0));
  lines.push(...emitFolded("cardTeaser", data.cardTeaser, 0));
  lines.push(...emitFolded("headline", data.headline, 0));
  lines.push(...emitFolded("intro", data.intro, 0));
  lines.push(...emitFolded("exampleScenario", data.exampleScenario, 0));

  lines.push("whatHappening:");
  for (const block of data.whatHappening) lines.push(...emitContentBlock(block, 2));

  lines.push("backfires:");
  for (const item of data.backfires) lines.push(...emitTitledBody(item, 2));

  lines.push("tries:");
  for (const item of data.tries) lines.push(...emitTitledBody(item, 2));

  lines.push(...emitFolded("support", data.support, 0));
  lines.push(emitBool("crisis", data.crisis, 0));
  lines.push(...emitFolded("deepDiveLabel", data.deepDiveLabel, 0));
  lines.push(emitPlain("deepDiveHref", data.deepDiveHref, 0));

  lines.push("related:");
  for (const item of data.related) lines.push(...emitRelatedLink(item, 2));

  return `${lines.join("\n")}\n`;
}

export function serializeAwarenessModuleYaml(data: AwarenessModuleYaml): string {
  const lines: string[] = [];
  lines.push(emitPlain("slugName", data.slugName, 0));
  lines.push(emitPlain("icon", data.icon, 0));
  lines.push(...emitFolded("tag", data.tag, 0));
  lines.push(...emitFolded("title", data.title, 0));
  lines.push(...emitFolded("cardTeaser", data.cardTeaser, 0));
  lines.push(...emitFolded("headline", data.headline, 0));
  lines.push(...emitFolded("intro", data.intro, 0));

  lines.push("sections:");
  for (const section of data.sections) {
    const [firstLine, ...rest] = emitFolded("heading", section.heading, 4);
    lines.push(`  - ${firstLine.trim()}`, ...rest);
    lines.push("    body:");
    for (const block of section.body) lines.push(...emitContentBlock(block, 6));
  }

  lines.push(emitBool("crisis", data.crisis, 0));

  lines.push("related:");
  for (const item of data.related) lines.push(...emitRelatedLink(item, 2));

  return `${lines.join("\n")}\n`;
}

// ---------------------------------------------------------------------------
// Typed readers (built on parseYamlDocument), used to read back an existing
// `content/pain-points/*.yaml` / `content/awareness-modules/*.yaml` file —
// including the 10/2 real, pre-existing hand/Keystatic-authored ones — for
// the webhook's dedup guard and to preserve the site-owned `featured` flag.
// Returns `null` (never throws) on any shape mismatch, mirroring
// `lib/research-bibles/frontmatter.ts`'s `parseBibleFile`.
// ---------------------------------------------------------------------------

function asString(node: YamlNode | undefined): string {
  return typeof node === "string" ? node : "";
}

function asBool(node: YamlNode | undefined): boolean {
  return node === true;
}

function toContentBlocks(node: YamlNode | undefined): ContentBlock[] {
  if (!Array.isArray(node)) return [];
  const blocks: ContentBlock[] = [];
  for (const item of node) {
    if (typeof item !== "object" || item === null || Array.isArray(item)) continue;
    const discriminant = asString((item as Record<string, YamlNode>).discriminant);
    const value = (item as Record<string, YamlNode>).value;
    if (discriminant === "list" && Array.isArray(value)) {
      blocks.push({ discriminant: "list", value: value.map((v) => asString(v)) });
    } else if (discriminant === "p" || discriminant === "stat") {
      blocks.push({ discriminant, value: asString(value) });
    }
  }
  return blocks;
}

function toTitledBodies(node: YamlNode | undefined): TitledBody[] {
  if (!Array.isArray(node)) return [];
  return node
    .filter((item): item is Record<string, YamlNode> => typeof item === "object" && item !== null && !Array.isArray(item))
    .map((item) => ({ title: asString(item.title), body: asString(item.body) }));
}

function toRelatedLinks(node: YamlNode | undefined): RelatedLink[] {
  if (!Array.isArray(node)) return [];
  return node
    .filter((item): item is Record<string, YamlNode> => typeof item === "object" && item !== null && !Array.isArray(item))
    .map((item) => ({ label: asString(item.label), href: asString(item.href) }));
}

export function parsePainPointYaml(raw: string): PainPointYaml | null {
  try {
    const doc = parseYamlDocument(raw);
    if (!doc.slugName) return null;
    return {
      slugName: asString(doc.slugName),
      icon: asString(doc.icon),
      featured: asBool(doc.featured),
      tag: asString(doc.tag),
      title: asString(doc.title),
      cardTeaser: asString(doc.cardTeaser),
      headline: asString(doc.headline),
      intro: asString(doc.intro),
      exampleScenario: asString(doc.exampleScenario),
      whatHappening: toContentBlocks(doc.whatHappening),
      backfires: toTitledBodies(doc.backfires),
      tries: toTitledBodies(doc.tries),
      support: asString(doc.support),
      crisis: asBool(doc.crisis),
      deepDiveLabel: asString(doc.deepDiveLabel),
      deepDiveHref: asString(doc.deepDiveHref),
      related: toRelatedLinks(doc.related),
    };
  } catch {
    return null;
  }
}

export function parseAwarenessModuleYaml(raw: string): AwarenessModuleYaml | null {
  try {
    const doc = parseYamlDocument(raw);
    if (!doc.slugName) return null;
    const sectionsNode = doc.sections;
    const sections: AwarenessModuleSection[] = Array.isArray(sectionsNode)
      ? sectionsNode
          .filter((item): item is Record<string, YamlNode> => typeof item === "object" && item !== null && !Array.isArray(item))
          .map((item) => ({ heading: asString(item.heading), body: toContentBlocks(item.body) }))
      : [];
    return {
      slugName: asString(doc.slugName),
      icon: asString(doc.icon),
      tag: asString(doc.tag),
      title: asString(doc.title),
      cardTeaser: asString(doc.cardTeaser),
      headline: asString(doc.headline),
      intro: asString(doc.intro),
      sections,
      crisis: asBool(doc.crisis),
      related: toRelatedLinks(doc.related),
    };
  } catch {
    return null;
  }
}
