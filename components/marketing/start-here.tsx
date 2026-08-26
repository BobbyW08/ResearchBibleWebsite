import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import FadeInView from "@/components/marketing/fade-in-view";
import PlaceholderPhoto from "@/components/marketing/placeholder-photo";
import { getAllPainPoints } from "@/lib/pain-points-reader";

// Row 2 panels — per homepage-redesign-v3.md Section 2: Parents and Groups
// both land on /services, deep-linked to the #one-on-one and #weekly-group
// anchors (see app/services/page.tsx); Organizations goes to its own page.
// Real photos aren't ready yet (parent using the tool, group session, org
// office) — PlaceholderPhoto stands in until Bobby supplies them.
const ROW_TWO_PANELS = [
  { label: "Parents.", alt: "Photo of a parent", href: "/services#one-on-one" },
  { label: "Groups.", alt: "Photo of a group session", href: "/services#weekly-group" },
  { label: "Organizations.", alt: "Photo of an organization office", href: "/services/organizations" },
];

async function StartHere() {
  const painPoints = await getAllPainPoints();
  // Rendered twice back-to-back for the seamless vertical loop — every item
  // still lands in the initial HTML once conceptually and twice literally, so
  // the SEO requirement (all pain-point items in the DOM on load, not fetched
  // on interaction) holds regardless of the visual duplication.
  const carouselItems = [...painPoints, ...painPoints];

  return (
    <section id="start-here" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
        <FadeInView className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Start Here</p>
          <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
            Where can you use support today?
          </h2>
        </FadeInView>

        {/* Row 1 — left third Tech Safety Tool, right two-thirds Common Pain Points carousel. */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Link
            href="/tech-safety"
            className="group relative flex flex-col overflow-hidden rounded-lg border border-border lg:col-span-1"
          >
            <PlaceholderPhoto
              alt="Photo of a parent using the Tech Safety Tool"
              className="aspect-4/3 w-full lg:aspect-auto lg:h-full lg:min-h-[22rem]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-6">
              <div>
                <h3 className="font-heading text-lg font-medium text-brand-offwhite">Tech Safety Tool</h3>
                <p className="mt-1 text-sm font-normal text-brand-offwhite/80">
                  Get control of the screens, device by device.
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-brand-offwhite transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>

          <div className="marquee-group-vertical relative overflow-hidden rounded-lg border border-border bg-card lg:col-span-2">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-card to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-card to-transparent" />
            <div className="h-[24rem] overflow-hidden">
              <ul className="marquee-track-vertical flex flex-col">
                {carouselItems.map((topic, index) => (
                  <li key={`${topic.slug}-${index}`}>
                    <Link
                      href={`/common-pain-points/${topic.slug}`}
                      className="group flex items-center gap-4 border-b border-border px-6 py-5 transition-colors hover:bg-muted/60"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <topic.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-base font-medium text-foreground">
                          {topic.title}
                        </span>
                        <span className="block truncate text-sm font-normal text-muted-foreground">
                          {topic.cardTeaser}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Row 2 — three equal-width panels, touching, same total width as Row 1. */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3">
          {ROW_TWO_PANELS.map((panel) => (
            <Link key={panel.label} href={panel.href} className="group relative flex flex-col overflow-hidden">
              <PlaceholderPhoto alt={panel.alt} className="aspect-4/3 w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/5 to-transparent" />
              <p className="absolute bottom-5 left-5 font-title text-2xl font-bold text-brand-offwhite">
                {panel.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StartHere;
