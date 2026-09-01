import type { ReactNode } from "react";

// Minimal `**bold**` inline markdown for panel body copy — the source
// content (claude-code-handoff-v8.md) uses this for the three-trap headers
// inside why-it-backfires' paragraphs. Nothing else in the panel content
// needs richer markdown, so this stays intentionally narrow.
export function renderBoldSegments(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}
