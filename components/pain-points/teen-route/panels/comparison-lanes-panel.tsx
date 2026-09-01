import { Check, X } from "lucide-react";
import PanelShell from "../panel-shell";
import RockToRead from "../interactions/rock-to-read";
import type { ComparisonPanel as ComparisonPanelData } from "@/lib/pain-points/teen-rebellion-panels";

// Named ComparisonLanesPanel (not ComparisonPanel) to avoid colliding with
// the existing MDX ComparisonPanel in components/mdx/. Both lanes and the
// pull quote are already fully visible at this panel's banner size, so a
// click just adds a tactile Rock beat rather than expanding anything — see
// claude/pain-point-newspaper-layout-v9.md Part 2.
function ComparisonLanesPanel({ panel }: { panel: ComparisonPanelData }) {
  return (
    <PanelShell id={panel.id} size={panel.size} emphasis={panel.emphasis} panelMotion={panel.panelMotion}>
      <RockToRead>
        <h2 className="font-heading text-2xl font-bold text-brand-black sm:text-3xl">{panel.deck}</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-black/80 sm:text-lg">{panel.body}</p>

        <div className="mt-8 grid gap-px overflow-hidden border border-brand-black/10 bg-brand-black/10 md:grid-cols-2">
          {panel.lanes.map((lane) => (
            <div
              key={lane.title}
              className={lane.hold ? "bg-brand-offwhite px-6 py-6" : "bg-[#EDEFF2] px-6 py-6"}
            >
              <div className="mb-3 flex items-center gap-2">
                {lane.hold ? (
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <X className="h-4 w-4 shrink-0 text-brand-black/50" />
                )}
                <p className="text-sm font-bold uppercase tracking-wide text-brand-black">{lane.title}</p>
              </div>
              <p className="text-sm leading-relaxed text-brand-black/80">{lane.body}</p>
            </div>
          ))}
        </div>

        {panel.pullQuote && (
          <p className="mt-8 max-w-2xl font-quote text-3xl leading-snug text-primary">&ldquo;{panel.pullQuote}&rdquo;</p>
        )}

        {panel.callout && (
          <div className="mt-6 max-w-3xl border-l-4 border-primary bg-primary/5 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{panel.callout.label}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-black/80">{panel.callout.text}</p>
          </div>
        )}
      </RockToRead>
    </PanelShell>
  );
}

export default ComparisonLanesPanel;
