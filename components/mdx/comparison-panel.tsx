import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ComparisonRow {
  topic: string;
  strongClaim: string;
  softerClaim: string;
  flaggedForReview?: boolean;
}

export interface ComparisonPanelProps {
  title: string;
  description?: string;
  rows: ComparisonRow[];
  strongLabel?: string;
  softerLabel?: string;
}

/**
 * Reusable two-column claim comparison, embeddable directly in MDX prose.
 * Template — pass any topic's disagreement/nuance rows via props.
 */
export function ComparisonPanel({
  title,
  description,
  rows,
  strongLabel = "What the evidence supports strongly",
  softerLabel = "What to hold more loosely",
}: ComparisonPanelProps) {
  return (
    <Card className="w-full not-prose">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {rows.map((row) => (
          <div
            key={row.topic}
            className="rounded-md border border-border p-4"
          >
            <div className="flex items-center gap-2 pb-3">
              <span className="text-sm font-medium text-foreground">{row.topic}</span>
              {row.flaggedForReview ? (
                <Badge variant="outline" className="border-secondary text-secondary">
                  Flagged for review
                </Badge>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="pb-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {strongLabel}
                </p>
                <p className="text-sm text-foreground">{row.strongClaim}</p>
              </div>
              <div>
                <p className="pb-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {softerLabel}
                </p>
                <p className="text-sm text-foreground">{row.softerClaim}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
