import {
  readAllPainPoints,
  readAllAwarenessModules,
  readPainPoint,
  readAwarenessModule,
  type ContentBlockRaw,
  type PainPointYaml,
  type AwarenessModuleYaml,
} from "@/lib/content-reader";
import { resolvePainPointIcon } from "@/lib/pain-point-icons";
import type {
  AwarenessModule,
  ContentBlock,
  HelpEntry,
  PainPointTopic,
} from "@/lib/pain-points";

function transformContentBlocks(blocks: ContentBlockRaw[]): ContentBlock[] {
  return blocks.map((block) => {
    if (block.discriminant === "list") {
      return { kind: "list", items: [...block.value] };
    }
    return { kind: block.discriminant as "p" | "stat", html: block.value as string };
  });
}

function transformPainPoint(slug: string, entry: PainPointYaml): PainPointTopic {
  return {
    kind: "pain-point",
    slug,
    icon: resolvePainPointIcon(entry.icon),
    tag: entry.tag,
    title: entry.title,
    cardTeaser: entry.cardTeaser,
    headline: entry.headline,
    intro: entry.intro,
    featured: entry.featured ?? false,
    exampleScenario: entry.exampleScenario || undefined,
    whatHappening: transformContentBlocks(entry.whatHappening),
    backfires: entry.backfires.map((item) => ({ title: item.title, body: item.body })),
    tries: entry.tries.map((item) => ({ title: item.title, body: item.body })),
    support: entry.support,
    crisis: entry.crisis,
    deepDive: entry.deepDiveHref
      ? { label: entry.deepDiveLabel ?? "", href: entry.deepDiveHref }
      : undefined,
    related: entry.related.map((link) => ({ label: link.label, href: link.href })),
  };
}

function transformAwarenessModule(slug: string, entry: AwarenessModuleYaml): AwarenessModule {
  return {
    kind: "module",
    slug,
    icon: resolvePainPointIcon(entry.icon ?? ""),
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
  return readAllPainPoints().map(({ slug, data }) => transformPainPoint(slug, data));
}

export async function getAllAwarenessModules(): Promise<AwarenessModule[]> {
  return readAllAwarenessModules().map(({ slug, data }) =>
    transformAwarenessModule(slug, data)
  );
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
  const painPointData = readPainPoint(slug);
  if (painPointData) return transformPainPoint(slug, painPointData);

  const moduleData = readAwarenessModule(slug);
  if (moduleData) return transformAwarenessModule(slug, moduleData);

  return undefined;
}
