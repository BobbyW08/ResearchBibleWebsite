import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import TeenRebellionRoute from "@/components/pain-points/teen-route/teen-rebellion-route";
import { getHelpEntry } from "@/lib/pain-points-reader";

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

export default async function TeenPage() {
  const entry = await getHelpEntry("teen");
  if (!entry || entry.kind !== "pain-point") notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <TeenRebellionRoute deepDive={entry.deepDive} related={entry.related} />
      </main>
      <Footer />
    </div>
  );
}
