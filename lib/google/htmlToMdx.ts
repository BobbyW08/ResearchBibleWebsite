import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";

import {
  hasUnresolvedTokens,
  substituteBlockTokens,
  substituteInlineTokens,
} from "@/lib/google/mdxComponentTokens";

const MIN_BODY_LENGTH = 50;

function stripDriveStyleBlock(html: string): string {
  return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
}

function extractImportVariableName(frontmatterAndImport: string): string {
  const match = frontmatterAndImport.match(/^import\s+(\w+)\s+from/m);
  if (!match) {
    throw new Error("Could not find a topic-data import line (e.g. `import adhdData from ...`) in the existing file");
  }
  return match[1];
}

/**
 * Converts a Google Doc's HTML export into an MDX body, re-inserting any
 * `[[Token]]`/`[[Callout]]...[[/Callout]]` placeholder markers the Doc author
 * left as real JSX, then prepends the existing file's untouched frontmatter
 * + data import block. Throws (never returns malformed/empty output) if the
 * conversion looks broken — callers must not write the result on throw.
 */
export async function convertDocHtmlToMdx(
  html: string,
  existingFrontmatterAndImport: string,
): Promise<string> {
  const dataVar = extractImportVariableName(existingFrontmatterAndImport);
  const cleanedHtml = stripDriveStyleBlock(html);

  const file = await unified()
    .use(rehypeParse, { fragment: false })
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify)
    .process(cleanedHtml);

  let body = String(file).trim();
  body = substituteBlockTokens(body);
  body = substituteInlineTokens(body, dataVar);

  if (body.length < MIN_BODY_LENGTH) {
    throw new Error(`Converted MDX body is too short (${body.length} chars) — likely a malformed conversion`);
  }
  if (!/^##\s/m.test(body)) {
    throw new Error("Converted MDX body has no `##` heading — likely a malformed conversion");
  }
  if (hasUnresolvedTokens(body)) {
    throw new Error("Converted MDX body still contains an unresolved [[token]] marker — unknown or malformed token");
  }

  return `${existingFrontmatterAndImport.trimEnd()}\n\n${body}\n`;
}
