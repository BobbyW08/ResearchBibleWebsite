import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { PageContainer } from "@/components/layout/page-container";
import { getPayloadClient } from "@/lib/payload-client";

type DeepDiveDoc = {
  id: string;
  slug: string;
  title: string;
  pillar: string;
  description?: string | null;
  body: unknown;
  noindex?: boolean;
};

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({ collection: "deep-dives", limit: 200, depth: 0 });
    return docs.map((d) => ({ slug: (d as unknown as DeepDiveDoc).slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "deep-dives",
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
      limit: 1,
      depth: 0,
    });
    if (docs.length === 0) return {};
    const doc = docs[0] as unknown as DeepDiveDoc;
    return {
      title: doc.title,
      description: doc.description ?? undefined,
      alternates: { canonical: `/docs/${slug}` },
      robots: { index: !doc.noindex, follow: !doc.noindex },
    };
  } catch {
    return {};
  }
}

export default async function DeepDivePage({ params }: PageProps) {
  const { slug } = await params;

  let doc: DeepDiveDoc | null = null;
  let pillarDocs: { slug: string; title: string }[] = [];
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "deep-dives",
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
      limit: 1,
      depth: 0,
    });
    if (docs.length > 0) {
      doc = docs[0] as unknown as DeepDiveDoc;
      const related = await payload.find({
        collection: "deep-dives",
        where: {
          and: [
            { pillar: { equals: doc.pillar } },
            { _status: { equals: "published" } },
            { slug: { not_equals: slug } },
          ],
        },
        limit: 8,
        depth: 0,
      });
      pillarDocs = (related.docs as unknown as DeepDiveDoc[]).map((d) => ({
        slug: d.slug,
        title: d.title,
      }));
    }
  } catch {
    notFound();
  }

  if (!doc) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <PageContainer className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr] lg:gap-14">
            {/* Main article */}
            <div>
              <nav className="mb-6 text-sm text-muted-foreground">
                <Link href="/docs" className="hover:text-foreground transition-colors">
                  Deep Dives
                </Link>
                <span className="mx-2">/</span>
                <span>{doc.title}</span>
              </nav>

              <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
                {doc.title}
              </h1>
              {doc.description && (
                <p className="mt-3 text-base text-muted-foreground">{doc.description}</p>
              )}

              <article className="prose prose-neutral mt-8 max-w-[70ch] prose-headings:font-heading prose-headings:text-foreground prose-a:text-primary">
                {doc.body ? (
                  <RichText data={doc.body as Parameters<typeof RichText>[0]["data"]} />
                ) : (
                  <p className="text-muted-foreground">Content coming soon.</p>
                )}
              </article>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-8">
                <Link
                  href="/docs"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  &larr; All deep dives
                </Link>

                {pillarDocs.length > 0 && (
                  <div className="mt-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                      More in this pillar
                    </p>
                    <ul className="flex flex-col gap-2">
                      {pillarDocs.map((related) => (
                        <li key={related.slug}>
                          <Link
                            href={`/docs/${related.slug}`}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {related.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
