import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { getPayloadClient } from "@/lib/payload-client";
import {
  DualPathwayDiagram,
  DelayAversionSlider,
  EvidenceTierToggle,
  MythbusterCards,
  PathwayComparison,
  GlossaryTooltip,
  StrategyExplorer,
  TemperamentTimeline,
} from "@/components/mdx/adhd";

export const metadata: Metadata = {
  title: "Understanding ADHD | Bobby Washburn Parent Support",
  description:
    "A research-backed deep dive into ADHD — how it works, what the evidence says, and practical strategies for parents.",
  alternates: { canonical: "/docs/adhd" },
};

// Map marker names to the real ADHD interactive components.
// These replace [COMPONENT: ComponentName] blocks in the Payload body.
const ADHD_COMPONENTS: Record<string, React.ComponentType> = {
  DualPathwayDiagram: DualPathwayDiagram as React.ComponentType,
  DelayAversionSlider: DelayAversionSlider as React.ComponentType,
  EvidenceTierToggle: EvidenceTierToggle as React.ComponentType,
  MythbusterCards: MythbusterCards as React.ComponentType,
  PathwayComparison: PathwayComparison as React.ComponentType,
  GlossaryTooltip: GlossaryTooltip as React.ComponentType,
  StrategyExplorer: StrategyExplorer as React.ComponentType,
  TemperamentTimeline: TemperamentTimeline as React.ComponentType,
};

// Inject interactive components in place of [COMPONENT: X] marker paragraphs
// in a Lexical body. Returns the same data structure with injected nodes converted
// to a recognizable custom type that the custom RichText renderer can handle.
// Until the migration script runs and stores [COMPONENT: X] markers in Payload,
// this page falls back to rendering the body as-is (all text, no markers).
function injectAdhComponents(
  lexical: unknown
): { data: unknown; injections: { key: string; Component: React.ComponentType }[] } {
  const injections: { key: string; Component: React.ComponentType }[] = [];
  if (!lexical) return { data: lexical, injections };

  const root = (lexical as { root?: { children?: unknown[] } })?.root;
  if (!root?.children) return { data: lexical, injections };

  const MARKER_RE = /^\[COMPONENT:\s*(\w+)\]$/;

  const newChildren = (root.children as unknown[]).map((node, i) => {
    const n = node as { type?: string; children?: { text?: string }[] };
    if (n.type !== "paragraph") return node;
    const text = (n.children ?? []).map((c) => c.text ?? "").join("").trim();
    const match = MARKER_RE.exec(text);
    if (!match) return node;
    const componentName = match[1];
    const Component = ADHD_COMPONENTS[componentName];
    if (!Component) return node;
    const key = `adhd-inject-${i}`;
    injections.push({ key, Component });
    // Replace the paragraph with a custom marker node that carries the injection key.
    return { type: "adhd-component-marker", markerKey: key, injectionIndex: injections.length - 1 };
  });

  return {
    data: { ...lexical, root: { ...root, children: newChildren } },
    injections,
  };
}

export default async function AdhhdPage() {
  let rawBody: unknown = null;
  let docTitle = "Understanding ADHD";

  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "deep-dives",
      where: { and: [{ slug: { equals: "adhd" } }, { _status: { equals: "published" } }] },
      limit: 1,
      depth: 0,
    });
    if (docs.length > 0) {
      const doc = docs[0] as unknown as { title: string; body: unknown };
      docTitle = doc.title;
      rawBody = doc.body;
    }
  } catch {
    notFound();
  }

  const { data: processedBody, injections } = injectAdhComponents(rawBody);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8 lg:py-16">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/docs" className="hover:text-foreground transition-colors">
              Deep Dives
            </Link>
            <span className="mx-2">/</span>
            <span>{docTitle}</span>
          </nav>

          <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
            {docTitle}
          </h1>

          <article className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
            {processedBody ? (
              <RichText
                data={processedBody as Parameters<typeof RichText>[0]["data"]}
                converters={{
                  // Handle injected ADHD component marker nodes
                  "adhd-component-marker": ({ node }: { node: { markerKey?: string; injectionIndex?: number } }) => {
                    const injection = node.injectionIndex !== undefined
                      ? injections[node.injectionIndex]
                      : undefined;
                    if (!injection) return null;
                    const Component = injection.Component;
                    return <Component key={injection.key} />;
                  },
                }}
              />
            ) : (
              <p className="text-muted-foreground">
                ADHD deep dive content is being migrated. Check back soon.
              </p>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
