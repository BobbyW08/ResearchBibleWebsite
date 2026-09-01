import PanelShell from "../panel-shell";
import { renderBoldSegments } from "../inline-markdown";
import type { ExplanationPanel as ExplanationPanelData } from "@/lib/pain-points/teen-rebellion-panels";

function ExplanationPanel({ panel }: { panel: ExplanationPanelData }) {
  return (
    <PanelShell id={panel.id} layout={panel.layout} emphasis={panel.emphasis} panelMotion={panel.panelMotion}>
      <h2 className="font-heading text-2xl font-bold text-brand-black sm:text-3xl">{panel.deck}</h2>
      <div className="mt-5 flex max-w-3xl flex-col gap-4">
        {panel.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed text-brand-black/80 sm:text-lg">
            {renderBoldSegments(paragraph)}
          </p>
        ))}
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

export default ExplanationPanel;
