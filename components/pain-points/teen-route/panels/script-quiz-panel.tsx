"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import PanelShell from "../panel-shell";
import type { ScriptQuizPanel as ScriptQuizPanelData } from "@/lib/pain-points/teen-rebellion-panels";

function ScriptQuizPanel({ panel }: { panel: ScriptQuizPanelData }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  return (
    <PanelShell id={panel.id} layout={panel.layout} emphasis={panel.emphasis} panelMotion={panel.panelMotion}>
      <h2 className="font-heading text-2xl font-bold text-brand-black sm:text-3xl">{panel.deck}</h2>
      <p className="mt-2 text-sm text-brand-black/60">Tap each line to see what to say instead.</p>

      <div className="mt-6 flex max-w-3xl flex-col gap-3">
        {panel.items.map((item, index) => {
          const isRevealed = revealed.has(index);
          return (
            <button
              key={index}
              type="button"
              onClick={() =>
                setRevealed((prev) => {
                  const next = new Set(prev);
                  next.add(index);
                  return next;
                })
              }
              className="flex flex-col items-start gap-2 border border-brand-black/10 bg-white px-5 py-4 text-left transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:gap-4"
            >
              <span className="text-base text-brand-black/40 line-through decoration-2">{item.strike}</span>
              {isRevealed && (
                <span className="flex items-center gap-2 text-base font-medium text-primary">
                  <ArrowRight className="h-4 w-4 shrink-0" />
                  {item.replace}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {panel.callout && (
        <div className="mt-6 max-w-3xl border-l-4 border-primary bg-primary/5 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{panel.callout.label}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-brand-black/80">{panel.callout.text}</p>
        </div>
      )}
    </PanelShell>
  );
}

export default ScriptQuizPanel;
