"use client";

import { useState } from "react";
import { UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AGE_BANDS, type AgeBand, type AgeScenarios } from "@/lib/pain-points";

type AgeScenarioTabsProps = {
  scenarios: AgeScenarios;
  defaultAge: AgeBand;
};

function AgeScenarioTabs({ scenarios, defaultAge }: AgeScenarioTabsProps) {
  const [activeAge, setActiveAge] = useState<AgeBand>(defaultAge);

  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        Show examples for your child&apos;s age:
      </p>
      <div className="flex flex-wrap gap-2">
        {AGE_BANDS.map((age) => (
          <button
            key={age}
            type="button"
            onClick={() => setActiveAge(age)}
            className={cn(
              "rounded-full border px-3.5 py-1 text-sm font-medium transition-colors",
              age === activeAge
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-secondary hover:text-secondary",
            )}
          >
            {age}
          </button>
        ))}
      </div>

      <div className="mt-3 min-h-16 rounded-lg border border-l-[3px] border-border border-l-secondary bg-card px-4 py-3">
        <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <UserCircle className="h-3.5 w-3.5" />
          What this might look like
        </p>
        <p className="text-sm italic leading-relaxed text-muted-foreground">
          {scenarios[activeAge] ?? ""}
        </p>
      </div>
    </div>
  );
}

export default AgeScenarioTabs;
