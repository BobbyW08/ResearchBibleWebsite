import type { Metadata } from "next";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import PainPointCard from "@/components/marketing/pain-point-card";
import { getAllAwarenessModules, getAllPainPoints } from "@/lib/pain-points-reader";

export const metadata: Metadata = {
  title: "Pain Points",
  description:
    "Find the situation that feels closest to what's happening at home, and start there.",
};

export default async function HelpIndexPage() {
  const [painPoints, awarenessModules] = await Promise.all([
    getAllPainPoints(),
    getAllAwarenessModules(),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 lg:py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              Where can you use support today?
            </h1>
            <p className="max-w-xl text-base font-normal text-muted-foreground">
              Choose what&apos;s happening in your home right now. We&apos;ll
              take you straight to what&apos;s most useful.
            </p>
          </div>

          <p className="mt-12 mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Common situations
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {painPoints.map((topic) => (
              <PainPointCard key={topic.slug} entry={topic} />
            ))}
          </div>

          <p className="mt-12 mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Big picture
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {awarenessModules.map((module) => (
              <PainPointCard key={module.slug} entry={module} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
