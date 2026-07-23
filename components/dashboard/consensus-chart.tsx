"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ConsensusItem } from "@/lib/dashboard-data";

// Ordinal ranking only, derived directly from each item's own evidenceLevel —
// used purely to order/size the bars. The qualitative label (not this score)
// is what's shown to the reader.
const EVIDENCE_SCORE: Record<string, number> = {
  "Gold standard": 100,
  Robust: 95,
  "Well-established (Level 1)": 90,
  "Well-established for school setting": 80,
  "RCT-supported": 75,
  Emerging: 40,
  "Level 3 — possibly efficacious": 30,
  Limited: 20,
};

function scoreFor(evidenceLevel: string): number {
  return EVIDENCE_SCORE[evidenceLevel] ?? 50;
}

const chartConfig = {
  score: {
    label: "Relative evidence strength",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

function ConsensusTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ConsensusItem & { score: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md max-w-xs">
      <p className="font-medium text-popover-foreground">{item.treatment}</p>
      <p className="text-xs text-muted-foreground">
        {item.evidenceLevel} · effect size: {item.effectSize}
      </p>
      {item.note ? (
        <p className="pt-1 text-xs text-muted-foreground">{item.note}</p>
      ) : null}
    </div>
  );
}

export function ConsensusChart({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: ConsensusItem[];
}) {
  const data = items
    .map((item) => ({ ...item, score: scoreFor(item.evidenceLevel) }))
    .sort((a, b) => b.score - a.score);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full"
          style={{ height: `${data.length * 44 + 40}px` }}
        >
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 24 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="treatment"
              tickLine={false}
              axisLine={false}
              width={220}
              fontSize={12}
            />
            <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ConsensusTooltip />} />
            <Bar dataKey="score" fill="var(--color-score)" radius={4} barSize={20} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
