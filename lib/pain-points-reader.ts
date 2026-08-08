import { reader } from "@/lib/keystatic-reader";
import { resolvePainPointIcon } from "@/lib/pain-point-icons";
import type {
  AgeBand,
  AwarenessModule,
  ContentBlock,
  HelpEntry,
  PainPointTopic,
} from "@/lib/pain-points";

type RawContentBlock = {
  discriminant: "p" | "stat" | "list";
  value: string | readonly string[];
};

type PainPointEntry = Awaited<ReturnType<typeof reader.collections.painPoints.read>>;
type AwarenessModuleEntry = Awaited<ReturnType<typeof reader.collections.awarenessModules.read>>;

function transformContentBlocks(blocks: readonly RawContentBlock[]): ContentBlock[] {
  return blocks.map((block) => {
    if (block.discriminant === "list") {
      return { kind: "list", items: [...(block.value as readonly string[])] };
    }
    return { kind: block.discriminant, html: block.value as string };
  });
}

function transformPainPoint(slug: string, entry: NonNullable<PainPointEntry>): PainPointTopic {
  return {
    kind: "pain-point",
    slug,
    icon: resolvePainPointIcon(entry.icon),
    tag: entry.tag,
    title: entry.title,
    cardTeaser: entry.cardTeaser,
    headline: entry.headline,
    intro: entry.intro,
    featured: entry.featured,
    defaultAge: entry.defaultAge as AgeBand,
    ageScenarios: {
      "2-5": entry.ageScenario25 || undefined,
      "6-9": entry.ageScenario69 || undefined,
      "10-12": entry.ageScenario1012 || undefined,
      "13+": entry.ageScenario13plus || undefined,
    },
    whatHappening: transformContentBlocks(entry.whatHappening),
    backfires: entry.backfires.map((item) => ({ title: item.title, body: item.body })),
    tries: entry.tries.map((item) => ({ title: item.title, body: item.body })),
    support: entry.support,
    crisis: entry.crisis,
    deepDive: { label: entry.deepDiveLabel, href: entry.deepDiveHref },
    related: entry.related.map((link) => ({ label: link.label, href: link.href })),
  };
}

function transformAwarenessModule(
  slug: string,
  entry: NonNullable<AwarenessModuleEntry>,
): AwarenessModule {
  return {
    kind: "module",
    slug,
    icon: resolvePainPointIcon(entry.icon),
    tag: entry.tag,
    title: entry.title,
    cardTeaser: entry.cardTeaser,
    headline: entry.headline,
    intro: entry.intro,
    sections: entry.sections.map((section) => ({
      heading: section.heading,
      body: transformContentBlocks(section.body),
    })),
    crisis: entry.crisis,
    related: entry.related.map((link) => ({ label: link.label, href: link.href })),
  };
}

export async function getAllPainPoints(): Promise<PainPointTopic[]> {
  const entries = await reader.collections.painPoints.all();
  return entries.map(({ slug, entry }) => transformPainPoint(slug, entry));
}

export async function getAllAwarenessModules(): Promise<AwarenessModule[]> {
  const entries = await reader.collections.awarenessModules.all();
  return entries.map(({ slug, entry }) => transformAwarenessModule(slug, entry));
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
  const painPointEntry = await reader.collections.painPoints.read(slug);
  if (painPointEntry) {
    return transformPainPoint(slug, painPointEntry);
  }
  const moduleEntry = await reader.collections.awarenessModules.read(slug);
  if (moduleEntry) {
    return transformAwarenessModule(slug, moduleEntry);
  }
  return undefined;
}
