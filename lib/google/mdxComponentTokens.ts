/**
 * Registry of placeholder tokens a Doc author can type directly into the
 * Google Doc (as their own paragraph) to mark where a data-driven MDX
 * component should be re-inserted after Doc -> MDX conversion. The Doc's
 * HTML export has no way to represent live React components, so the Doc
 * carries a plain-text marker instead and the converter splices in the
 * real JSX. Add an entry here whenever a new topic/component needs one.
 */

export interface InlineTokenDefinition {
  /** Exact token text, matched as its own line/paragraph. */
  token: string;
  /** Builds the JSX block. `dataVar` is the topic JSON's import variable name. */
  render: (dataVar: string) => string;
}

export const INLINE_TOKENS: InlineTokenDefinition[] = [
  {
    token: "[[ConsensusMeter]]",
    render: (dataVar) =>
      `<ConsensusMeter\n  title={${dataVar}.consensusMeter.title}\n  description={${dataVar}.consensusMeter.description}\n  items={${dataVar}.consensusMeter.items}\n/>`,
  },
  {
    token: "[[ComparisonPanel]]",
    render: (dataVar) =>
      `<ComparisonPanel\n  title={${dataVar}.whereExpertsDisagree.title}\n  description={${dataVar}.whereExpertsDisagree.description}\n  rows={${dataVar}.whereExpertsDisagree.rows}\n/>`,
  },
];

// remark-stringify escapes literal "[" / "]" in text content (to avoid them
// being misread as link syntax), so tokens can survive conversion as
// "\[\[ConsensusMeter\]\]". Matching tolerates an optional backslash before
// each bracket so substitution works regardless of whether stringify escaped it.
const B = "\\\\?"; // optional literal backslash

function tokenPattern(inner: string): RegExp {
  return new RegExp(`${B}\\[${B}\\[${inner}${B}\\]${B}\\]`, "g");
}

const BLOCK_TOKEN_RE = new RegExp(
  `${B}\\[${B}\\[Callout(?:\\s+title="([^"]*)")?${B}\\]${B}\\]\\n+([\\s\\S]*?)\\n+${B}\\[${B}\\[/Callout${B}\\]${B}\\]`,
  "g",
);

const UNRESOLVED_TOKEN_RE = new RegExp(`${B}\\[${B}\\[[^\\]]+${B}\\]${B}\\]`);

/** Replaces `[[ConsensusMeter]]`-style single-line tokens with their JSX block. */
export function substituteInlineTokens(markdown: string, dataVar: string): string {
  let result = markdown;
  for (const { token, render } of INLINE_TOKENS) {
    const escapedName = token.slice(2, -2); // strip surrounding [[ ]]
    result = result.replace(tokenPattern(escapedName), render(dataVar));
  }
  return result;
}

/** Replaces `[[Callout title="..."]] ... [[/Callout]]` blocks with a <Callout> wrapping the inner content. */
export function substituteBlockTokens(markdown: string): string {
  return markdown.replace(BLOCK_TOKEN_RE, (_match, title: string | undefined, inner: string) => {
    const attr = title ? ` title="${title}"` : "";
    return `<Callout${attr}>\n${inner.trim()}\n</Callout>`;
  });
}

/** True if any unresolved `[[...]]` token marker remains — signals a malformed/unknown token. */
export function hasUnresolvedTokens(markdown: string): boolean {
  return UNRESOLVED_TOKEN_RE.test(markdown);
}
