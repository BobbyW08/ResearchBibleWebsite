import { parse } from "yaml";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const CONTENT = join(process.cwd(), "content");

function readYaml<T>(filePath: string): T {
  return parse(readFileSync(filePath, "utf-8")) as T;
}

function listDir(dir: string): string[] {
  try {
    return readdirSync(dir).filter((f) => f.endsWith(".yaml"));
  } catch {
    return [];
  }
}

// --- Shared raw block type (discriminant union from YAML) ---

export type ContentBlockRaw =
  | { discriminant: "p" | "stat"; value: string }
  | { discriminant: "list"; value: string[] };

// --- Testimonials ---

export type TestimonialData = {
  quote: string;
  attribution: string;
};

export function readTestimonials(): TestimonialData[] {
  const dir = join(CONTENT, "testimonials");
  return listDir(dir).map((f) => {
    const data = readYaml<TestimonialData & { internalLabel?: string }>(
      join(dir, f)
    );
    return { quote: data.quote, attribution: data.attribution };
  });
}

// --- FAQ ---

export type FaqItem = {
  question: string;
  answer: string;
};

export function readFaq(): { items: FaqItem[] } {
  return readYaml<{ items: FaqItem[] }>(join(CONTENT, "faq", "data.yaml"));
}

// --- Footer ---

export type FooterData = {
  tagline: string;
  contactEmail: string;
  copyrightText: string;
};

export function readFooter(): FooterData {
  return readYaml<FooterData>(join(CONTENT, "footer", "data.yaml"));
}

// --- About ---

export type AboutData = {
  heroSubhead: string;
  credentialBadge: string;
  photo?: string;
  shortAboutParagraphs: string[];
  cprsId: string;
  currentRole: string;
  training: string[];
  prior: string;
  also?: string;
};

export function readAbout(): AboutData | null {
  try {
    return readYaml<AboutData>(join(CONTENT, "about", "data.yaml"));
  } catch {
    return null;
  }
}

// --- Pain Points ---

export type PainPointYaml = {
  slugName: string;
  icon: string;
  featured?: boolean;
  tag: string;
  title: string;
  cardTeaser: string;
  headline: string;
  intro: string;
  exampleScenario?: string;
  whatHappening: ContentBlockRaw[];
  backfires: Array<{ title: string; body: string }>;
  tries: Array<{ title: string; body: string }>;
  support: string;
  crisis?: boolean;
  deepDiveLabel?: string;
  deepDiveHref?: string;
  related: Array<{ label: string; href: string }>;
};

export function readAllPainPoints(): Array<{ slug: string; data: PainPointYaml }> {
  const dir = join(CONTENT, "pain-points");
  return listDir(dir).map((f) => ({
    slug: f.replace(".yaml", ""),
    data: readYaml<PainPointYaml>(join(dir, f)),
  }));
}

export function readPainPoint(slug: string): PainPointYaml | null {
  try {
    return readYaml<PainPointYaml>(
      join(CONTENT, "pain-points", `${slug}.yaml`)
    );
  } catch {
    return null;
  }
}

// --- Awareness Modules ---

export type AwarenessModuleYaml = {
  slugName: string;
  icon?: string;
  tag: string;
  title: string;
  cardTeaser: string;
  headline: string;
  intro: string;
  sections: Array<{
    heading: string;
    body: ContentBlockRaw[];
  }>;
  crisis?: boolean;
  related: Array<{ label: string; href: string }>;
};

export function readAllAwarenessModules(): Array<{
  slug: string;
  data: AwarenessModuleYaml;
}> {
  const dir = join(CONTENT, "awareness-modules");
  return listDir(dir).map((f) => ({
    slug: f.replace(".yaml", ""),
    data: readYaml<AwarenessModuleYaml>(join(dir, f)),
  }));
}

export function readAwarenessModule(slug: string): AwarenessModuleYaml | null {
  try {
    return readYaml<AwarenessModuleYaml>(
      join(CONTENT, "awareness-modules", `${slug}.yaml`)
    );
  } catch {
    return null;
  }
}
