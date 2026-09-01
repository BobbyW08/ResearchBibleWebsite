"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListItem } from "@/lib/pain-points";

function TryAccordionItem({ item, index, defaultOpen }: { item: ListItem; index: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `try-panel-${index}`;

  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 rounded-lg bg-muted px-4 py-3 text-left"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {index + 1}
        </span>
        <span className="flex-1 text-sm font-medium leading-snug text-foreground">
          {item.title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        id={panelId}
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="border-t border-border px-4 py-3 pl-[52px] text-sm leading-relaxed text-muted-foreground">
            {item.body}
          </p>
        </div>
      </div>
    </div>
  );
}

function TryAccordion({ items }: { items: ListItem[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <TryAccordionItem key={item.title} item={item} index={index} defaultOpen={index === 0} />
      ))}
    </div>
  );
}

export default TryAccordion;
