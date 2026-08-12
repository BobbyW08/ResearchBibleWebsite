/**
 * Unit tests for lib/research-bibles/parse.ts, run with Node's built-in test
 * runner (`node --experimental-strip-types --test lib/research-bibles/parse.test.ts`)
 * since this repo has no test framework installed and none was added for this
 * (per plan instructions — no new test-framework deps unless nothing usable
 * exists; plain `node:test` + `node:assert` is usable on Node 22).
 *
 * All fixtures below are SYNTHETIC — constructed to match the documented
 * source-file shape from the handoff doc, not copied from a real `RB_*.md`
 * file (none exist in this checkout). See parse.ts's top-of-file comment.
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

const CONFORMING_FIXTURE = `Research Bible: ADHD in Children
=================================

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

const UNDERLINE_FIXTURE = `Research Bible: Anxiety and Depression in Children
====================================================

Module: Stabilize
Document Type: Research Bible

## Section 1: Overview

See the [DSM-5-TR criteria]{.underline} for full diagnostic detail, and consult the [linked appendix](https://example.com/appendix) for citations.

**Refinement Log — January 2026**

Date: 2026-01-10
Findings integrated: Incorporated new CDC prevalence data.
`;

const NO_LOG_FIXTURE = `Research Bible: Autism Spectrum Disorder in Children
======================================================

Module: Stabilize
Document Type: Research Bible

## Section 1: Overview

First-ever sync, no refinement round has happened yet.
`;

const BAD_TITLE_FIXTURE = `# Research Bible: ADHD in Children

Some content that uses ATX heading style instead of Setext, which is not accepted.
`;

test("extractTitle: conforming file", () => {
  assert.equal(extractTitle(CONFORMING_FIXTURE), "ADHD in Children");
});

test("extractTitle: throws BibleParseError on non-conforming title", () => {
  assert.throws(() => extractTitle(BAD_TITLE_FIXTURE), BibleParseError);
});

test("extractTitle: throws on empty input", () => {
  assert.throws(() => extractTitle(""), BibleParseError);
});

test("extractChangelogEntry: conforming file pulls date + verbatim summary", () => {
  const entry = extractChangelogEntry(CONFORMING_FIXTURE);
  assert.equal(entry.date, "2026-03-15");
  assert.equal(
    entry.summary,
    "Added a 2025 meta-analysis on stimulant medication efficacy in children under 6; updated the prevalence range in Section 2.",
  );
});

test("extractChangelogEntry: no Refinement Log block falls back to today + placeholder summary", () => {
  const entry = extractChangelogEntry(NO_LOG_FIXTURE);
  const today = new Date().toISOString().slice(0, 10);
  assert.equal(entry.date, today);
  assert.equal(entry.summary, "Initial sync — no refinement log entry found in source.");
});

test("stripPandocArtifacts: unwraps {.underline} spans, preserves unrelated link markup", () => {
  const stripped = stripPandocArtifacts(UNDERLINE_FIXTURE);
  assert.ok(!stripped.includes("{.underline}"));
  assert.ok(stripped.includes("See the DSM-5-TR criteria for full diagnostic detail"));
  assert.ok(stripped.includes("consult the [linked appendix](https://example.com/appendix) for citations"));
});

test("extractBody: strips title/header block and Refinement Log block", () => {
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

test("computeVersion: 0 existing entries -> 1.0", () => {
  assert.equal(computeVersion(0), "1.0");
});

test("computeVersion: 3 existing entries -> 1.3", () => {
  assert.equal(computeVersion(3), "1.3");
});
