import type { LucideIcon } from "lucide-react";

export type ContentBlock =
  | { kind: "p"; html: string }
  | { kind: "stat"; html: string }
  | { kind: "list"; items: string[] };

export type ListItem = { title: string; body: string };
export type LinkRef = { label: string; href: string };

type BaseEntry = {
  slug: string;
  icon: LucideIcon;
  tag: string;
  title: string;
  cardTeaser: string;
  headline: string;
  intro: string;
};

export type PainPointTopic = BaseEntry & {
  kind: "pain-point";
  featured?: boolean;
  exampleScenario?: string;
  whatHappening: ContentBlock[];
  backfires: ListItem[];
  tries: ListItem[];
  support: string;
  crisis?: boolean;
  deepDive?: LinkRef;
  related: LinkRef[];
};

export type AwarenessModule = BaseEntry & {
  kind: "module";
  sections: { heading: string; body: ContentBlock[] }[];
  crisis?: boolean;
  related: LinkRef[];
};

export type HelpEntry = PainPointTopic | AwarenessModule;
