"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PainPoint } from "@/lib/pain-points";

type PainPointCardProps = PainPoint & {
  className?: string;
};

function PainPointCard({ title, label, body, slug, className }: PainPointCardProps) {
  return (
    <Link
      href={`/help/${slug}`}
      className={cn(
        "group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <p className="text-sm font-medium text-secondary">{label}</p>
      <h3 className="font-heading text-xl font-medium text-foreground">{title}</h3>
      <p className="text-base font-normal text-muted-foreground">{body}</p>
      <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-secondary transition-all group-hover:gap-2">
        See what&apos;s happening
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

export default PainPointCard;
