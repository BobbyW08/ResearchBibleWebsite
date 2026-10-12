import {
  CATEGORY_INFO,
  CATEGORY_ORDER,
  getResearchBiblesByCategory,
} from "@/lib/research-bibles";
import ResearchBibleCard from "@/components/docs/research-bible-card";

function ResearchBiblesGrid() {
  return (
    <div className="flex flex-col gap-12">
      {CATEGORY_ORDER.map((category, index) => {
        const bibles = getResearchBiblesByCategory(category);
        const info = CATEGORY_INFO[category];

        return (
          <section key={category} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                  {index + 1}
                </span>
                <h2 className="font-heading text-xl font-medium text-foreground">
                  {info.title}
                </h2>
              </div>
              <p className="text-sm font-normal text-muted-foreground">
                {info.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bibles.map((bible) => (
                <ResearchBibleCard key={bible.slug} bible={bible} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default ResearchBiblesGrid;
