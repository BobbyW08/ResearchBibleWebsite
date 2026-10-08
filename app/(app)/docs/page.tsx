import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { getPayloadClient } from "@/lib/payload-client";

export const metadata: Metadata = {
  title: "Deep Dives | Bobby Washburn Parent Support",
  description:
    "Research-backed deep dives on parenting topics — organized across four pillars.",
  alternates: { canonical: "/docs" },
};

const PILLAR_ORDER = ["stabilize", "connect", "structure", "adapt"] as const;
const PILLAR_LABELS: Record<string, string> = {
  stabilize: "Stabilize",
  connect: "Connect",
  structure: "Structure",
  adapt: "Adapt",
};
const PILLAR_COLORS: Record<string, string> = {
  stabilize: "text-red-600",
  connect: "text-yellow-600",
  structure: "text-green-600",
  adapt: "text-blue-600",
};

type DeepDiveDoc = {
  id: string;
  slug: string;
  title: string;
  pillar: string;
  description?: string | null;
};

export default async function DocsPage() {
  const grouped: Record<string, DeepDiveDoc[]> = {};

  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "deep-dives",
      where: { _status: { equals: "published" } },
      limit: 200,
      depth: 0,
    });
    for (const doc of docs) {
      const d = doc as unknown as DeepDiveDoc;
      if (!grouped[d.pillar]) grouped[d.pillar] = [];
      grouped[d.pillar].push(d);
    }
  } catch {
    // Payload not ready — show empty state
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 lg:py-16">
          <h1 className="font-heading text-3xl font-medium tracking-tight">Deep Dives</h1>
          <p className="mt-3 text-base text-muted-foreground max-w-xl">
            Research-backed guides organized across four parenting pillars.
          </p>

          <div className="mt-12 space-y-12">
            {PILLAR_ORDER.map((pillar) => {
              const topics = grouped[pillar] ?? [];
              return (
                <section key={pillar}>
                  <h2
                    className={`font-subtitle text-sm font-bold uppercase tracking-widest ${PILLAR_COLORS[pillar]}`}
                  >
                    {PILLAR_LABELS[pillar]}
                  </h2>
                  {topics.length === 0 ? (
                    <p className="mt-4 text-sm text-muted-foreground">
                      No topics available yet.
                    </p>
                  ) : (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {topics.map((topic) => (
                        <Link
                          key={topic.id}
                          href={`/docs/${topic.slug}`}
                          className="group rounded-lg border border-border p-4 hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <p className="font-heading text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                            {topic.title}
                          </p>
                          {topic.description && (
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                              {topic.description}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
