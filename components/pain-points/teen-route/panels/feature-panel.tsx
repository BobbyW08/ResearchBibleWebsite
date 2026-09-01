import PanelShell from "../panel-shell";
import ExpandToRead from "../interactions/expand-to-read";
import type { FeaturePanel as FeaturePanelData } from "@/lib/pain-points/teen-rebellion-panels";

function FeaturePanel({ panel }: { panel: FeaturePanelData }) {
  return (
    <PanelShell id={panel.id} size={panel.size} emphasis={panel.emphasis} panelMotion={panel.panelMotion}>
      <ExpandToRead
        label={panel.deck}
        preview={
          <>
            <p className="font-subtitle text-xs uppercase tracking-[0.2em] text-primary">
              Common pain points · Teens
            </p>
            {/* The page's real H1 — must stay in the initial, always-rendered
                preview markup, not gated behind the dialog. */}
            <h1 className="mt-3 font-heading text-2xl font-bold leading-tight text-brand-black sm:text-3xl lg:text-4xl">
              {panel.deck}
            </h1>
            <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-brand-black/80 sm:text-base">
              {panel.body}
            </p>
            <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-primary underline underline-offset-2">
              Read more
            </span>
          </>
        }
        full={
          <>
            <p className="font-subtitle text-xs uppercase tracking-[0.2em] text-primary">
              Common pain points · Teens
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold leading-tight text-brand-black sm:text-3xl">
              {panel.deck}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-brand-black/80">{panel.body}</p>
            {panel.pullQuote && (
              <p className="mt-6 font-quote text-2xl leading-snug text-primary sm:text-3xl">
                &ldquo;{panel.pullQuote}&rdquo;
              </p>
            )}
            {panel.source && (
              <p className="mt-5 text-xs uppercase tracking-wide text-brand-black/50">Source: {panel.source}</p>
            )}
          </>
        }
      />
    </PanelShell>
  );
}

export default FeaturePanel;
