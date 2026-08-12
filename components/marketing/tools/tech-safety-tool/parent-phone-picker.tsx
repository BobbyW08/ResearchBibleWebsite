"use client";

import { cn } from "@/lib/utils";
import type { ParentPhone } from "@/lib/tools/tech-safety-tool-data";

const OPTIONS: { id: ParentPhone; icon: string; title: string; description: string }[] = [
  { id: "iphone", icon: "📱", title: "I have an iPhone", description: "Controls Apple devices remotely via Family Sharing" },
  { id: "android", icon: "🤖", title: "I have an Android", description: "Controls Apple devices via browser + on-device setup" },
];

export function ParentPhonePicker({
  value,
  onChange,
}: {
  value: ParentPhone | null;
  onChange: (value: ParentPhone) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3.5 print:hidden">
      {OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex min-w-[200px] max-w-[320px] flex-1 items-center gap-3.5 rounded-xl border-2 bg-card px-5 py-4 text-left transition-all",
              selected
                ? "border-primary bg-accent shadow-md"
                : "border-border hover:border-secondary hover:shadow-sm",
            )}
          >
            <span className="shrink-0 text-2xl">{option.icon}</span>
            <div className="flex-1">
              <p className="font-heading text-sm font-semibold text-foreground">{option.title}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
            <span
              className={cn(
                "flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground transition-opacity",
                selected ? "opacity-100" : "opacity-0",
              )}
            >
              ✓
            </span>
          </button>
        );
      })}
    </div>
  );
}
