import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import FadeInView from "@/components/marketing/fade-in-view";
import { getAllPainPoints } from "@/lib/pain-points-reader";

// Row 2 panels — per homepage-redesign-v3.md Section 2: Parents and Groups
// both land on /services, deep-linked to the #one-on-one and #weekly-group
// anchors (see app/services/page.tsx); Organizations goes to its own page.
// Real photos of Bobby's own parents/groups/office aren't ready yet — these
// are warm-toned Unsplash stock placeholders standing in until he supplies
// real ones.
const ROW_TWO_PANELS = [
  {
    label: "Parents.",
    alt: "A parent with a toddler and baby at home",
    href: "/services#one-on-one",
    image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=70&auto=format&fit=crop",
  },
  {
    label: "Groups.",
    alt: "A small group of people talking around a table",
    href: "/services#weekly-group",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=70&auto=format&fit=crop",
  },
  {
    label: "Organizations.",
    alt: "Two office professionals working together",
    href: "/services/organizations",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=70&auto=format&fit=crop",
  },
];

async function StartHere() {
  const painPoints = await getAllPainPoints();

  return (
    <section id="start-here" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-[110rem] px-4 py-16 sm:px-8 lg:py-24">
        <FadeInView className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 text-center md:max-w-none">
          <p className="font-subtitle text-sm font-semibold uppercase tracking-widest text-primary">Start Here</p>
          <h2 className="font-heading text-3xl font-medium tracking-tight md:whitespace-nowrap md:text-4xl">
            Where can you use support today?
          </h2>
        </FadeInView>

        {/* Row 1 — left third Tech Safety Tool, right two-thirds Common Pain Points list. */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Link
            href="/tech-safety"
            className="group relative flex flex-col overflow-hidden rounded-lg border border-border lg:col-span-1"
          >
            <video
              src="/videos/tech-safety-tool.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="aspect-4/3 w-full object-cover lg:aspect-auto lg:h-full lg:min-h-[34rem]"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-6">
              <div className="rounded-md bg-primary/70 px-4 py-3">
                <h3 className="font-heading text-lg font-medium text-brand-offwhite">Tech Safety Tool</h3>
                <p className="mt-1 text-sm font-normal text-brand-offwhite/90">
                  Get control of the screens, device by device.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/70 p-1.5">
                <ArrowUpRight className="h-4 w-4 text-brand-offwhite transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>

          <div className="flex h-[34rem] flex-col overflow-hidden rounded-lg border border-border bg-card lg:col-span-2">
            <div className="shrink-0 bg-primary px-6 py-4">
              <h3 className="font-heading text-lg font-medium text-brand-offwhite">Common Pain Points</h3>
              <p className="mt-1 text-sm font-normal text-brand-offwhite/85">
                Find what&apos;s going on at your house.
              </p>
            </div>
            <ul className="flex-1 overflow-y-auto">
              {painPoints.map((topic) => (
                <li key={topic.slug}>
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

        {/* Row 2 — three equal-width panels, touching, same total width as Row 1. */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3">
          {ROW_TWO_PANELS.map((panel) => (
            <Link key={panel.label} href={panel.href} className="group relative flex flex-col overflow-hidden">
              <Image
                src={panel.image}
                alt={panel.alt}
                width={800}
                height={600}
                className="aspect-4/3 w-full object-cover"
              />
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
