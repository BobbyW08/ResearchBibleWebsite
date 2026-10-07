import type { Metadata } from "next";
import Link from "next/link";
import { readAllPainPoints, readAllAwarenessModules, readTestimonials } from "@/lib/content-reader";
import { getAllResearchBibles } from "@/lib/research-bibles-reader";

export const metadata: Metadata = {
  title: "Page Registry",
  robots: { index: false, follow: false },
};

const ONE_OFF_ROUTES = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-bobby" },
  { label: "Services (parents)", href: "/services" },
  { label: "Services (organizations)", href: "/services/organizations" },
  { label: "Common pain points index", href: "/common-pain-points" },
  { label: "Docs gallery", href: "/docs" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Research bibles index", href: "/research" },
  { label: "Tech Safety & Consequence Setup", href: "/tech-safety" },
  { label: "Tools", href: "/tools" },
  { label: "Admin (Payload)", href: "/admin" },
];

async function getRegistrySections() {
  const [researchBibles, painPoints, awarenessModules, testimonials] = await Promise.all([
    getAllResearchBibles(),
    Promise.resolve(readAllPainPoints()),
    Promise.resolve(readAllAwarenessModules()),
    Promise.resolve(readTestimonials()),
  ]);

  return [
    {
      label: "Research Bibles",
      entries: researchBibles.map((b) => ({ label: b.slug, href: `/research/${b.slug}` })),
    },
    {
      label: "Pain Points",
      entries: painPoints.map(({ slug }) => ({ label: slug, href: `/common-pain-points/${slug}` })),
    },
    {
      label: "Awareness Modules",
      entries: awarenessModules.map(({ slug }) => ({
        label: slug,
        href: `/common-pain-points/${slug}`,
      })),
    },
    {
      label: "Testimonials (no public route — CMS entries only)",
      entries: testimonials.map((t, i) => ({ label: `${i + 1}: ${t.attribution}`, href: null })),
    },
  ];
}

export default async function InternalPageRegistry() {
  const sections = await getRegistrySections();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-heading text-2xl font-medium tracking-tight">Page Registry</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Internal reference only — not in nav, not indexed. Every collection-backed and
        one-off route on the site, for QA and orientation.
      </p>

      <section className="mt-8">
        <h2 className="font-heading text-lg font-medium tracking-tight">One-off routes</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {ONE_OFF_ROUTES.map((route) => (
            <li key={route.href}>
              <Link href={route.href} className="underline">
                {route.href}
              </Link>{" "}
              — {route.label}
            </li>
          ))}
        </ul>
      </section>

      {sections.map((section) => (
        <section key={section.label} className="mt-8">
          <h2 className="font-heading text-lg font-medium tracking-tight">{section.label}</h2>
          {section.entries.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No entries.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {section.entries.map((entry) =>
                entry.href ? (
                  <li key={entry.label}>
                    <Link href={entry.href} className="underline">
                      {entry.href}
                    </Link>
                  </li>
                ) : (
                  <li key={entry.label}>{entry.label}</li>
                ),
              )}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
