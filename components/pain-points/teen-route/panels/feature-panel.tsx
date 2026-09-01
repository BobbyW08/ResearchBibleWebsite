import PanelShell from "../panel-shell";
import type { FeaturePanel as FeaturePanelData } from "@/lib/pain-points/teen-rebellion-panels";

function FeaturePanel({ panel }: { panel: FeaturePanelData }) {
  return (
    <PanelShell id={panel.id} layout={panel.layout} emphasis={panel.emphasis} panelMotion={panel.panelMotion}>
      <p className="font-subtitle text-xs uppercase tracking-[0.2em] text-primary">
        Common pain points · Teens
      </p>
      <h1 className="mt-4 max-w-4xl font-heading text-3xl font-bold leading-tight text-brand-black sm:text-5xl lg:text-6xl">
        {panel.deck}
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-brand-black/80 sm:text-lg">
        {panel.body}
      </p>
      {panel.pullQuote && (
        <p className="mt-8 max-w-2xl font-quote text-3xl leading-snug text-primary sm:text-4xl">
          &ldquo;{panel.pullQuote}&rdquo;
        </p>
      )}
      {panel.source && (
        <p className="mt-6 text-xs uppercase tracking-wide text-brand-black/50">Source: {panel.source}</p>
      )}
    </PanelShell>
  );
}

export default FeaturePanel;
