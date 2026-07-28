"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import PlaceholderPhoto from "@/components/marketing/placeholder-photo";

export type Guide = {
  title: string;
  description: string;
  imageAlt: string;
  href: string;
};

type GuideCardProps = Guide & {
  className?: string;
};

function GuideCard({ title, description, imageAlt, href, className }: GuideCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <PlaceholderPhoto alt={imageAlt} className="h-48 w-full" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-heading text-xl font-medium text-foreground">{title}</h3>
        <p className="text-base font-normal text-muted-foreground">{description}</p>
        <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-secondary transition-all group-hover:gap-2">
          Start this guide
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default GuideCard;
