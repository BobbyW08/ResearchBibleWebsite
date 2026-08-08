import { Badge } from "@/components/ui/badge";
import { reader } from "@/lib/keystatic-reader";
import FaqAccordion from "@/components/marketing/faq-accordion";
import FadeInView from "@/components/marketing/fade-in-view";

async function Faq() {
  const data = await reader.singletons.faq.read();
  const items = data?.items ?? [];

  return (
    <section id="faq" className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:py-24">
        <FadeInView className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 text-center">
          <Badge variant="outline" className="h-auto px-3 py-1 text-sm">
            FAQ
          </Badge>
          <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
            Questions people ask before they reach out.
          </h2>
        </FadeInView>

        <FaqAccordion items={items} />
      </div>
    </section>
  );
}

export default Faq;
