import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import PainPointSidebarLayout from "@/components/marketing/pain-point-sidebar-layout";
import AwarenessModuleDetail from "@/components/marketing/awareness-module-detail";
import { getAllHelpEntries, getHelpEntry } from "@/lib/pain-points-reader";
import type { PainPointTopic } from "@/lib/pain-points";
import type { SidebarLayoutTopic } from "@/components/marketing/pain-point-sidebar-layout";

// `icon` (a LucideIcon function) can't cross the server→client boundary
// into the "use client" PainPointSidebarLayout — strip it before passing down.
function toSidebarTopic(topic: PainPointTopic): SidebarLayoutTopic {
  const { icon: _icon, ...rest } = topic;
  return rest;
}

type HelpPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const entries = await getAllHelpEntries();
  // `teen` is owned by the static app/common-pain-points/teen/page.tsx route
  // (the newspaper-grid rebuild) — exclude it here so this dynamic route
  // doesn't also try to prerender a now-superseded version of that path.
  return entries.filter((entry) => entry.slug !== "teen").map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: HelpPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getHelpEntry(slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.cardTeaser,
  };
}

export default async function HelpPage({ params }: HelpPageProps) {
  const { slug } = await params;
  const entry = await getHelpEntry(slug);

  if (!entry) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        {entry.kind === "pain-point" ? (
          <PainPointSidebarLayout topic={toSidebarTopic(entry)} />
        ) : (
          <AwarenessModuleDetail module={entry} />
        )}
      </main>
      <Footer />
    </div>
  );
}
