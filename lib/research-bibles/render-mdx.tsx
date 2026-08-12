import type { ReactNode } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";

/**
 * Renders a research bible's body field to React elements.
 *
 * This treats the stored content as GitHub-flavored Markdown, not full MDX
 * (no JSX component evaluation, no `import`/`export` handling) — the bible
 * body is expected to be prose only, and there's no MDX component registry
 * wired up for this collection the way `mdx-components.tsx` covers
 * `content/docs/*.mdx`. If a bible body ever needs live JSX components,
 * this needs to be swapped for a real MDX compiler (`@mdx-js/mdx`, already
 * present transitively via `fumadocs-mdx` — see note below).
 *
 * DEPENDENCY NOTE: `remark-parse`, `remark-rehype`, and
 * `hast-util-to-jsx-runtime` are used here as *transitive* dependencies
 * (pulled in by `fumadocs-mdx`/`rehype-remark`'s own dependency tree), not
 * declared directly in `package.json`. This works today but is fragile — a
 * future `fumadocs-mdx` upgrade that changes its internals could silently
 * remove them from `node_modules`. Flagged as a follow-up: declare these
 * three as direct dependencies once Bobby approves a `package.json` change
 * (no new packages actually get installed, this just pins what's already
 * resolved).
 */
export async function renderBibleBody(mdxSource: string): Promise<ReactNode> {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype);
  const hastTree = await processor.run(processor.parse(mdxSource));

  return toJsxRuntime(hastTree, {
    Fragment,
    jsx,
    jsxs,
  });
}
