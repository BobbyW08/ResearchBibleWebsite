import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { getAllResearchBibles } from "@/lib/research-bibles-reader";

export const metadata: Metadata = {
  title: "Research Bibles",
  description:
    "Long-form, evidence-backed reference documents behind the site's parent-facing content.",
};

export default async function ResearchBiblesIndexPage() {
  const bibles = await getAllResearchBibles();

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 lg:py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              Research Bibles
            </h1>
            <p className="max-w-xl text-base font-normal text-muted-foreground">
              The internal, evidence-backed reference documents behind the parent-facing
              content on this site — kept current as new research comes in, with a
              visible change history on every page.
            </p>
          </div>

          {bibles.length === 0 ? (
            <p className="mt-12 text-center text-sm text-muted-foreground">
              No research bibles published yet.
            </p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {bibles.map((bible) => (
                <Link
                  key={bible.slug}
                  href={`/research/${bible.slug}`}
                  className="rounded-lg border border-border bg-surface p-6 transition hover:border-primary"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    v{bible.version}
                  </p>
                  <h2 className="mt-2 font-heading text-lg font-medium tracking-tight">
                    {bible.title}
                  </h2>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
