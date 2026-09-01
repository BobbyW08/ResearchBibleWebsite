"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import PanelShell from "../panel-shell";
import type { ActivityPickerPanel as ActivityPickerPanelData } from "@/lib/pain-points/teen-rebellion-panels";

// Local "pick one" affordance — a small engagement cue, not a tracked
// feature. Checkmark state is UI-only, nothing persisted.
function ActivityPickerPanel({ panel }: { panel: ActivityPickerPanelData }) {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <PanelShell id={panel.id} layout={panel.layout} emphasis={panel.emphasis} panelMotion={panel.panelMotion}>
      <h2 className="font-heading text-2xl font-bold text-brand-black sm:text-3xl">{panel.deck}</h2>

      <div className="mt-6 flex max-w-3xl flex-col gap-3">
        {panel.items.map((item, index) => {
          const isPicked = picked === index;
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => setPicked(isPicked ? null : index)}
              className={`flex items-start gap-3 border px-5 py-4 text-left transition-colors ${
                isPicked ? "border-primary bg-primary/5" : "border-brand-black/10 bg-white hover:border-primary/30"
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  isPicked ? "border-primary bg-primary text-white" : "border-brand-black/30 text-brand-black/40"
                }`}
              >
                {isPicked ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span>
                <span className="block text-base font-semibold text-brand-black">{item.title}</span>
                <span className="mt-1.5 block text-sm leading-relaxed text-brand-black/75">{item.body}</span>
              </span>
            </button>
          );
        })}
      </div>
    </PanelShell>
  );
}

export default ActivityPickerPanel;
