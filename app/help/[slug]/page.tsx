import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import PainPointDetail from "@/components/marketing/pain-point-detail";
import AwarenessModuleDetail from "@/components/marketing/awareness-module-detail";
import { allHelpEntries, getHelpEntry } from "@/lib/pain-points";

type HelpPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allHelpEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: HelpPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getHelpEntry(slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.cardTeaser,
  };
}

export default async function HelpPage({ params }: HelpPageProps) {
  const { slug } = await params;
  const entry = getHelpEntry(slug);

  if (!entry) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        {entry.kind === "pain-point" ? (
          <PainPointDetail topic={entry} />
        ) : (
          <AwarenessModuleDetail module={entry} />
        )}
      </main>
      <Footer />
    </div>
  );
}
