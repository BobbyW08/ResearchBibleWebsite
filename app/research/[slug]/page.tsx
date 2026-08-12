import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { getAllResearchBibles, getResearchBible, resolveBibleBody } from "@/lib/research-bibles-reader";
import { renderBibleBody } from "@/lib/research-bibles/render-mdx";

type ResearchBiblePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const bibles = await getAllResearchBibles();
  return bibles.map((bible) => ({ slug: bible.slug }));
}

export async function generateMetadata({
  params,
}: ResearchBiblePageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getResearchBible(slug);
  if (!entry) return {};

  return {
    title: entry.title,
    robots: { index: !entry.noindex, follow: !entry.noindex },
  };
}

export default async function ResearchBiblePage({ params }: ResearchBiblePageProps) {
  const { slug } = await params;
  const entry = await getResearchBible(slug);

  if (!entry) notFound();

  const bodySource = await resolveBibleBody(entry.body);
  const bodyContent = await renderBibleBody(bodySource);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8 lg:py-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Research Bible &middot; v{entry.version}
          </p>
          <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
            {entry.title}
          </h1>
          {entry.lastUpdated ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated {entry.lastUpdated}
            </p>
          ) : null}

          {entry.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <article className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
            {bodyContent}
          </article>

          {entry.changelog.length > 0 ? (
            <section className="mt-16 border-t border-border pt-8">
              <h2 className="font-heading text-xl font-medium tracking-tight">Updates</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A visible history of changes to this document as new research is
                integrated.
              </p>
              <ol className="mt-6 space-y-6">
                {entry.changelog.map((item, index) => (
                  <li key={`${item.date}-${index}`} className="border-l-2 border-border pl-4">
                    {item.date ? (
                      <p className="text-sm font-medium text-foreground">{item.date}</p>
                    ) : null}
                    <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
                    {item.prUrl ? (
                      <a
                        href={item.prUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs text-muted-foreground underline"
                      >
                        View change
                      </a>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
