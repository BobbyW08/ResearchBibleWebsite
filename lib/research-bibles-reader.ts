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
  body: string;
};

// Research bibles are stored in Payload CMS (migration in progress).
// These reader functions return empty data until the Payload migration completes.

export async function getAllResearchBibles(): Promise<ResearchBibleEntry[]> {
  return [];
}

export async function getResearchBible(
  _slug: string
): Promise<ResearchBibleEntry | undefined> {
  return undefined;
}
