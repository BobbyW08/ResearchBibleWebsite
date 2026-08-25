import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { HelpEntry } from "@/lib/pain-points";

type PainPointCardProps = {
  entry: HelpEntry;
  className?: string;
};

function PainPointCard({ entry, className }: PainPointCardProps) {
  const { icon: Icon, title, cardTeaser, slug, kind } = entry;
  const isModule = kind === "module";

  return (
    <Link
      href={`/common-pain-points/${slug}`}
      className={cn(
        "group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md",
            isModule ? "bg-accent/10 text-accent-foreground" : "bg-primary/10 text-primary",
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        {isModule && (
          <Badge variant="outline" className="h-auto px-2 py-0.5 text-[10px] uppercase tracking-wide">
            Context
          </Badge>
        )}
      </div>
      <h3 className="font-heading text-lg font-medium text-foreground">{title}</h3>
      <p className="text-sm font-normal text-muted-foreground">{cardTeaser}</p>
      <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-secondary transition-all group-hover:gap-2">
        {isModule ? "Read more" : "See what's happening"}
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

export default PainPointCard;
