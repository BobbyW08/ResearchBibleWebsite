import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import PainPointSidebarLayout from "@/components/marketing/pain-point-sidebar-layout";
import { getHelpEntry } from "@/lib/pain-points-reader";
import type { PainPointTopic } from "@/lib/pain-points";
import type { SidebarLayoutTopic } from "@/components/marketing/pain-point-sidebar-layout";

// `icon` (a LucideIcon function) can't cross the server→client boundary into
// the "use client" PainPointSidebarLayout — strip it before passing down.
// Same helper as app/common-pain-points/[slug]/page.tsx.
function toSidebarTopic(topic: PainPointTopic): SidebarLayoutTopic {
  const { icon: _icon, ...rest } = topic;
  return rest;
}

// A literal static segment takes precedence over the sibling dynamic
// [slug] route for this exact path, so this file owns /common-pain-points/teen
// without touching the other 9 pages' route. `getAllHelpEntries()` still
// includes `teen` (content/pain-points/teen.yaml stays the source of truth
// for the /common-pain-points index card and for this page's deepDive/related
// links) — only [slug]'s own generateStaticParams excludes it.
//
// Plain static generation (no `dynamic`/`revalidate` export): the page has
// no live per-request data anymore (Join the Group dropped its live count —
// see components/pain-points/teen-route/join-group-widget.tsx), and this
// content only changes on deploy. An earlier `force-dynamic` version
// re-invoked a fresh serverless function on every request just to read
// content/pain-points/teen.yaml from disk, and that read intermittently came
// back empty on a cold Lambda invocation, tripping notFound() below and
// 404ing the page for real users. Static generation reads the file once, at
// build time, and serves the resulting HTML from cache — immune to that race.
export async function generateMetadata(): Promise<Metadata> {
  const entry = await getHelpEntry("teen");
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.cardTeaser,
  };
}

// Temporary launch swap: rendering through the same interim sidebar/card
// layout as the other 9 pain-point pages (content/pain-points/teen.yaml
// already carries every field PainPointSidebarLayout needs — intro,
// exampleScenario, whatHappening, backfires, tries, support — it's just been
// unused by this route until now), so all 10 pages ship consistently for
// launch. The newspaper-mosaic-grid build (TeenRebellionRoute,
// components/pain-points/teen-route/) is untouched and still the intended
// long-term page — swap the JSX below back to it once that build is finished.
export default async function TeenPage() {
  const entry = await getHelpEntry("teen");
  if (!entry || entry.kind !== "pain-point") notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <PainPointSidebarLayout topic={toSidebarTopic(entry)} />
      </main>
      <Footer />
    </div>
  );
}
