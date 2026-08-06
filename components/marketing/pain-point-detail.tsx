import { AlertTriangle, Brain, CheckCircle2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PainPointTopic } from "@/lib/pain-points";
import AgeScenarioTabs from "@/components/marketing/pain-point-age-tabs";
import TryAccordion from "@/components/marketing/pain-point-accordion";
import SupportCallout from "@/components/marketing/pain-point-support-callout";
import { BackfireList, ContentBlocks, DeeperLinks, SectionHead } from "@/components/marketing/pain-point-content";

function PainPointDetail({ topic }: { topic: PainPointTopic }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8 lg:py-14">
      <Badge variant="outline" className="mb-3 h-auto gap-1.5 px-3 py-1 text-xs">
        <MapPin className="h-3 w-3" />
        {topic.tag}
      </Badge>
      <h1 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
        {topic.headline}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{topic.intro}</p>

      <div className="mt-6">
        <AgeScenarioTabs scenarios={topic.ageScenarios} defaultAge={topic.defaultAge} />
      </div>

      <div className="mb-4 rounded-lg border border-border bg-card p-6">
        <SectionHead icon={Brain} title="What's happening" />
        <ContentBlocks blocks={topic.whatHappening} />
      </div>

      <div className="mb-4 rounded-lg border border-border bg-card p-6">
        <SectionHead icon={AlertTriangle} title="Why this usually makes it worse" />
        <BackfireList items={topic.backfires} />
      </div>

      <div className="mb-4 rounded-lg border border-border bg-card p-6">
        <SectionHead icon={CheckCircle2} title="Try this week" />
        <TryAccordion items={topic.tries} />
      </div>

      <div className="mb-4">
        <SupportCallout heading="When to get more support" text={topic.support} crisis={topic.crisis} />
      </div>

      <DeeperLinks heading="Go deeper" deepDive={topic.deepDive} related={topic.related} />
    </div>
  );
}

export default PainPointDetail;
