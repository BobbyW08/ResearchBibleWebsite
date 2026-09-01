import PanelShell from "../panel-shell";
import RockToRead from "../interactions/rock-to-read";
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
    <PanelShell
      id={panel.id}
      size={panel.size}
      emphasis={panel.emphasis}
      panelMotion={panel.panelMotion}
      // The one "wide, centered" panel — see claude/pain-point-newspaper-layout-v9.md
      // Part 1's grid mapping table. Sits on top of PanelShell's own
      // `md:col-span-2` for the "wide" token.
      className="md:col-start-2"
    >
      <RockToRead>
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
      </RockToRead>
    </PanelShell>
  );
}

export default RouteCtaPanel;
