/**
 * Unit tests for lib/parent-content/parse.ts, run with Node's built-in test
 * runner (matches lib/research-bibles/parse.test.ts's convention):
 *
 *   node --experimental-strip-types --test lib/parent-content/parse.test.ts
 *
 * Fixtures below reverse-engineer the real, live
 * content/pain-points/meltdowns.yaml and content/awareness-modules/modern.yaml
 * back into the §2 source-file contract shape from
 * Research-Content-Pipeline-Handoff-v5.md, so these tests exercise the
 * parser against content that's known to already exist on the live site,
 * not an invented shape.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePainPointSource, parseAwarenessModuleSource, ParentContentParseError } from "./parse.ts";

const VALID_PAIN_POINT = `---
status: ready
type: pain-point
slugName: meltdowns
icon: Flame
tag: "Meltdowns & tantrums"
title: "My kid melts down over everything"
cardTeaser: "Why tiny triggers cause huge reactions — and what to do in the moment."
headline: "Why your kid loses it over small things (and what to do when it happens)"
crisis: false
deepDiveLabel: "De-Escalation and Crisis Planning"
deepDiveHref: /docs/de-escalation-crisis-planning
related:
  - label: "My kid hits, bites, or throws things"
    href: /common-pain-points/aggression
  - label: "Morning chaos — routines"
    href: /common-pain-points/routines
---

## Intro
The sock has a wrinkle. The juice is in the wrong cup.

## Example Scenario
Maybe it's the wrong cup, a "no" to five more minutes, or something in a text thread — the trigger looks different at every age, but the pattern is the same.

## What's Happening
When a child melts down, their brain's threat-detection system has taken over.

Here's the critical piece: your child genuinely cannot hear your reasoning right now.

## Why This Usually Makes It Worse
### Explaining, reasoning, or bargaining in the moment.
Logic requires the thinking brain — and the thinking brain is currently offline.

### Matching their intensity.
When you raise your voice, your child's nervous system reads "more danger."

## Try This Week
### Regulate yourself before you enter the room.
Before you walk toward the meltdown, pause.

## When To Get More Support
Look for help if meltdowns are happening multiple times per day.
`;

const VALID_MODULE = `---
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
  - label: "I'm burnt out"
    href: /common-pain-points/burnout
---

## Intro
If you feel like you're doing everything right and still drowning — you're not imagining it.

## Section: The numbers don't lie
In 1965, mothers spent an average of 54 minutes per day on direct childcare.

By the early 2000s, that number had more than doubled.

## Section: What actually changed
The economics of childhood got more competitive.
`;

test("parsePainPointSource: parses a valid, real-shaped file end to end", () => {
  const result = parsePainPointSource(VALID_PAIN_POINT);
  assert.equal(result.status, "ready");
  if (result.status !== "ready") throw new Error("unreachable");
  assert.equal(result.fields.slugName, "meltdowns");
  assert.equal(result.fields.icon, "Flame");
  assert.equal(result.fields.crisis, false);
  assert.equal(result.fields.exampleScenario, 'Maybe it\'s the wrong cup, a "no" to five more minutes, or something in a text thread — the trigger looks different at every age, but the pattern is the same.');
  assert.equal(result.fields.deepDiveHref, "/docs/de-escalation-crisis-planning");
  assert.equal(result.fields.whatHappening.length, 2);
  assert.equal(result.fields.backfires.length, 2);
  assert.equal(result.fields.backfires[0].title, "Explaining, reasoning, or bargaining in the moment.");
  assert.equal(result.fields.tries.length, 1);
  assert.equal(result.fields.related.length, 2);
  assert.equal(result.fields.related[0].href, "/common-pain-points/aggression");
});

test("parseAwarenessModuleSource: parses a valid, real-shaped file end to end", () => {
  const result = parseAwarenessModuleSource(VALID_MODULE);
  assert.equal(result.status, "ready");
  if (result.status !== "ready") throw new Error("unreachable");
  assert.equal(result.fields.slugName, "modern");
  assert.equal(result.fields.sections.length, 2);
  assert.equal(result.fields.sections[0].heading, "The numbers don't lie");
  assert.equal(result.fields.sections[0].body.length, 2);
  assert.equal(result.fields.sections[1].heading, "What actually changed");
});

test("parsePainPointSource: status other than ready is skipped, not an error", () => {
  const draft = VALID_PAIN_POINT.replace("status: ready", "status: draft");
  const result = parsePainPointSource(draft);
  assert.equal(result.status, "skipped");
});

test("parsePainPointSource: missing status is skipped", () => {
  const noStatus = VALID_PAIN_POINT.replace("status: ready\n", "");
  const result = parsePainPointSource(noStatus);
  assert.equal(result.status, "skipped");
});

test("parsePainPointSource: crisis missing throws ParentContentParseError", () => {
  const noCrisis = VALID_PAIN_POINT.replace("crisis: false\n", "");
  assert.throws(() => parsePainPointSource(noCrisis), ParentContentParseError);
});

test("parsePainPointSource: crisis as a non-boolean string throws", () => {
  const badCrisis = VALID_PAIN_POINT.replace("crisis: false", "crisis: maybe");
  assert.throws(() => parsePainPointSource(badCrisis), ParentContentParseError);
});

test("parsePainPointSource: unapproved icon throws with the valid options listed", () => {
  const badIcon = VALID_PAIN_POINT.replace("icon: Flame", "icon: Rocket");
  assert.throws(() => parsePainPointSource(badIcon), (err: unknown) => {
    assert.ok(err instanceof ParentContentParseError);
    assert.match((err as Error).message, /Flame/);
    return true;
  });
});

test("parsePainPointSource: placeholder marker anywhere in the file throws", () => {
  const withPlaceholder = VALID_PAIN_POINT.replace(
    "Look for help if meltdowns are happening multiple times per day.",
    "[GAP: need clinical source here]",
  );
  assert.throws(() => parsePainPointSource(withPlaceholder), ParentContentParseError);
});

test("parsePainPointSource: deepDiveHref not under /docs or /common-pain-points or /help throws", () => {
  const badHref = VALID_PAIN_POINT.replace(
    "deepDiveHref: /docs/de-escalation-crisis-planning",
    "deepDiveHref: /random/de-escalation-crisis-planning",
  );
  assert.throws(() => parsePainPointSource(badHref), ParentContentParseError);
});

test("parsePainPointSource: a related[].href pointing outside the site throws", () => {
  const badRelatedHref = VALID_PAIN_POINT.replace("href: /common-pain-points/aggression", "href: https://example.com/aggression");
  assert.throws(() => parsePainPointSource(badRelatedHref), ParentContentParseError);
});

test("parsePainPointSource: missing a required section throws", () => {
  const missingSupport = VALID_PAIN_POINT.replace(
    /## When To Get More Support\n[\s\S]*$/,
    "",
  );
  assert.throws(() => parsePainPointSource(missingSupport), ParentContentParseError);
});

test("parsePainPointSource: wrong declared type throws (guards against misclassified filename)", () => {
  const wrongType = VALID_PAIN_POINT.replace("type: pain-point", "type: awareness-module");
  assert.throws(() => parsePainPointSource(wrongType), ParentContentParseError);
});

test("parseAwarenessModuleSource: no Section: blocks throws", () => {
  const noSections = VALID_MODULE.replace(/## Section:[\s\S]*$/, "");
  assert.throws(() => parseAwarenessModuleSource(noSections), ParentContentParseError);
});

test("parseAwarenessModuleSource: requires crisis boolean", () => {
  const noCrisis = VALID_MODULE.replace("crisis: false\n", "");
  assert.throws(() => parseAwarenessModuleSource(noCrisis), ParentContentParseError);
});
