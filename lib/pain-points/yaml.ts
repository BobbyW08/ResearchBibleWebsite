/**
 * Serializes parsed Parent Facing Content into the exact YAML shape the
 * `painPoints` / `awarenessModules` Keystatic collections read
 * (`content/pain-points/*.yaml`, `content/awareness-modules/*.yaml`,
 * `format: { data: "yaml" }`).
 *
 * Unlike `lib/research-bibles/frontmatter.ts` (which deliberately emits
 * JSON-string flow scalars to avoid a YAML dependency, accepting that it
 * won't look hand-authored), this serializer instead reproduces the exact
 * folded-block-scalar style (`key: >-` + indented content) that the 10 live
 * hand-authored files (e.g. `content/pain-points/meltdowns.yaml`,
 * `content/awareness-modules/modern.yaml`) already use. That's worth the
 * extra code here specifically because the plan's verification checklist
 * requires generated files to "match the shape of the 10 existing
 * hand-authored entries" — and because matching format makes the dedup
 * guard below meaningful (see canonicalizeForDedup).
 *
 * Still hand-rolled, still no general YAML dependency — this only emits the
 * small fixed set of shapes this schema actually uses (scalar, folded block
 * scalar, quoted scalar, and the 4 known array-of-object shapes), not a
 * general YAML writer.
 */

import type { LinkRef, ListItem, ParsedAwarenessModule, ParsedPainPoint } from "./parse";

function emitContentBlocks(lines: string[], key: string, paragraphs: string[]): void {
  if (paragraphs.length === 0) {
    lines.push(`${key}: []`);
    return;
  }
  lines.push(`${key}:`);
  for (const p of paragraphs) {
    lines.push(`  - discriminant: p`);
    lines.push(`    value: >-`);
    lines.push(`      ${p}`);
  }
}

function emitListItems(lines: string[], key: string, items: ListItem[]): void {
  if (items.length === 0) {
    lines.push(`${key}: []`);
    return;
  }
  lines.push(`${key}:`);
  for (const item of items) {
    lines.push(`  - title: >-`);
    lines.push(`      ${item.title}`);
    lines.push(`    body: >-`);
    lines.push(`      ${item.body}`);
  }
}

function emitLinkRefs(lines: string[], key: string, refs: LinkRef[]): void {
  if (refs.length === 0) {
    lines.push(`${key}: []`);
    return;
  }
  lines.push(`${key}:`);
  for (const ref of refs) {
    lines.push(`  - label: >-`);
    lines.push(`      ${ref.label}`);
    lines.push(`    href: ${ref.href}`);
  }
}

function emitSections(lines: string[], sections: { heading: string; paragraphs: string[] }[]): void {
  if (sections.length === 0) {
    lines.push(`sections: []`);
    return;
  }
  lines.push(`sections:`);
  for (const s of sections) {
    lines.push(`  - heading: >-`);
    lines.push(`      ${s.heading}`);
    if (s.paragraphs.length === 0) {
      lines.push(`    body: []`);
      continue;
    }
    lines.push(`    body:`);
    for (const p of s.paragraphs) {
      lines.push(`      - discriminant: p`);
      lines.push(`        value: >-`);
      lines.push(`          ${p}`);
    }
  }
}

function emitAgeScenario(lines: string[], key: string, value: string): void {
  lines.push(`${key}: >-`);
  lines.push(`  ${value}`);
}

/**
 * Serializes a pain point into `content/pain-points/<slug>.yaml` shape.
 * `featured` is site-owned (see plan §4) — caller passes whatever value
 * should be preserved/defaulted, never derived from the source file.
 */
export function serializePainPointYaml(data: ParsedPainPoint, featured: boolean): string {
  const lines: string[] = [];
  lines.push(`slugName: ${data.slugName}`);
  lines.push(`icon: ${data.icon}`);
  lines.push(`featured: ${featured ? "true" : "false"}`);
  lines.push(`tag: >-`);
  lines.push(`  ${data.tag}`);
  lines.push(`title: >-`);
  lines.push(`  ${data.title}`);
  lines.push(`cardTeaser: >-`);
  lines.push(`  ${data.cardTeaser}`);
  lines.push(`headline: >-`);
  lines.push(`  ${data.headline}`);
  lines.push(`intro: >-`);
  lines.push(`  ${data.intro}`);
  lines.push(`defaultAge: ${JSON.stringify(data.defaultAge)}`);
  emitAgeScenario(lines, "ageScenario25", data.ageScenarios["2-5"]);
  emitAgeScenario(lines, "ageScenario69", data.ageScenarios["6-9"]);
  emitAgeScenario(lines, "ageScenario1012", data.ageScenarios["10-12"]);
  emitAgeScenario(lines, "ageScenario13plus", data.ageScenarios["13+"]);
  emitContentBlocks(lines, "whatHappening", data.whatHappening);
  emitListItems(lines, "backfires", data.backfires);
  emitListItems(lines, "tries", data.tries);
  lines.push(`support: >-`);
  lines.push(`  ${data.support}`);
  lines.push(`crisis: ${data.crisis ? "true" : "false"}`);
  lines.push(`deepDiveLabel: >-`);
  lines.push(`  ${data.deepDiveLabel}`);
  lines.push(`deepDiveHref: ${data.deepDiveHref}`);
  emitLinkRefs(lines, "related", data.related);
  return `${lines.join("\n")}\n`;
}

/** Serializes an awareness module into `content/awareness-modules/<slug>.yaml` shape. No site-owned fields. */
export function serializeAwarenessModuleYaml(data: ParsedAwarenessModule): string {
  const lines: string[] = [];
  lines.push(`slugName: ${data.slugName}`);
  lines.push(`icon: ${data.icon}`);
  lines.push(`tag: >-`);
  lines.push(`  ${data.tag}`);
  lines.push(`title: >-`);
  lines.push(`  ${data.title}`);
  lines.push(`cardTeaser: >-`);
  lines.push(`  ${data.cardTeaser}`);
  lines.push(`headline: >-`);
  lines.push(`  ${data.headline}`);
  lines.push(`intro: >-`);
  lines.push(`  ${data.intro}`);
  emitSections(lines, data.sections);
  lines.push(`crisis: ${data.crisis ? "true" : "false"}`);
  emitLinkRefs(lines, "related", data.related);
  return `${lines.join("\n")}\n`;
}

/** Reads the site-owned `featured` flag out of an existing pain-point YAML file's raw text. Defaults to `false` if absent/no file yet. */
export function extractFeaturedFlag(raw: string | null): boolean {
  if (!raw) return false;
  const m = /^featured:\s*(true|false)\s*$/m.exec(raw);
  return m ? m[1] === "true" : false;
}

/**
 * Strips the site-owned `featured` line before comparing two pain-point YAML
 * texts, so a `featured` change made by Bobby in Keystatic never counts as a
 * content difference for the dedup guard.
 */
export function canonicalizeForDedup(raw: string): string {
  return raw.replace(/^featured:\s*(true|false)\s*\n/m, "").trim();
}

/**
 * Splits a generated YAML file's text into its top-level (`key:` at column
 * 0) field blocks. Used only to produce a human-readable "changed fields"
 * list for the PR body — not a general YAML parser, just line grouping by
 * indentation. Relies on both `raw` strings having been produced by this
 * module's own serializers (or, for the pre-existing hand-authored files,
 * the same top-level-key-at-column-0 convention they already follow).
 */
function extractTopLevelBlocks(yamlText: string): Map<string, string> {
  const lines = yamlText.split("\n");
  const blocks = new Map<string, string>();
  let currentKey: string | null = null;
  let buf: string[] = [];

  for (const line of lines) {
    const m = /^([A-Za-z][A-Za-z0-9]*):/.exec(line);
    if (m) {
      if (currentKey) blocks.set(currentKey, buf.join("\n"));
      currentKey = m[1];
      buf = [line];
    } else {
      buf.push(line);
    }
  }
  if (currentKey) blocks.set(currentKey, buf.join("\n"));

  return blocks;
}

/** Returns the list of top-level field names whose content differs between `oldRaw` and `newRaw`. If `oldRaw` is `null` (first sync), returns every field name. */
export function diffTopLevelFields(oldRaw: string | null, newRaw: string): string[] {
  const newBlocks = extractTopLevelBlocks(newRaw);
  if (!oldRaw) return [...newBlocks.keys()];

  const oldBlocks = extractTopLevelBlocks(oldRaw);
  const changed: string[] = [];
  for (const [key, value] of newBlocks) {
    if ((oldBlocks.get(key) ?? "").trim() !== value.trim()) changed.push(key);
  }
  return changed;
}
