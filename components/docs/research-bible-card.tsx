import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResearchBible } from "@/lib/research-bibles";

type ResearchBibleCardProps = {
  bible: ResearchBible;
  className?: string;
};

function ResearchBibleCard({ bible, className }: ResearchBibleCardProps) {
  return (
    <Link
      href={`/docs/${bible.slug}`}
      className={cn(
        "group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <h3 className="font-heading text-base font-medium text-foreground">
        {bible.title}
      </h3>
      <p className="text-sm font-normal text-muted-foreground">
        {bible.description}
      </p>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-secondary transition-all group-hover:gap-2">
        Read this guide
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

export default ResearchBibleCard;
