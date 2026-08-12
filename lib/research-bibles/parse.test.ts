/**
 * Unit tests for lib/research-bibles/parse.ts, run with Node's built-in test
 * runner (`node --experimental-strip-types --test lib/research-bibles/parse.test.ts`)
 * since this repo has no test framework installed and none was added for this
 * (per plan instructions — no new test-framework deps unless nothing usable
 * exists; plain `node:test` + `node:assert` is usable on Node 22).
 *
 * Fixture shape (title line, absence of an in-body Refinement Log block)
 * is now based on real `RB_*.md` files verified in the Research Bibles
 * Drive folder on 2026-08-12 (RB_Structures_and_Routines.md,
 * RB_Communication.md, RB_Big_Transitions_Big_Feelings.md,
 * RB_Understanding_Modern_Parenting.md), not guessed. Content bodies below
 * are still synthetic/abbreviated for test brevity.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  extractTitle,
  extractChangelogEntry,
  stripPandocArtifacts,
  extractBody,
  computeVersion,
  BibleParseError,
} from "./parse.ts";

const CONFORMING_FIXTURE = `# Research Bible: ADHD in Children

Module: Stabilize
Document Type: Research Bible

## Section 1: Overview

Some overview text about ADHD.

**Refinement Log — March 2026**

Date: 2026-03-15
Findings integrated: Added a 2025 meta-analysis on stimulant medication efficacy in children under 6; updated the prevalence range in Section 2.

## Section 2: Mechanisms

Body content continues here.
`;

const UNDERLINE_FIXTURE = `# Research Bible: Anxiety and Depression in Children

Module: Stabilize
Document Type: Research Bible

## Section 1: Overview

See the [DSM-5-TR criteria]{.underline} for full diagnostic detail, and consult the [linked appendix](https://example.com/appendix) for citations.
`;

// Matches the real post-refinement-skill shape: no in-body Refinement Log
// block at all — refinement history lives in the filename suffix and
// _WeeklyRefinementLog.md instead (research-bible-refinement skill, Step 7).
const NO_LOG_FIXTURE = `# Research Bible: Autism Spectrum Disorder in Children

Module: Stabilize
Document Type: Research Bible

## Section 1: Overview

First-ever sync, no refinement round has happened yet.
`;

const SETEXT_FIXTURE = `Research Bible: ADHD in Children
=================================

Some content using the old Setext heading style, which is no longer accepted.
`;

test("extractTitle: conforming ATX file", () => {
  assert.equal(extractTitle(CONFORMING_FIXTURE), "ADHD in Children");
});

test("extractTitle: throws BibleParseError on Setext-style title (old format, no longer accepted)", () => {
  assert.throws(() => extractTitle(SETEXT_FIXTURE), BibleParseError);
});

test("extractTitle: throws on empty input", () => {
  assert.throws(() => extractTitle(""), BibleParseError);
});

test("extractTitle: real-shape title with em dash and parentheses", () => {
  const fixture = "# Research Bible: How Structures and Routines Work (and When They Don't)\n\nBody.\n";
  assert.equal(
    extractTitle(fixture),
    "How Structures and Routines Work (and When They Don't)",
  );
});

test("extractChangelogEntry: conforming in-body Refinement Log block pulls date + verbatim summary", () => {
  const entry = extractChangelogEntry(CONFORMING_FIXTURE);
  assert.equal(entry.date, "2026-03-15");
  assert.equal(
    entry.summary,
    "Added a 2025 meta-analysis on stimulant medication efficacy in children under 6; updated the prevalence range in Section 2.",
  );
});

test("extractChangelogEntry: no block, filename has a refinement-date suffix -> uses that date", () => {
  const entry = extractChangelogEntry(NO_LOG_FIXTURE, "RB_ADHD_110826.md");
  assert.equal(entry.date, "2026-08-11");
  assert.match(entry.summary, /_WeeklyRefinementLog\.md/);
});

test("extractChangelogEntry: no block, no filename suffix -> falls back to today + initial-sync summary", () => {
  const entry = extractChangelogEntry(NO_LOG_FIXTURE, "RB_ADHD.md");
  const today = new Date().toISOString().slice(0, 10);
  assert.equal(entry.date, today);
  assert.equal(entry.summary, "Initial sync — no prior refinement round recorded in the filename.");
});

test("extractChangelogEntry: no block, fileName omitted entirely -> same fallback as no suffix", () => {
  const entry = extractChangelogEntry(NO_LOG_FIXTURE);
  const today = new Date().toISOString().slice(0, 10);
  assert.equal(entry.date, today);
  assert.equal(entry.summary, "Initial sync — no prior refinement round recorded in the filename.");
});

test("extractChangelogEntry: malformed filename date suffix falls back rather than producing a bad date", () => {
  const entry = extractChangelogEntry(NO_LOG_FIXTURE, "RB_ADHD_999999.md");
  const today = new Date().toISOString().slice(0, 10);
  assert.equal(entry.date, today);
});

test("stripPandocArtifacts: unwraps {.underline} spans, preserves unrelated link markup", () => {
  const stripped = stripPandocArtifacts(UNDERLINE_FIXTURE);
  assert.ok(!stripped.includes("{.underline}"));
  assert.ok(stripped.includes("See the DSM-5-TR criteria for full diagnostic detail"));
  assert.ok(stripped.includes("consult the [linked appendix](https://example.com/appendix) for citations"));
});

test("extractBody: strips ATX title line, header metadata, and Refinement Log block", () => {
  const body = extractBody(CONFORMING_FIXTURE);
  assert.ok(!body.includes("Research Bible:"));
  assert.ok(!body.includes("Module:"));
  assert.ok(!body.includes("Refinement Log"));
  assert.ok(!body.includes("Findings integrated:"));
  assert.ok(body.includes("## Section 1: Overview"));
  assert.ok(body.includes("## Section 2: Mechanisms"));
  assert.ok(body.includes("Body content continues here."));
});

test("extractBody: file with no Refinement Log block still strips header, keeps body", () => {
  const body = extractBody(NO_LOG_FIXTURE);
  assert.ok(!body.includes("Research Bible:"));
  assert.ok(!body.includes("Module:"));
  assert.ok(body.includes("## Section 1: Overview"));
  assert.ok(body.includes("First-ever sync"));
});

test("extractBody: real-shape file with a horizontal-rule divider right after the title keeps it in the body", () => {
  const fixture =
    "# Research Bible: Communication\n\n-----\n\n## 1. Module Snapshot\n\nContent.\n";
  const body = extractBody(fixture);
  assert.ok(body.startsWith("-----"));
  assert.ok(body.includes("## 1. Module Snapshot"));
});

test("computeVersion: 0 existing entries -> 1.0", () => {
  assert.equal(computeVersion(0), "1.0");
});

test("computeVersion: 3 existing entries -> 1.3", () => {
  assert.equal(computeVersion(3), "1.3");
});
