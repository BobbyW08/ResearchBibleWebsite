import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "content", "data");

export interface DashboardTopic {
  id: string;
  slug: string;
  title: string;
  fullTitle: string;
  subtitle: string;
}

export interface DashboardStat {
  id: string;
  value: string;
  label: string;
  detail?: string;
  citationId?: string;
}

export interface ConsensusItem {
  treatment: string;
  evidenceLevel: string;
  effectSize: string;
  note?: string;
  citationId?: string;
}

export interface DisagreementRow {
  topic: string;
  strongClaim: string;
  softerClaim: string;
  citationId?: string;
  flaggedForReview?: boolean;
}

export interface DashboardData {
  topic: DashboardTopic;
  heroStat: DashboardStat;
  quickStats: DashboardStat[];
  consensusMeter: {
    title: string;
    description: string;
    items: ConsensusItem[];
  };
  whereExpertsDisagree: {
    title: string;
    description: string;
    rows: DisagreementRow[];
  };
}

export async function getDashboardSlugs(): Promise<string[]> {
  const files = await fs.readdir(DATA_DIR);
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""));
}

export async function getDashboardData(
  slug: string,
): Promise<DashboardData | null> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${slug}.json`), "utf-8");
    return JSON.parse(raw) as DashboardData;
  } catch {
    return null;
  }
}
