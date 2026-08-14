/**
 * Unit tests for lib/pain-points/parse.ts and lib/pain-points/yaml.ts, run
 * with Node's built-in test runner (same convention as
 * lib/research-bibles/parse.test.ts):
 *
 *   node --experimental-strip-types --test lib/pain-points/parse.test.ts
 *
 * Fixtures below are reverse-engineered from the real, live
 * `content/pain-points/meltdowns.yaml` and `content/awareness-modules/modern.yaml`
 * files back into the §2 source-file contract shape (Research-Content-Pipeline-Handoff-v3.md),
 * per the plan's testing instructions — content is the real copy from those
 * files (trimmed for brevity in a couple of spots), not synthetic filler.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ContentParseError,
  getSourceStatus,
  parseAwarenessModuleSource,
  parsePainPointSource,
} from "./parse.ts";
import {
  canonicalizeForDedup,
  diffTopLevelFields,
  extractFeaturedFlag,
  serializeAwarenessModuleYaml,
  serializePainPointYaml,
} from "./yaml.ts";

const PAIN_POINT_FIXTURE = `---
status: ready
type: pain-point
slugName: meltdowns
icon: Flame
tag: "Meltdowns & tantrums"
title: "My kid melts down over everything"
cardTeaser: "Why tiny triggers cause huge reactions — and what to do in the moment."
headline: "Why your kid loses it over small things (and what to do when it happens)"
defaultAge: "6-9"
crisis: false
deepDiveLabel: "De-Escalation and Crisis Planning"
deepDiveHref: /docs/de-escalation-crisis-planning
related:
  - label: "My kid hits, bites, or throws things"
    href: /help/aggression
  - label: "Morning chaos — routines"
    href: /help/routines
---

## Intro
The sock has a wrinkle. The juice is in the wrong cup. You said "no" to five more minutes. And now your child is on the floor, screaming, completely unreachable.

## Age Scenario: 2-5
Your 3-year-old collapses into a full meltdown because you gave them the wrong cup. It looks absurd, but their prefrontal cortex is still basically a toddler too.

## Age Scenario: 6-9
Your 7-year-old is completely fine one moment, then screaming because you turned the TV off. They're on the floor, not hearing you, not reachable by reason.

## Age Scenario: 10-12
Your 10-year-old loses it over a homework comment you made. The words coming back at you don't match the size of the situation.

## Age Scenario: 13+
Your 14-year-old goes from zero to full shutdown over something in a text thread. Teenagers' brains are actually more emotionally reactive than kids'.

## What's Happening
When a child melts down, their brain's threat-detection system has taken over. The prefrontal cortex essentially goes offline when the body shifts into survival mode.

Here's the critical piece: your child genuinely cannot hear your reasoning right now. They can't calm down on command.

## Why This Usually Makes It Worse
### Explaining, reasoning, or bargaining in the moment.
Logic requires the thinking brain — and the thinking brain is currently offline. No matter how clear your explanation is, it isn't reaching the part that processes it.

### Matching their intensity.
When you raise your voice, your child's nervous system reads "more danger." Your stress is contagious. So is your calm.

## Try This Week
### Regulate yourself before you enter the room.
Before you walk toward the meltdown, pause. Take three slow breaths. Drop your shoulders.

### Use fewer words, not more.
At the peak of a meltdown, "I'm here. You're safe." is enough. Stay nearby, stay quiet, stay calm.

## When To Get More Support
Look for help if meltdowns are happening multiple times per day, lasting more than 30-45 minutes, and showing no signs of decreasing over time.
`;

const AWARENESS_MODULE_FIXTURE = `---
status: ready
type: awareness-module
slugName: modern
icon: Globe
tag: "Awareness"
title: "Why modern parenting is so hard"
cardTeaser: "The structural reasons the role feels harder than a generation ago."
headline: "Why modern parenting is so hard (and why it's not because of you)"
crisis: false
related:
  - label: "I'm burnt out — and I don't know how to keep going"
    href: /help/burnout
  - label: "Where can you use support today?"
    href: /help
---

## Intro
If you feel like you're doing everything right and still drowning — you're not imagining it. Parenting in 2026 is genuinely more demanding than it was a generation ago.

## Section: The numbers don't lie
In 1965, mothers spent an average of 54 minutes per day on direct childcare. By the early 2000s, that number had more than doubled.

That gap isn't explained by personality. It's explained by what the role currently demands.

## Section: What actually changed
The economics of childhood got more competitive. Research across 11 countries found that in societies with higher income inequality, parents invest more intensively in their children.

The village disappeared. Extended family nearby, neighbors who knew your kids — most of that has dissolved.
`;

function withFrontmatterField(fixture: string, field: string, replacement: string): string {
  const lines = fixture.split("\n");
  return lines.map((line) => (line.startsWith(`${field}:`) ? replacement : line)).join("\n");
}

test("getSourceStatus: reads status from frontmatter", () => {
  assert.equal(getSourceStatus(PAIN_POINT_FIXTURE), "ready");
  assert.equal(getSourceStatus(withFrontmatterField(PAIN_POINT_FIXTURE, "status", "status: draft")), "draft");
});

test("getSourceStatus: returns undefined when no frontmatter block at all", () => {
  assert.equal(getSourceStatus("no frontmatter here"), undefined);
});

test("parsePainPointSource: happy path extracts all fields correctly", () => {
  const data = parsePainPointSource(PAIN_POINT_FIXTURE, "PainPoint_Meltdowns.md");
  assert.equal(data.slugName, "meltdowns");
  assert.equal(data.icon, "Flame");
  assert.equal(data.tag, "Meltdowns & tantrums");
  assert.equal(data.title, "My kid melts down over everything");
  assert.equal(data.defaultAge, "6-9");
  assert.equal(data.crisis, false);
  assert.equal(data.deepDiveHref, "/docs/de-escalation-crisis-planning");
  assert.equal(data.related.length, 2);
  assert.equal(data.related[0].href, "/help/aggression");
  assert.match(data.ageScenarios["2-5"], /collapses into a full meltdown/);
  assert.match(data.ageScenarios["13+"], /goes from zero to full shutdown/);
  assert.equal(data.whatHappening.length, 2);
  assert.equal(data.backfires.length, 2);
  assert.equal(data.backfires[0].title, "Explaining, reasoning, or bargaining in the moment.");
  assert.match(data.backfires[0].body, /Logic requires the thinking brain/);
  assert.equal(data.tries.length, 2);
  assert.match(data.support, /Look for help if meltdowns are happening/);
});

test("parsePainPointSource: throws ContentParseError when crisis is missing", () => {
  const fixture = PAIN_POINT_FIXTURE.replace("crisis: false\n", "");
  assert.throws(() => parsePainPointSource(fixture, "PainPoint_Meltdowns.md"), ContentParseError);
});

test("parsePainPointSource: throws ContentParseError when crisis is not a literal boolean", () => {
  const fixture = withFrontmatterField(PAIN_POINT_FIXTURE, "crisis", "crisis: maybe");
  assert.throws(() => parsePainPointSource(fixture, "PainPoint_Meltdowns.md"), ContentParseError);
});

test("parsePainPointSource: throws ContentParseError on an unapproved icon", () => {
  const fixture = withFrontmatterField(PAIN_POINT_FIXTURE, "icon", "icon: Skull");
  assert.throws(
    () => parsePainPointSource(fixture, "PainPoint_Meltdowns.md"),
    (err: unknown) => err instanceof ContentParseError && /Skull/.test(err.message),
  );
});

test("parsePainPointSource: throws ContentParseError on a placeholder marker anywhere in the file", () => {
  const fixture = PAIN_POINT_FIXTURE.replace(
    "Take three slow breaths.",
    "Take three slow breaths. [GAP: need a citation here]",
  );
  assert.throws(
    () => parsePainPointSource(fixture, "PainPoint_Meltdowns.md"),
    (err: unknown) => err instanceof ContentParseError && /\[GAP:/.test(err.message),
  );
});

test("parsePainPointSource: throws ContentParseError when deepDiveHref doesn't start with /docs/ or /help/", () => {
  const fixture = withFrontmatterField(
    PAIN_POINT_FIXTURE,
    "deepDiveHref",
    "deepDiveHref: https://example.com/de-escalation",
  );
  assert.throws(() => parsePainPointSource(fixture, "PainPoint_Meltdowns.md"), ContentParseError);
});

test("parsePainPointSource: throws ContentParseError when a related[].href doesn't start with /docs/ or /help/", () => {
  const fixture = PAIN_POINT_FIXTURE.replace("href: /help/aggression", "href: /aggression");
  assert.throws(() => parsePainPointSource(fixture, "PainPoint_Meltdowns.md"), ContentParseError);
});

test("parsePainPointSource: throws ContentParseError when a required section is missing", () => {
  const fixture = PAIN_POINT_FIXTURE.replace(
    /## When To Get More Support[\s\S]*$/,
    "",
  );
  assert.throws(() => parsePainPointSource(fixture, "PainPoint_Meltdowns.md"), ContentParseError);
});

test("parsePainPointSource: throws ContentParseError when type doesn't match pain-point", () => {
  const fixture = withFrontmatterField(PAIN_POINT_FIXTURE, "type", "type: awareness-module");
  assert.throws(() => parsePainPointSource(fixture, "PainPoint_Meltdowns.md"), ContentParseError);
});

test("parseAwarenessModuleSource: happy path extracts all fields correctly", () => {
  const data = parseAwarenessModuleSource(AWARENESS_MODULE_FIXTURE, "Module_Modern.md");
  assert.equal(data.slugName, "modern");
  assert.equal(data.icon, "Globe");
  assert.equal(data.title, "Why modern parenting is so hard");
  assert.equal(data.crisis, false);
  assert.match(data.intro, /you're not imagining it/);
  assert.equal(data.sections.length, 2);
  assert.equal(data.sections[0].heading, "The numbers don't lie");
  assert.equal(data.sections[0].paragraphs.length, 2);
  assert.equal(data.sections[1].heading, "What actually changed");
  assert.equal(data.related.length, 2);
});

test("parseAwarenessModuleSource: throws ContentParseError when no Section: blocks are present", () => {
  const fixture = AWARENESS_MODULE_FIXTURE.replace(/## Section:[\s\S]*$/, "");
  assert.throws(() => parseAwarenessModuleSource(fixture, "Module_Modern.md"), ContentParseError);
});

test("serializePainPointYaml: round-trips into the hand-authored folded-block-scalar shape", () => {
  const data = parsePainPointSource(PAIN_POINT_FIXTURE, "PainPoint_Meltdowns.md");
  const yaml = serializePainPointYaml(data, true);
  assert.match(yaml, /^slugName: meltdowns\n/);
  assert.match(yaml, /^icon: Flame\n/m);
  assert.match(yaml, /^featured: true\n/m);
  assert.match(yaml, /^tag: >-\n {2}Meltdowns & tantrums\n/m);
  assert.match(yaml, /^defaultAge: "6-9"\n/m);
  assert.match(yaml, /^crisis: false\n/m);
  assert.match(yaml, /^deepDiveHref: \/docs\/de-escalation-crisis-planning\n/m);
  assert.match(yaml, /related:\n {2}- label: >-\n {6}My kid hits, bites, or throws things\n {4}href: \/help\/aggression\n/);
});

test("serializeAwarenessModuleYaml: round-trips sections into nested content-block shape", () => {
  const data = parseAwarenessModuleSource(AWARENESS_MODULE_FIXTURE, "Module_Modern.md");
  const yaml = serializeAwarenessModuleYaml(data);
  assert.match(yaml, /^slugName: modern\n/);
  assert.match(
    yaml,
    /sections:\n {2}- heading: >-\n {6}The numbers don't lie\n {4}body:\n {6}- discriminant: p\n {8}value: >-\n {10}In 1965/,
  );
  assert.doesNotMatch(yaml, /featured:/);
});

test("extractFeaturedFlag: reads true/false, defaults to false when absent or no file", () => {
  assert.equal(extractFeaturedFlag("featured: true\nother: 1"), true);
  assert.equal(extractFeaturedFlag("featured: false\nother: 1"), false);
  assert.equal(extractFeaturedFlag("other: 1"), false);
  assert.equal(extractFeaturedFlag(null), false);
});

test("canonicalizeForDedup: strips the featured line so it never counts as a content diff", () => {
  const a = "slugName: x\nfeatured: true\ntag: >-\n  Foo\n";
  const b = "slugName: x\nfeatured: false\ntag: >-\n  Foo\n";
  assert.equal(canonicalizeForDedup(a), canonicalizeForDedup(b));
});

test("diffTopLevelFields: reports every field as changed when oldRaw is null (first sync)", () => {
  const newYaml = "slugName: x\ntag: >-\n  Foo\n";
  assert.deepEqual(diffTopLevelFields(null, newYaml), ["slugName", "tag"]);
});

test("diffTopLevelFields: reports only the fields whose content actually differs", () => {
  const oldYaml = "slugName: x\ntag: >-\n  Foo\nheadline: >-\n  Same\n";
  const newYaml = "slugName: x\ntag: >-\n  Bar\nheadline: >-\n  Same\n";
  assert.deepEqual(diffTopLevelFields(oldYaml, newYaml), ["tag"]);
});
