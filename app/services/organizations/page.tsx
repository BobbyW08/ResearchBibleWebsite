import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import OfferCard, { type OfferCardData } from "@/components/marketing/services/offer-card";

export const metadata: Metadata = {
  title: "Services for Organizations",
  description:
    "Staff training, case consultation, contracted parent-education workshops, and reintegration aftercare for organizations and nonprofits.",
  alternates: {
    canonical: "/services/organizations",
  },
};

// Flagged in claude-code-handoff-full-site-redesign.md: this CTA intentionally
// does not point at the individual-parent "book a 30-min intro call" flow —
// the organizational sales cycle is longer and more relationship-driven, so it
// routes to a plain mailto conversation-starter instead until there's a
// dedicated contact form or scheduling link for this audience.
const ORG_CONTACT_HREF = "mailto:bobbywashburn0@gmail.com?subject=Let%27s%20talk%20about%20what%20your%20team%20needs";

const OFFERS: OfferCardData[] = [
  {
    title: "Staff Training & Professional Development",
    description:
      "Live, structured training in the peer-delivered parenting support model: the frameworks, the skill set, and how to apply them inside your team's existing role without scope creep.",
    details: ["$500 half-day (3–4 hrs) · $850 full day (6–7 hrs)", "Multi-session series available"],
  },
  {
    title: "Case Consultation",
    description:
      "When a family's stuck and nothing you're trying is landing, a peer lens can offer a different read on what's actually happening and a different entry point.",
    details: ["$45/hour", "Individual or team consultation"],
  },
  {
    title: "Parent Education Workshops",
    description:
      "Rather than an individually billed caseload, I contract directly with your organization to deliver a parent group, a school-based group, or a training series to your population. Priced as a package, not by the hour.",
    details: ["$850/engagement, flat", "Scope and schedule set together upfront"],
  },
  {
    title: "Reintegration Aftercare Plan",
    description:
      "A structured, flat-rate support package for families at the point of reintegration, post-reunification, post-incarceration, or post-program completion. Session intensity steps down over time as the family stabilizes.",
    details: [
      "$1,350/case, flat (roughly 11 hours across 8–9 weeks)",
      "Best fit for court-involved or reintegrating families needing structured, time-limited follow-up",
      "Multi-family/cohort pricing available for organizations placing several families a year; ask for a standing rate",
    ],
  },
];

export default function OrganizationsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-8 lg:py-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              For Organizations & Nonprofits
            </p>
            <h1 className="mt-3 font-heading text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              Your staff sits across from parents every day.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-normal text-muted-foreground">
              Case managers, behavioral specialists, family advocates, and clinicians. Good
              intentions aren&apos;t always enough to make those conversations land. Peer-delivered
              support fills a gap that no clinical hire fills, especially with families who are
              hardest to reach through traditional services.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 lg:py-20">
            <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
              What I Offer
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {OFFERS.map((offer) => (
                <OfferCard key={offer.title} {...offer} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-8 lg:py-20">
            <p className="max-w-xl text-base font-normal text-muted-foreground">
              Start a conversation about what your team needs.
            </p>
            <Link href={ORG_CONTACT_HREF} className={buttonVariants({ size: "lg" })}>
              Let&apos;s Talk →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
