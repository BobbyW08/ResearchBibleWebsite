import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import NewsletterDialog from "@/components/marketing/newsletter-dialog";
import OfferCard, { type OfferCardData } from "@/components/marketing/services/offer-card";
import WedgedHeroHeadline from "@/components/marketing/services/wedged-hero-headline";
import ModalityCards from "@/components/marketing/services/modality-cards";

export const metadata: Metadata = {
  title: "Services for Parents",
  description:
    "1:1 sessions, a weekly drop-in group, Live Q&As, and 6-week cohorts — peer parenting support priced with a sliding scale.",
  alternates: {
    canonical: "/services",
  },
};

const OFFERS: OfferCardData[] = [
  {
    anchorId: "one-on-one",
    title: "1:1 Sessions",
    availability: "available",
    description:
      "Individual, one-on-one support. Same peer approach, paced to you, whether you're in the middle of a specific crisis, working through a diagnosis, or just need a steady person to talk things through with regularly.",
    details: ["$40/hour · sliding scale available ($25–30/hr); ask if cost is a barrier", "Weekly, ongoing", "Booked directly through Cal.com"],
    cta: { kind: "link", href: "https://cal.com/bobby-washburn/intro-call", external: true, label: "Book a session" },
  },
  {
    anchorId: "weekly-group",
    title: "Weekly Group",
    availability: "available",
    description:
      "An open, drop-in group. No application, no commitment to a series: just show up with what's actually going on. Hearing other parents say the quiet part out loud is part of what makes this work.",
    details: ["$20/seat", "Virtual, one session a week", "A new topic each week, grounded in real experience, not a fixed curriculum"],
    cta: {
      kind: "link",
      href: "https://cal.com/bobby-washburn/intro-call",
      external: true,
      label: "Talk to Bobby",
      note: "Free 30-minute intro call. No pressure. No judgment.",
    },
  },
  {
    title: "Live Q&As",
    availability: "comingSoon",
    description:
      "Submit a question ahead of time, get a direct, real answer in a live session — a faster, more direct format than the group.",
    details: ["$20/seat", "Launching as the weekly group gets going; check back or ask when booking a call"],
    cta: { kind: "newsletter", label: "Join the waitlist" },
  },
  {
    title: "Cohorts (6-Week Series)",
    availability: "comingSoon",
    description:
      "A committed, six-week deep-dive on one specific topic (behavior, co-parenting, anxiety, de-escalation, and others) with the same small group of parents the whole way through.",
    details: ["$400/seat for the full series", "Launching once there's a full cohort ready to go; ask about the current waitlist"],
    cta: { kind: "newsletter", label: "Join the waitlist" },
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        {/* Pinned hero — the intro copy, the video, and the "Together" reveal
            all live inside WedgedHeroHeadline itself (a sticky panel over a
            tall spacer, both on bg-brand-black), so it renders full-bleed
            here rather than being boxed into a max-width column. Its own
            closing paragraph + CTA render right after, on the same dark
            field, once the pin releases. */}
        <section className="border-b border-border">
          <WedgedHeroHeadline />
        </section>

        {/* Inverted palette for this section only: dark-gray field, brand red
            (brightened for contrast — see globals.css) for headers, off-white
            for body copy. Replaces the old "Start Walking Your Path"
            Stabilize/Connect/Structure/Adapt framework grid — per the
            finalized copy decision, that named framework is cut from this
            page entirely; this section names the actual modalities instead. */}
        <section className="border-b border-border bg-brand-charcoal">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-8 lg:py-20">
            <p className="font-subtitle text-xs font-semibold uppercase tracking-[0.25em] text-brand-red-bright sm:text-sm">
              My Approach
            </p>
            <h2 className="mt-3 font-heading text-2xl font-medium tracking-tight text-brand-offwhite sm:text-3xl">
              A Blending of Evidence-Based Practices
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base font-normal leading-relaxed text-brand-offwhite/80 sm:text-lg">
              Grounded in Peer Recovery/Support Specialist principles, brain-based parenting,
              trauma-informed parenting, and DBT-influenced skill building.
            </p>
            <ModalityCards />
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 lg:py-20">
            <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
              What I Offer
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {OFFERS.map((offer) => (
                <OfferCard key={offer.title} {...offer} />
              ))}
            </div>
            <p className="mt-8 text-sm font-normal text-muted-foreground">
              <span className="font-medium text-foreground">Sliding scale:</span> Cost should
              never be the reason a parent doesn&apos;t get support. Ask about sliding-scale
              availability for any of the above.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-8 lg:py-20">
            <p className="max-w-xl text-base font-normal text-muted-foreground">
              If any of this sounds like your house, start here. An intro call is thirty
              minutes. You tell me what&apos;s going on. I tell you honestly whether I&apos;m the
              right kind of help, and if I&apos;m not, I&apos;ll point you toward what is. No
              pitch.
            </p>
            <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
              <Link
                href="https://cal.com/bobby-washburn/intro-call"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ size: "lg" })}
              >
                Book an intro call →
              </Link>
              <NewsletterDialog triggerClassName={buttonVariants({ size: "lg", variant: "outline" })}>
                Join the newsletter →
              </NewsletterDialog>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
