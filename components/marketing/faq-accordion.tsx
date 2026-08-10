"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = {
  question: string;
  answer: string;
};

function FaqAccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `faq-panel-${index}`;

  return (
    <div className="border-b border-border">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-heading text-base font-medium text-foreground sm:text-lg">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        id={panelId}
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="whitespace-pre-line text-base font-normal text-muted-foreground">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="mt-10">
      {items.map((item, index) => (
        <FaqAccordionItem key={item.question} item={item} index={index} />
      ))}
    </div>
  );
}

export default FaqAccordion;
