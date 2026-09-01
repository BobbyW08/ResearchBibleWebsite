import { AlertTriangle } from "lucide-react";
import PanelShell from "../panel-shell";
import type { SupportSignalsPanel as SupportSignalsPanelData } from "@/lib/pain-points/teen-rebellion-panels";

// The safety panel. Bobby's standing rule: "constant, clean, clear and
// highly legible, no animations, no ball movement, it's serious." PanelShell
// is given noMotion so it renders immediately with zero entrance animation
// and never registers with the route-ball system — see SupportSignalsPanel's
// type in lib/pain-points/teen-rebellion-panels.ts for the compile-time half
// of this guarantee.
function SupportSignalsPanel({ panel }: { panel: SupportSignalsPanelData }) {
  return (
    <PanelShell id={panel.id} layout={panel.layout} emphasis={panel.emphasis} noMotion>
      <div className="mb-6 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-700" />
        <h2 className="font-heading text-2xl font-bold text-brand-black sm:text-3xl">{panel.deck}</h2>
      </div>

      <div className="grid gap-px overflow-hidden border border-brand-black/10 bg-brand-black/10 md:grid-cols-3">
        {panel.lanes.map((lane) => (
          <div
            key={lane.label}
            className={lane.critical ? "bg-red-50 px-6 py-6" : "bg-brand-offwhite px-6 py-6"}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wide ${
                lane.critical ? "text-red-700" : "text-brand-black/60"
              }`}
            >
              {lane.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-brand-black/85">{lane.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-1 border-t border-brand-black/10 pt-4 text-sm text-brand-black/80">
        <p>
          988 Suicide &amp; Crisis Lifeline: Call or text <strong className="font-semibold">988</strong>
        </p>
        <p>
          Crisis Text Line: Text <strong className="font-semibold">HOME</strong> to{" "}
          <strong className="font-semibold">741741</strong>
        </p>
        <p>
          Local social services: Dial <strong className="font-semibold">211</strong>
        </p>
      </div>
    </PanelShell>
  );
}

export default SupportSignalsPanel;
