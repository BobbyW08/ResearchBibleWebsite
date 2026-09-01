import PanelShell from "../panel-shell";
import { DeeperLinks } from "@/components/marketing/pain-point-content";
import type { LinkRef } from "@/lib/pain-points";
import type { CtaPanel as CtaPanelData } from "@/lib/pain-points/teen-rebellion-panels";

function RouteCtaPanel({
  panel,
  deepDive,
  related,
}: {
  panel: CtaPanelData;
  deepDive?: LinkRef;
  related: LinkRef[];
}) {
  return (
    <PanelShell id={panel.id} layout={panel.layout} emphasis={panel.emphasis} panelMotion={panel.panelMotion}>
      <h2 className="font-heading text-2xl font-bold text-brand-black sm:text-3xl">{panel.deck}</h2>
      <div className="mt-5 flex max-w-3xl flex-col gap-4">
        {panel.body.split("\n\n").map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed text-brand-black/80 sm:text-lg">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8 max-w-3xl">
        <DeeperLinks heading="Go deeper" deepDive={deepDive} related={related} />
      </div>
    </PanelShell>
  );
}

export default RouteCtaPanel;
