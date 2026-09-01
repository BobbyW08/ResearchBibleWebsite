"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import PanelShell from "../panel-shell";
import ExpandToRead from "../interactions/expand-to-read";
import type { ActivityPickerPanel as ActivityPickerPanelData } from "@/lib/pain-points/teen-rebellion-panels";

// Expand-mapped, whole panel — clicking the tile opens the inset overlay
// showing all 3 items and their full paragraph copy at once. No accordion:
// Bobby doesn't want that pattern anywhere on this page. See
// claude/pain-point-newspaper-layout-v9.md Part 2.
//
// "Pick one" affordance — a small engagement cue, not a tracked feature.
// Checkmark state is UI-only, nothing persisted, and lives at this
// component's top level so it survives the overlay opening/closing.
function ActivityPickerPanel({ panel }: { panel: ActivityPickerPanelData }) {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <PanelShell
      id={panel.id}
      size={panel.size}
      emphasis={panel.emphasis}
      panelMotion={panel.panelMotion}
      // Centered like pick-one-thing's wide tile below it — left-aligned by
      // default this large a tile leaves a lopsided empty gutter on one
      // side; centered splits it evenly. See
      // claude/pain-point-newspaper-layout-v9.md Part 1's "eyeball and
      // adjust" note.
      className="md:col-start-2"
    >
      <ExpandToRead
        label={panel.deck}
        preview={
          <>
            <h2 className="font-heading text-xl font-bold text-brand-black sm:text-2xl">{panel.deck}</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {panel.items.map((item) => (
                <li key={item.title} className="line-clamp-1 text-sm text-brand-black/80 sm:text-base">
                  {item.title}
                </li>
              ))}
            </ul>
            <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-primary underline underline-offset-2">
              Read more
            </span>
          </>
        }
        full={
          <>
            <h2 className="font-heading text-2xl font-bold text-brand-black sm:text-3xl">{panel.deck}</h2>
            <div className="mt-6 flex flex-col gap-3">
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
          </>
        }
      />
    </PanelShell>
  );
}

export default ActivityPickerPanel;
