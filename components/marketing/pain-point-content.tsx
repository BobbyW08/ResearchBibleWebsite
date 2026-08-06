import Link from "next/link";
import { AlertTriangle, ArrowRight, BookOpen, X } from "lucide-react";
import type { ContentBlock, ListItem, LinkRef } from "@/lib/pain-points";

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, index) => {
        if (block.kind === "stat") {
          return (
            <div
              key={index}
              className="rounded-md border-l-4 border-primary bg-primary/10 px-4 py-3 text-base font-medium text-primary"
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={index} className="flex flex-col gap-2">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-base text-foreground">
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p
            key={index}
            className="text-base font-normal leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: block.html }}
          />
        );
      })}
    </div>
  );
}

export function BackfireList({ items }: { items: ListItem[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.title} className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <X className="h-3.5 w-3.5 text-destructive" />
          </span>
          <p className="text-base text-foreground">
            <strong className="font-medium">{item.title}</strong> {item.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function SectionHead({
  icon: Icon,
  title,
}: {
  icon: typeof AlertTriangle;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
      <Icon className="h-[18px] w-[18px] text-secondary" />
      <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground">{title}</h2>
    </div>
  );
}

export function DeeperLinks({
  heading,
  deepDive,
  related,
}: {
  heading: string;
  deepDive?: LinkRef;
  related: LinkRef[];
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {heading}
      </p>
      <div className="flex flex-col gap-1">
        {deepDive && (
          <Link
            href={deepDive.href}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-secondary hover:underline"
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            Deep dive: {deepDive.label}
          </Link>
        )}
        {related.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-secondary hover:underline"
          >
            <ArrowRight className="h-4 w-4 shrink-0" />
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
