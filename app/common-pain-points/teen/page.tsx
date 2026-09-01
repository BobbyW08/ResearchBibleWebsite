import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { count, eq } from "drizzle-orm";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import TeenRebellionRoute from "@/components/pain-points/teen-route/teen-rebellion-route";
import { getHelpEntry } from "@/lib/pain-points-reader";
import { db } from "@/lib/db";
import { interestSignups } from "@/lib/db/schema";

const JOIN_GROUP_SOURCE = "teen_weekly_group";

// The Join the Group count must be live per request, not frozen at build
// time — force dynamic rendering so it's queried on every request instead of
// once during `next build`/ISR (also avoids the build itself needing live DB
// access).
export const dynamic = "force-dynamic";

// A literal static segment takes precedence over the sibling dynamic
// [slug] route for this exact path, so this file owns /common-pain-points/teen
// without touching the other 9 pages' route. `getAllHelpEntries()` still
// includes `teen` (content/pain-points/teen.yaml stays the source of truth
// for the /common-pain-points index card and for this page's deepDive/related
// links) — only [slug]'s own generateStaticParams excludes it.
export async function generateMetadata(): Promise<Metadata> {
  const entry = await getHelpEntry("teen");
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.cardTeaser,
  };
}

export default async function TeenPage() {
  const [entry, [groupCountRow]] = await Promise.all([
    getHelpEntry("teen"),
    db.select({ count: count() }).from(interestSignups).where(eq(interestSignups.source, JOIN_GROUP_SOURCE)),
  ]);
  if (!entry || entry.kind !== "pain-point") notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <TeenRebellionRoute
          deepDive={entry.deepDive}
          related={entry.related}
          initialGroupCount={groupCountRow?.count ?? 0}
        />
      </main>
      <Footer />
    </div>
  );
}
