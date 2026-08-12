import { reader } from "@/lib/keystatic-reader";

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
  /**
   * Raw MDX source for the body. Keystatic's reader type for the
   * `contentField` of a `format: { contentField: "body" }` collection comes
   * back as `string | (() => Promise<string>)` — resolve with
   * `resolveBibleBody()` below rather than assuming either shape directly.
   */
  body: string | (() => Promise<string>);
};

/** Resolves a `ResearchBibleEntry.body` to its raw MDX string, regardless of which shape Keystatic's reader gave back. */
export async function resolveBibleBody(body: ResearchBibleEntry["body"]): Promise<string> {
  return typeof body === "function" ? body() : body;
}

type ResearchBibleReaderEntry = Awaited<
  ReturnType<typeof reader.collections.researchBibles.read>
>;

function transformResearchBible(
  slug: string,
  entry: NonNullable<ResearchBibleReaderEntry>,
): ResearchBibleEntry {
  return {
    slug,
    title: entry.title,
    version: entry.version,
    lastUpdated: entry.lastUpdated,
    tags: [...entry.tags],
    noindex: entry.noindex,
    changelog: entry.changelog.map((item) => ({
      date: item.date,
      summary: item.summary,
      prUrl: item.prUrl,
    })),
    body: entry.body,
  };
}

export async function getAllResearchBibles(): Promise<ResearchBibleEntry[]> {
  const entries = await reader.collections.researchBibles.all();
  return entries.map(({ slug, entry }) => transformResearchBible(slug, entry));
}

export async function getResearchBible(slug: string): Promise<ResearchBibleEntry | undefined> {
  const entry = await reader.collections.researchBibles.read(slug);
  if (!entry) return undefined;
  return transformResearchBible(slug, entry);
}
