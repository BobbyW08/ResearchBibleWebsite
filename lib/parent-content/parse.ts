/**
 * Pure, no-I/O parsing + hard-validation for the Parent Content sync
 * pipeline's source-file contract: `PainPoint_[Name].md` / `Module_[Name].md`
 * files produced by the `parent-content-builder` skill in the
 * `Parent Facing Content` Drive folder.
 *
 * Deliberately separate from `lib/research-bibles/parse.ts` — that file is
 * scoped to the bible's `# Research Bible: <Title>` H1 + changelog-block
 * format, none of which applies here. This file is written fresh against
 * the source-file contract in `Research-Content-Pipeline-Handoff-v5.md`
 * (§2), reusing only the low-level block-YAML reader from
 * `./frontmatter.ts` (itself new pipeline-specific code, not shared with
 * `lib/research-bibles/*`).
 *
 * Route-level note (see app/api/webhooks/parent-content-sync/route.ts): the
 * `href` validation below accepts `/docs/`, `/common-pain-points/`, and
 * `/help` (bare or with a trailing slug) rather than only `/docs/` and
 * `/help/` as the handoff's literal wording says. The 12 real, live
 * pain-point/module YAML files all link to each other via
 * `/common-pain-points/<slug>` (the canonical route) with one `/help` bare
 * link to the index — `/help/*` is a 301 redirect to `/common-pain-points/*`,
 * not the route content actually links to. Validating against the literal
 * spec wording would reject every real file's `related` links, so this
 * validates against the site's real current routes instead (CLAUDE.md: "If
 * you find code that contradicts this file... stop, confirm the real state,
 * and correct" — same principle applied to a source doc that drifted from
 * reality).
 */

import { parseYamlDocument, type ContentBlock, type YamlNode } from "./frontmatter.ts";
import { PAIN_POINT_ICONS } from "../pain-point-icons.ts";

export class ParentContentParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParentContentParseError";
  }
}

const APPROVED_ICONS = Object.keys(PAIN_POINT_ICONS);
const PLACEHOLDER_MARKERS = ["NEEDS SLUG", "TODO", "[GAP:", "[ACCURACY FLAG:"];

function isInternalHref(href: string): boolean {
  return href.startsWith("/docs/") || href.startsWith("/common-pain-points/") || href === "/help" || href.startsWith("/help/");
}

function checkPlaceholders(raw: string): void {
  for (const marker of PLACEHOLDER_MARKERS) {
    if (raw.includes(marker)) {
      throw new ParentContentParseError(`File still contains a placeholder marker (${marker}) — not ready for sync`);
    }
  }
}

function splitFrontmatterAndBody(raw: string): { frontmatter: string; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw.trimStart());
  if (!match) {
    throw new ParentContentParseError("File does not start with a --- frontmatter block");
  }
  return { frontmatter: match[1], body: match[2] };
}

function asString(node: YamlNode | undefined): string {
  return typeof node === "string" ? node.trim() : "";
}

function requireString(fm: Record<string, YamlNode>, key: string): string {
  const value = asString(fm[key]);
  if (!value) {
    throw new ParentContentParseError(`Missing or empty required frontmatter field: ${key}`);
  }
  return value;
}

function requireBoolean(fm: Record<string, YamlNode>, key: string): boolean {
  const raw = fm[key];
  if (raw !== true && raw !== false) {
    throw new ParentContentParseError(`Field "${key}" must be an explicit boolean (true/false), got: ${JSON.stringify(raw)}`);
  }
  return raw;
}

function requireIcon(fm: Record<string, YamlNode>): string {
  const icon = requireString(fm, "icon");
  if (!APPROVED_ICONS.includes(icon)) {
    throw new ParentContentParseError(
      `Field "icon" value "${icon}" is not one of the approved options: ${APPROVED_ICONS.join(", ")}`,
    );
  }
  return icon;
}

function requireHref(fm: Record<string, YamlNode>, key: string): string {
  const href = requireString(fm, key);
  if (!isInternalHref(href)) {
    throw new ParentContentParseError(`Field "${key}" ("${href}") must start with /docs/, /common-pain-points/, or /help`);
  }
  return href;
}

interface RelatedLinkSource {
  label: string;
  href: string;
}

function parseRelated(fm: Record<string, YamlNode>): RelatedLinkSource[] {
  const node = fm.related;
  if (node === undefined) return [];
  if (!Array.isArray(node)) {
    throw new ParentContentParseError('Field "related" must be a list');
  }
  return node.map((item, index) => {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      throw new ParentContentParseError(`related[${index}] must be an object with label/href`);
    }
    const label = asString(item.label);
    const href = asString(item.href);
    if (!label) throw new ParentContentParseError(`related[${index}].label is missing or empty`);
    if (!isInternalHref(href)) {
      throw new ParentContentParseError(`related[${index}].href ("${href}") must start with /docs/, /common-pain-points/, or /help`);
    }
    return { label, href };
  });
}

// ---------------------------------------------------------------------------
// Markdown body section parsing
// ---------------------------------------------------------------------------

interface Section {
  heading: string;
  content: string;
}

function splitByHeadingLevel(text: string, marker: "##" | "###"): Section[] {
  const lines = text.split(/\r\n|\r|\n/);
  const headingRe = new RegExp(`^${marker}\\s+(.+)$`);
  const sections: { heading: string; lines: string[] }[] = [];
  let current: { heading: string; lines: string[] } | null = null;

  for (const line of lines) {
    const m = headingRe.exec(line.trim());
    if (m) {
      current = { heading: m[1].trim(), lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }

  return sections.map((s) => ({ heading: s.heading, content: s.lines.join("\n").trim() }));
}

function toParagraphBlocks(content: string): ContentBlock[] {
  return content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((value) => ({ discriminant: "p" as const, value }));
}

function requireSection(sections: Section[], heading: string): string {
  const match = sections.find((s) => s.heading === heading);
  if (!match || !match.content) {
    throw new ParentContentParseError(`Missing required section: "## ${heading}"`);
  }
  return match.content;
}

// ---------------------------------------------------------------------------
// Pain Point
// ---------------------------------------------------------------------------

export interface PainPointSourceFields {
  slugName: string;
  icon: string;
  tag: string;
  title: string;
  cardTeaser: string;
  headline: string;
  intro: string;
  exampleScenario: string;
  whatHappening: ContentBlock[];
  backfires: { title: string; body: string }[];
  tries: { title: string; body: string }[];
  support: string;
  crisis: boolean;
  deepDiveLabel: string;
  deepDiveHref: string;
  related: RelatedLinkSource[];
}

export type SourceParseResult<T> = { status: "ready"; fields: T } | { status: "skipped"; reason: string };

export function parsePainPointSource(raw: string): SourceParseResult<PainPointSourceFields> {
  const { frontmatter: fmText, body } = splitFrontmatterAndBody(raw);
  const fm = parseYamlDocument(fmText);

  const status = asString(fm.status);
  if (status !== "ready") {
    return { status: "skipped", reason: `status is "${status || "(missing)"}", not "ready"` };
  }

  checkPlaceholders(raw);

  const type = asString(fm.type);
  if (type !== "pain-point") {
    throw new ParentContentParseError(`Expected frontmatter "type: pain-point" for a PainPoint_*.md file, got "${type}"`);
  }

  const slugName = requireString(fm, "slugName");
  if (!/^[a-z0-9-]+$/.test(slugName)) {
    throw new ParentContentParseError(`Field "slugName" ("${slugName}") must be lowercase letters, numbers, and hyphens only`);
  }

  const fields: PainPointSourceFields = {
    slugName,
    icon: requireIcon(fm),
    tag: requireString(fm, "tag"),
    title: requireString(fm, "title"),
    cardTeaser: requireString(fm, "cardTeaser"),
    headline: requireString(fm, "headline"),
    intro: "",
    exampleScenario: "",
    whatHappening: [],
    backfires: [],
    tries: [],
    support: "",
    crisis: requireBoolean(fm, "crisis"),
    deepDiveLabel: requireString(fm, "deepDiveLabel"),
    deepDiveHref: requireHref(fm, "deepDiveHref"),
    related: parseRelated(fm),
  };

  const topSections = splitByHeadingLevel(body, "##");

  fields.intro = requireSection(topSections, "Intro");
  fields.exampleScenario = requireSection(topSections, "Example Scenario");

  const whatHappeningRaw = requireSection(topSections, "What's Happening");
  fields.whatHappening = toParagraphBlocks(whatHappeningRaw);
  if (fields.whatHappening.length === 0) {
    throw new ParentContentParseError('Section "## What\'s Happening" has no paragraphs');
  }

  const backfiresRaw = requireSection(topSections, "Why This Usually Makes It Worse");
  fields.backfires = splitByHeadingLevel(backfiresRaw, "###").map((s) => ({ title: s.heading, body: s.content }));
  if (fields.backfires.length === 0) {
    throw new ParentContentParseError('Section "## Why This Usually Makes It Worse" has no ### items');
  }

  const triesRaw = requireSection(topSections, "Try This Week");
  fields.tries = splitByHeadingLevel(triesRaw, "###").map((s) => ({ title: s.heading, body: s.content }));
  if (fields.tries.length === 0) {
    throw new ParentContentParseError('Section "## Try This Week" has no ### items');
  }

  fields.support = requireSection(topSections, "When To Get More Support");

  return { status: "ready", fields };
}

// ---------------------------------------------------------------------------
// Awareness Module
// ---------------------------------------------------------------------------

export interface AwarenessModuleSourceFields {
  slugName: string;
  icon: string;
  tag: string;
  title: string;
  cardTeaser: string;
  headline: string;
  intro: string;
  sections: { heading: string; body: ContentBlock[] }[];
  crisis: boolean;
  related: RelatedLinkSource[];
}

export function parseAwarenessModuleSource(raw: string): SourceParseResult<AwarenessModuleSourceFields> {
  const { frontmatter: fmText, body } = splitFrontmatterAndBody(raw);
  const fm = parseYamlDocument(fmText);

  const status = asString(fm.status);
  if (status !== "ready") {
    return { status: "skipped", reason: `status is "${status || "(missing)"}", not "ready"` };
  }

  checkPlaceholders(raw);

  const type = asString(fm.type);
  if (type !== "awareness-module") {
    throw new ParentContentParseError(`Expected frontmatter "type: awareness-module" for a Module_*.md file, got "${type}"`);
  }

  const slugName = requireString(fm, "slugName");
  if (!/^[a-z0-9-]+$/.test(slugName)) {
    throw new ParentContentParseError(`Field "slugName" ("${slugName}") must be lowercase letters, numbers, and hyphens only`);
  }

  const fields: AwarenessModuleSourceFields = {
    slugName,
    icon: requireIcon(fm),
    tag: requireString(fm, "tag"),
    title: requireString(fm, "title"),
    cardTeaser: requireString(fm, "cardTeaser"),
    headline: requireString(fm, "headline"),
    intro: "",
    sections: [],
    crisis: requireBoolean(fm, "crisis"),
    related: parseRelated(fm),
  };

  const topSections = splitByHeadingLevel(body, "##");

  fields.intro = requireSection(topSections, "Intro");

  const sectionBlocks = topSections.filter((s) => s.heading.startsWith("Section:"));
  if (sectionBlocks.length === 0) {
    throw new ParentContentParseError('No "## Section: <Heading>" blocks found — at least one is required');
  }

  fields.sections = sectionBlocks.map((s) => {
    const heading = s.heading.slice("Section:".length).trim();
    if (!heading) {
      throw new ParentContentParseError('A "## Section:" heading is missing its title text');
    }
    const body = toParagraphBlocks(s.content);
    if (body.length === 0) {
      throw new ParentContentParseError(`Section "${heading}" has no paragraphs`);
    }
    return { heading, body };
  });

  return { status: "ready", fields };
}
