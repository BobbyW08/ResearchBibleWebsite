import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/lib/dashboard-data";

export function StatCard({
  stat,
  hero = false,
}: {
  stat: DashboardStat;
  hero?: boolean;
}) {
  return (
    <Card className={cn("h-full", hero && "bg-primary/10 border-primary/30")}>
      <CardContent className="flex flex-col gap-2">
        <p
          className={cn(
            "font-medium text-card-foreground",
            hero ? "text-4xl" : "text-2xl",
          )}
        >
          {stat.value}
        </p>
        <p className="text-sm font-medium text-foreground">{stat.label}</p>
        {stat.detail ? (
          <p className="text-xs text-muted-foreground">{stat.detail}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
