/**
 * Purpose-built (NOT general-purpose) YAML-frontmatter serializer/parser for
 * exactly the `researchBibles` Keystatic collection schema
 * (`format: { contentField: "body" }` — everything except `body` goes into a
 * `---`-delimited YAML frontmatter block, `body` is the raw MDX that follows).
 *
 * This intentionally avoids adding a YAML dependency (`js-yaml`/`yaml` exist
 * only as *transitive* deps of other packages right now, not declared
 * project dependencies — CLAUDE.md's tech stack is locked, no new deps
 * without approval) by emitting every string scalar as a JSON string
 * literal. JSON string syntax is valid YAML 1.2 flow-scalar syntax, so this
 * round-trips through any spec-compliant YAML parser (including whatever
 * Keystatic itself uses to read the file back in `/keystatic`) — it just
 * won't look like hand-authored YAML (no unquoted strings, no literal block
 * scalars). That's a deliberate simplification, not an oversight.
 *
 * FLAG FOR BOBBY: verify this against a real entry created by hand through
 * `/keystatic` once that's reachable (needs the GitHub App env vars — see
 * Keystatic CMS section in CLAUDE.md) before trusting this in production.
 * The plan's spec asked for this because no I/O against a live Keystatic
 * instance was possible in this environment.
 */

export interface BibleChangelogEntry {
  date: string;
  summary: string;
  prUrl: string;
}

export interface BibleFrontmatter {
  title: string;
  version: string;
  lastUpdated: string;
  tags: string[];
  noindex: boolean;
  changelog: BibleChangelogEntry[];
}

function j(value: string): string {
  return JSON.stringify(value);
}

export function serializeBibleFile(frontmatter: BibleFrontmatter, body: string): string {
  const lines: string[] = ["---"];
  lines.push(`title: ${j(frontmatter.title)}`);
  lines.push(`version: ${j(frontmatter.version)}`);
  lines.push(`lastUpdated: ${j(frontmatter.lastUpdated)}`);

  if (frontmatter.tags.length === 0) {
    lines.push("tags: []");
  } else {
    lines.push("tags:");
    for (const tag of frontmatter.tags) lines.push(`  - ${j(tag)}`);
  }

  lines.push(`noindex: ${frontmatter.noindex ? "true" : "false"}`);

  if (frontmatter.changelog.length === 0) {
    lines.push("changelog: []");
  } else {
    lines.push("changelog:");
    for (const entry of frontmatter.changelog) {
      lines.push(`  - date: ${j(entry.date)}`);
      lines.push(`    summary: ${j(entry.summary)}`);
      lines.push(`    prUrl: ${j(entry.prUrl)}`);
    }
  }

  lines.push("---");
  lines.push("");

  return `${lines.join("\n")}${body}`;
}

/**
 * Splits a full `content/research-bibles/<slug>/index.mdx` file's raw text
 * into its frontmatter fields and body. Returns `null` if `raw` doesn't
 * start with a `---` frontmatter block at all (e.g. unexpected file shape —
 * caller should treat this as "no existing file to compare against").
 */
export function parseBibleFile(
  raw: string,
): { frontmatter: BibleFrontmatter; body: string } | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return null;

  const [, fm, body] = match;

  const titleMatch = /^title: (.*)$/m.exec(fm);
  const versionMatch = /^version: (.*)$/m.exec(fm);
  const lastUpdatedMatch = /^lastUpdated: (.*)$/m.exec(fm);
  const noindexMatch = /^noindex: (true|false)$/m.exec(fm);

  if (!titleMatch || !versionMatch) return null;

  let title: string;
  let version: string;
  let lastUpdated: string;
  try {
    title = JSON.parse(titleMatch[1]);
    version = JSON.parse(versionMatch[1]);
    lastUpdated = lastUpdatedMatch ? JSON.parse(lastUpdatedMatch[1]) : "";
  } catch {
    return null;
  }

  const noindex = noindexMatch ? noindexMatch[1] === "true" : false;

  const tags: string[] = [];
  const tagsBlockMatch = /^tags:\n((?:  - .*\n?)*)/m.exec(fm);
  if (tagsBlockMatch) {
    for (const line of tagsBlockMatch[1].split("\n")) {
      const itemMatch = /^ {2}- (.*)$/.exec(line);
      if (itemMatch) {
        try {
          tags.push(JSON.parse(itemMatch[1]));
        } catch {
          // skip malformed line rather than fail the whole parse
        }
      }
    }
  }

  const changelog: BibleChangelogEntry[] = [];
  const changelogBlockMatch = /^changelog:\n((?:.*\n?)*)/m.exec(fm);
  if (changelogBlockMatch) {
    const block = changelogBlockMatch[1];
    const entryRe = /^ {2}- date: (.*)\n {4}summary: (.*)\n {4}prUrl: (.*)$/gm;
    let entryMatch: RegExpExecArray | null;
    while ((entryMatch = entryRe.exec(block))) {
      try {
        changelog.push({
          date: JSON.parse(entryMatch[1]),
          summary: JSON.parse(entryMatch[2]),
          prUrl: JSON.parse(entryMatch[3]),
        });
      } catch {
        // skip malformed entry rather than fail the whole parse
      }
    }
  }

  return { frontmatter: { title, version, lastUpdated, tags, noindex, changelog }, body };
}
