/**
 * Unit tests for lib/parent-content/frontmatter.ts, run with Node's built-in
 * test runner (matches lib/research-bibles/parse.test.ts's convention — no
 * test framework dependency added):
 *
 *   node --experimental-strip-types --test lib/parent-content/frontmatter.test.ts
 *
 * The parse-back fixtures below are abbreviated excerpts of the real,
 * pre-existing `content/pain-points/meltdowns.yaml` and
 * `content/awareness-modules/mentalhealth.yaml` files (verified against the
 * live repo), not guessed shapes — this is the reader's actual job: read
 * files Keystatic already produced/accepts, not just files this module
 * itself writes.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parsePainPointYaml,
  parseAwarenessModuleYaml,
  serializePainPointYaml,
  serializeAwarenessModuleYaml,
  parseYamlDocument,
  type PainPointYaml,
  type AwarenessModuleYaml,
} from "./frontmatter.ts";

// Abbreviated excerpt of the real content/pain-points/meltdowns.yaml.
const REAL_PAIN_POINT_FIXTURE = `slugName: meltdowns
icon: Flame
featured: true
tag: >-
  Meltdowns & tantrums
title: >-
  My kid melts down over everything
cardTeaser: >-
  Why tiny triggers cause huge reactions — and what to do in the moment.
headline: >-
  Why your kid loses it over small things (and what to do when it happens)
intro: >-
  The sock has a wrinkle. The juice is in the wrong cup.
exampleScenario: >-
  Maybe it's the wrong cup, a "no" to five more minutes, or something in a text thread — the trigger looks different at every age, but the pattern is the same.
whatHappening:
  - discriminant: p
    value: >-
      When a child melts down, their brain's threat-detection system has taken over.
  - discriminant: p
    value: >-
      Here's the critical piece: your child genuinely cannot hear your reasoning right now.
backfires:
  - title: >-
      Explaining, reasoning, or bargaining in the moment.
    body: >-
      Logic requires the thinking brain — and the thinking brain is currently offline.
tries:
  - title: >-
      Regulate yourself before you enter the room.
    body: >-
      Before you walk toward the meltdown, pause.
support: >-
  Look for help if meltdowns are happening multiple times per day.
crisis: false
deepDiveLabel: >-
  De-Escalation and Crisis Planning
deepDiveHref: /docs/de-escalation-crisis-planning
related:
  - label: >-
      My kid hits, bites, or throws things
    href: /common-pain-points/aggression
  - label: >-
      Morning chaos — routines
    href: /common-pain-points/routines
`;

// Abbreviated excerpt of the real content/awareness-modules/mentalhealth.yaml,
// including its "stat" and "list" content-block variants (the only two real
// files that use anything other than "p").
const REAL_MODULE_FIXTURE = `slugName: mentalhealth
icon: TrendingUp
tag: >-
  Context
title: >-
  Children's mental health in the U.S.
cardTeaser: >-
  What the data says — and what it means for your family right now.
headline: >-
  The state of children's mental health in the United States
intro: >-
  Something shifted in children's mental health around 2012.
sections:
  - heading: >-
      What the data shows
    body:
      - discriminant: stat
        value: >-
          Between 2007 and 2021, rates of depression among adolescents roughly doubled.
      - discriminant: p
        value: >-
          That inflection point around 2012 coincides with when smartphones became ubiquitous.
  - heading: >-
      Signs that warrant professional attention
    body:
      - discriminant: p
        value: >-
          Seek professional support if your child:
      - discriminant: list
        value:
          - >-
            Has persistent anxiety or low mood lasting more than two weeks
          - >-
            Is missing school regularly due to emotional distress
crisis: true
related:
  - label: >-
      My kid is anxious or worried — and won't go to school
    href: /common-pain-points/anxiety
`;

test("parsePainPointYaml: reads the real meltdowns.yaml shape correctly", () => {
  const result = parsePainPointYaml(REAL_PAIN_POINT_FIXTURE);
  assert.ok(result);
  assert.equal(result!.slugName, "meltdowns");
  assert.equal(result!.icon, "Flame");
  assert.equal(result!.featured, true);
  assert.equal(result!.tag, "Meltdowns & tantrums");
  assert.equal(
    result!.exampleScenario,
    'Maybe it\'s the wrong cup, a "no" to five more minutes, or something in a text thread — the trigger looks different at every age, but the pattern is the same.',
  );
  assert.equal(result!.crisis, false);
  assert.equal(result!.deepDiveHref, "/docs/de-escalation-crisis-planning");
  assert.equal(result!.whatHappening.length, 2);
  assert.deepEqual(result!.whatHappening[0].discriminant, "p");
  assert.equal(result!.backfires.length, 1);
  assert.equal(result!.backfires[0].title, "Explaining, reasoning, or bargaining in the moment.");
  assert.equal(result!.tries.length, 1);
  assert.equal(result!.related.length, 2);
  assert.equal(result!.related[0].href, "/common-pain-points/aggression");
});

test("parseAwarenessModuleYaml: reads the real mentalhealth.yaml shape, including stat and list blocks", () => {
  const result = parseAwarenessModuleYaml(REAL_MODULE_FIXTURE);
  assert.ok(result);
  assert.equal(result!.slugName, "mentalhealth");
  assert.equal(result!.crisis, true);
  assert.equal(result!.sections.length, 2);
  assert.equal(result!.sections[0].body[0].discriminant, "stat");
  const listBlock = result!.sections[1].body[1];
  assert.equal(listBlock.discriminant, "list");
  assert.ok(Array.isArray((listBlock as { value: string[] }).value));
  assert.equal((listBlock as { value: string[] }).value.length, 2);
  assert.equal((listBlock as { value: string[] }).value[0], "Has persistent anxiety or low mood lasting more than two weeks");
});

test("parsePainPointYaml: returns null (not throw) on unparseable input", () => {
  assert.equal(parsePainPointYaml("not: valid: yaml: at: all: :::"), null);
});

test("serializePainPointYaml -> parsePainPointYaml round-trips cleanly", () => {
  const data: PainPointYaml = {
    slugName: "test-topic",
    icon: "Moon",
    featured: false,
    tag: "Test tag",
    title: "Test title",
    cardTeaser: "Test card teaser.",
    headline: "Test headline",
    intro: "Test intro paragraph.",
    exampleScenario: "Test example scenario, applicable across ages.",
    whatHappening: [
      { discriminant: "p", value: "First mechanism paragraph." },
      { discriminant: "p", value: "Second mechanism paragraph." },
    ],
    backfires: [{ title: "Backfire title", body: "Backfire body." }],
    tries: [
      { title: "Try one", body: "Try one body." },
      { title: "Try two", body: "Try two body." },
    ],
    support: "Support text.",
    crisis: false,
    deepDiveLabel: "Deep Dive Label",
    deepDiveHref: "/docs/some-topic",
    related: [{ label: "Related label", href: "/common-pain-points/other" }],
  };

  const serialized = serializePainPointYaml(data);
  const parsed = parsePainPointYaml(serialized);
  assert.deepEqual(parsed, data);
});

test("serializeAwarenessModuleYaml -> parseAwarenessModuleYaml round-trips cleanly, including a list block", () => {
  const data: AwarenessModuleYaml = {
    slugName: "test-module",
    icon: "Globe",
    tag: "Test tag",
    title: "Test title",
    cardTeaser: "Test card teaser.",
    headline: "Test headline",
    intro: "Test intro.",
    sections: [
      {
        heading: "First section",
        body: [
          { discriminant: "p", value: "Paragraph one." },
          { discriminant: "stat", value: "A statistic." },
          { discriminant: "list", value: ["Item one", "Item two", "Item three"] },
        ],
      },
    ],
    crisis: true,
    related: [{ label: "Related label", href: "/help" }],
  };

  const serialized = serializeAwarenessModuleYaml(data);
  const parsed = parseAwarenessModuleYaml(serialized);
  assert.deepEqual(parsed, data);
});

test("parseYamlDocument: handles an empty [] sequence", () => {
  const doc = parseYamlDocument("related: []\ncrisis: true\n");
  assert.deepEqual(doc.related, []);
  assert.equal(doc.crisis, true);
});
