import PanelShell from "../panel-shell";
import ExpandToRead from "../interactions/expand-to-read";
import { renderBoldSegments } from "../inline-markdown";
import type { ExplanationPanel as ExplanationPanelData } from "@/lib/pain-points/teen-rebellion-panels";

// Both panels using this component (`whats-happening`, `why-it-backfires`)
// are Expand-mapped — their full body copy doesn't comfortably fit their
// grid tile. See claude/pain-point-newspaper-layout-v9.md Part 2.
function ExplanationPanel({ panel }: { panel: ExplanationPanelData }) {
  return (
    <PanelShell id={panel.id} size={panel.size} emphasis={panel.emphasis} panelMotion={panel.panelMotion}>
      <ExpandToRead
        label={panel.deck}
        preview={
          <>
            <h2 className="font-heading text-xl font-bold text-brand-black sm:text-2xl">{panel.deck}</h2>
            <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-brand-black/80 sm:text-base">
              {renderBoldSegments(panel.paragraphs[0])}
            </p>
            <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-primary underline underline-offset-2">
              Read more
            </span>
          </>
        }
        full={
          <>
            <h2 className="font-heading text-2xl font-bold text-brand-black sm:text-3xl">{panel.deck}</h2>
            <div className="mt-5 flex flex-col gap-4">
              {panel.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed text-brand-black/80">
                  {renderBoldSegments(paragraph)}
                </p>
              ))}
            </div>
            {panel.callout && (
              <div className="mt-6 border-l-4 border-primary bg-primary/5 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{panel.callout.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-black/80">{panel.callout.text}</p>
              </div>
            )}
          </>
        }
      />
    </PanelShell>
  );
}

export default ExplanationPanel;
