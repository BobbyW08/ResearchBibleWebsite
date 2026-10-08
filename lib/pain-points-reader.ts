import { getPayloadClient } from "@/lib/payload-client";
import { resolvePainPointIcon } from "@/lib/pain-point-icons";
import type {
  AwarenessModule,
  ContentBlock,
  HelpEntry,
  PainPointTopic,
} from "@/lib/pain-points";

// Convert Payload Lexical richText JSON to the ContentBlock[] shape expected
// by the existing rendering components. Handles paragraphs and bullet lists;
// everything else is emitted as a plain paragraph.
function lexicalToContentBlocks(lexical: unknown): ContentBlock[] {
  const root = (lexical as { root?: { children?: unknown[] } })?.root;
  if (!root?.children) return [];

  const blocks: ContentBlock[] = [];
  for (const node of root.children as { type?: string; children?: unknown[] }[]) {
    if (node.type === "list") {
      const items = (node.children ?? []).map((li) => {
        const listItem = li as { children?: { text?: string }[] };
        return (listItem.children ?? []).map((t) => t.text ?? "").join("");
      });
      const nonEmpty = items.filter((s) => s.length > 0);
      if (nonEmpty.length > 0) blocks.push({ kind: "list", items: nonEmpty });
    } else {
      const children = (node.children ?? []) as { text?: string }[];
      const html = children.map((c) => c.text ?? "").join("");
      if (html.length > 0) blocks.push({ kind: "p", html });
    }
  }
  return blocks;
}

function resolveIconSafe(name: unknown): ReturnType<typeof resolvePainPointIcon> {
  return resolvePainPointIcon(typeof name === "string" ? name : "");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPainPoint(doc: any): PainPointTopic {
  return {
    kind: "pain-point",
    slug: doc.slug ?? "",
    icon: resolveIconSafe(doc.icon),
    tag: doc.tag ?? "",
    title: doc.title ?? "",
    cardTeaser: doc.cardTeaser ?? "",
    headline: doc.headline ?? "",
    intro: doc.intro ?? "",
    featured: doc.featured ?? false,
    exampleScenario: doc.exampleScenario || undefined,
    whatHappening: lexicalToContentBlocks(doc.whatHappening),
    backfires: (doc.backfires ?? []).map((b: { title: string; body: string }) => ({
      title: b.title ?? "",
      body: b.body ?? "",
    })),
    tries: (doc.tries ?? []).map((t: { title: string; details?: string; body?: string }) => ({
      title: t.title ?? "",
      body: t.details ?? t.body ?? "",
    })),
    support: doc.support ?? "",
    crisis: doc.crisis ?? false,
    deepDive:
      doc.deepDive?.href
        ? { label: doc.deepDive.label ?? "", href: doc.deepDive.href }
        : undefined,
    related: (doc.related ?? []).map((r: { label: string; href: string }) => ({
      label: r.label ?? "",
      href: r.href ?? "",
    })),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAwarenessModule(doc: any): AwarenessModule {
  return {
    kind: "module",
    slug: doc.slug ?? "",
    icon: resolveIconSafe(doc.icon),
    tag: doc.tag ?? "",
    title: doc.title ?? "",
    cardTeaser: doc.cardTeaser ?? "",
    headline: doc.headline ?? "",
    intro: doc.intro ?? "",
    sections: (doc.sections ?? []).map((s: { heading: string; body: unknown }) => ({
      heading: s.heading ?? "",
      body: lexicalToContentBlocks(s.body),
    })),
    crisis: doc.crisis ?? false,
    related: (doc.related ?? []).map((r: { label: string; href: string }) => ({
      label: r.label ?? "",
      href: r.href ?? "",
    })),
  };
}

export async function getAllPainPoints(): Promise<PainPointTopic[]> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "pain-points",
      where: { _status: { equals: "published" } },
      limit: 100,
      depth: 0,
    });
    return docs.map(mapPainPoint);
  } catch {
    return [];
  }
}

export async function getAllAwarenessModules(): Promise<AwarenessModule[]> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "awareness-modules",
      where: { _status: { equals: "published" } },
      limit: 50,
      depth: 0,
    });
    return docs.map(mapAwarenessModule);
  } catch {
    return [];
  }
}

export async function getAllHelpEntries(): Promise<HelpEntry[]> {
  const [painPoints, awarenessModules] = await Promise.all([
    getAllPainPoints(),
    getAllAwarenessModules(),
  ]);
  return [...painPoints, ...awarenessModules];
}

export async function getFeaturedPainPoints(): Promise<PainPointTopic[]> {
  const painPoints = await getAllPainPoints();
  return painPoints.filter((topic) => topic.featured);
}

export async function getHelpEntry(slug: string): Promise<HelpEntry | undefined> {
  try {
    const payload = await getPayloadClient();

    const { docs: ppDocs } = await payload.find({
      collection: "pain-points",
      where: {
        and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
      },
      limit: 1,
      depth: 0,
    });
    if (ppDocs.length > 0) return mapPainPoint(ppDocs[0]);

    const { docs: modDocs } = await payload.find({
      collection: "awareness-modules",
      where: {
        and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
      },
      limit: 1,
      depth: 0,
    });
    if (modDocs.length > 0) return mapAwarenessModule(modDocs[0]);

    return undefined;
  } catch {
    return undefined;
  }
}
