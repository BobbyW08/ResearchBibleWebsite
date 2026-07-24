import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export interface ConsensusMeterItem {
  treatment: string;
  evidenceLevel: string;
  effectSize?: string;
  note?: string;
}

export interface ConsensusMeterProps {
  title: string;
  description?: string;
  items: ConsensusMeterItem[];
}

// Ordinal ranking only, derived from each item's own evidenceLevel label —
// used to size the bars. The qualitative label is what's actually shown.
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

/**
 * Inline, lightweight evidence-strength meter for embedding directly in MDX
 * prose (no charting library — pure CSS bars with a hover tooltip for detail).
 * Template — pass any topic's consensus items via props.
 */
export function ConsensusMeter({ title, description, items }: ConsensusMeterProps) {
  const rows = [...items].sort(
    (a, b) => scoreFor(b.evidenceLevel) - scoreFor(a.evidenceLevel),
  );

  return (
    <Card className="w-full not-prose">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {rows.map((item) => {
          const score = scoreFor(item.evidenceLevel);
          return (
            <Tooltip key={item.treatment}>
              <TooltipTrigger
                render={
                  <div className="flex cursor-default items-center gap-3" />
                }
              >
                <span className="w-44 shrink-0 truncate text-sm text-foreground">
                  {item.treatment}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-secondary"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="w-40 shrink-0 truncate text-xs text-muted-foreground">
                  {item.evidenceLevel}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{item.treatment}</p>
                <p className="text-xs opacity-80">
                  {item.evidenceLevel}
                  {item.effectSize ? ` · effect size: ${item.effectSize}` : ""}
                </p>
                {item.note ? <p className="pt-1 text-xs opacity-80">{item.note}</p> : null}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </CardContent>
    </Card>
  );
}
