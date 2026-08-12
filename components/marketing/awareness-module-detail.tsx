import { Badge } from "@/components/ui/badge";
import type { AwarenessModule } from "@/lib/pain-points";
import SupportCallout from "@/components/marketing/pain-point-support-callout";
import { ContentBlocks, DeeperLinks } from "@/components/marketing/pain-point-content";

function AwarenessModuleDetail({ module }: { module: AwarenessModule }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 lg:py-14">
      <Badge variant="outline" className="mb-3 h-auto bg-accent/10 px-3 py-1 text-xs text-accent-foreground">
        {module.tag}
      </Badge>
      <h1 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
        {module.headline}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{module.intro}</p>

      <div className="mt-8 flex flex-col gap-8">
        {module.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="mb-3 border-b-2 border-primary/15 pb-2 font-heading text-lg font-semibold text-primary">
              {section.heading}
            </h2>
            <ContentBlocks blocks={section.body} />
          </div>
        ))}
      </div>

      {module.crisis && (
        <div className="mt-6">
          <SupportCallout heading="In a mental health crisis" crisis />
        </div>
      )}

      <div className="mt-6">
        <DeeperLinks heading="Explore related topics" related={module.related} />
      </div>
    </div>
  );
}

export default AwarenessModuleDetail;
