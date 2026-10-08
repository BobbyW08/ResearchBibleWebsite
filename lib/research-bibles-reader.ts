import { getPayloadClient } from "@/lib/payload-client";

export type ResearchBibleChangelogEntry = {
  date: string | null;
  summary: string;
  prUrl: string | null;
};

export type ResearchBibleEntry = {
  slug: string;
  title: string;
  version: string;
  lastUpdated: string | null;
  tags: string[];
  noindex: boolean;
  changelog: ResearchBibleChangelogEntry[];
  // Lexical rich text object — rendered via @payloadcms/richtext-lexical/react
  body: unknown;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBible(doc: any): ResearchBibleEntry {
  return {
    slug: doc.slug ?? "",
    title: doc.title ?? "",
    version: doc.version ?? "1.0",
    lastUpdated: doc.lastUpdated ?? null,
    tags: (doc.tags ?? []).map((t: { tag: string }) => t.tag ?? ""),
    noindex: doc.noindex ?? false,
    changelog: (doc.changelog ?? []).map(
      (entry: { date?: string; summary?: string; prUrl?: string }) => ({
        date: entry.date ?? null,
        summary: entry.summary ?? "",
        prUrl: entry.prUrl ?? null,
      })
    ),
    body: doc.body ?? null,
  };
}

export async function getAllResearchBibles(): Promise<ResearchBibleEntry[]> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "research-bibles",
      where: { _status: { equals: "published" } },
      limit: 200,
      depth: 0,
    });
    return docs.map(mapBible);
  } catch {
    return [];
  }
}

export async function getResearchBible(
  slug: string
): Promise<ResearchBibleEntry | undefined> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "research-bibles",
      where: {
        and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
      },
      limit: 1,
      depth: 0,
    });
    if (docs.length === 0) return undefined;
    return mapBible(docs[0]);
  } catch {
    return undefined;
  }
}
