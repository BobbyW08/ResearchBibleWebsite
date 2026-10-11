import { Badge } from "@/components/ui/badge";
import { getFaq } from "@/lib/payload-globals";
import FaqAccordion from "@/components/marketing/faq-accordion";
import FadeInView from "@/components/marketing/fade-in-view";

async function Faq() {
  const data = await getFaq().catch(() => null);
  const items = (data?.items as { question: string; answer: string }[] | undefined) ?? [];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:py-24">
        {items.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}
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
