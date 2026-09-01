"use client";

import type { LinkRef } from "@/lib/pain-points";
import { TEEN_PANELS } from "@/lib/pain-points/teen-rebellion-panels";
import { RouteBallProvider } from "./route-ball/route-ball-provider";
import RouteBall from "./route-ball/route-ball";
import PanelGrid from "./panel-grid";
import PinnedCtaPanel from "./pinned-cta-panel";
import FeaturePanel from "./panels/feature-panel";
import ExplanationPanel from "./panels/explanation-panel";
import ComparisonLanesPanel from "./panels/comparison-lanes-panel";
import ScriptQuizPanel from "./panels/script-quiz-panel";
import ActivityPickerPanel from "./panels/activity-picker-panel";
import SupportSignalsPanel from "./panels/support-signals-panel";
import RouteCtaPanel from "./panels/route-cta-panel";

function TeenRebellionRoute({
  deepDive,
  related,
  initialGroupCount,
}: {
  deepDive?: LinkRef;
  related: LinkRef[];
  initialGroupCount: number;
}) {
  return (
    <RouteBallProvider>
      <div className="relative">
        <PinnedCtaPanel deepDive={deepDive} related={related} initialGroupCount={initialGroupCount} />
        <PanelGrid>
          {TEEN_PANELS.map((panel) => {
            switch (panel.type) {
              case "feature":
                return <FeaturePanel key={panel.id} panel={panel} />;
              case "explanation":
                return <ExplanationPanel key={panel.id} panel={panel} />;
              case "comparison":
                return <ComparisonLanesPanel key={panel.id} panel={panel} />;
              case "script-quiz":
                return <ScriptQuizPanel key={panel.id} panel={panel} />;
              case "activity-picker":
                return <ActivityPickerPanel key={panel.id} panel={panel} />;
              case "support-signals":
                return <SupportSignalsPanel key={panel.id} panel={panel} />;
              case "cta":
                return <RouteCtaPanel key={panel.id} panel={panel} deepDive={deepDive} related={related} />;
              default:
                return null;
            }
          })}
        </PanelGrid>
        <RouteBall />
      </div>
    </RouteBallProvider>
  );
}

export default TeenRebellionRoute;
