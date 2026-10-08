import type { Metadata } from "next";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import OrgInquiryForm from "@/components/marketing/organizations/org-inquiry-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Services for Organizations",
  description:
    "Staff training, nonclinical family support programs, parent education workshops, and reintegration planning for organizations and nonprofits.",
  alternates: {
    canonical: "/services/organizations",
  },
};

const OFFER_CARDS = [
  {
    title: "Staff Training and Consultation",
    description:
      "Live training in peer-delivered family support: the frameworks, the skill set, and how to apply them inside your team's existing role. Peer-informed consultation on engaging families who are hard to reach through traditional services is included here, not billed separately. One-day or short-series format. Scope and schedule set together upfront.",
  },
  {
    title: "Nonclinical Family Support Program",
    description:
      "For families a partner refers who are not a fit for clinical services, or who need practical support alongside them. A structured 90-day pathway: referral, engagement, a closed cohort or workshop, a warm handoff when appropriate, a summary report, and a continue/adapt/stop decision. Building with partners, one pilot at a time. This is not a billable clinical or peer service.",
  },
  {
    title: "Parent Education Workshops",
    description:
      "Narrow, topic-specific sessions delivered to your population. A lower-stakes first engagement with a clear deliverable. Scope and schedule set upfront, priced per engagement.",
  },
  {
    title: "Reintegration Planning",
    description:
      "A structured, time-limited plan for families at the point of reintegration: post-reunification, post-incarceration, or post-program completion. Support intensity steps down over time as the family stabilizes. Fixed scope, fixed timeline, single cap. Multi-family pricing available for organizations placing several families a year.",
  },
];

const PILOT_STEPS = [
  {
    number: 1,
    label: "Referral",
    detail: "Partner identifies families who need support and do not fit clinical criteria.",
  },
  {
    number: 2,
    label: "Engagement",
    detail: "Initial outreach and intake. Building trust before any structured work begins.",
  },
  {
    number: 3,
    label: "Cohort or workshop",
    detail: "Closed group, topic-focused, delivered over a defined period.",
  },
  {
    number: 4,
    label: "Warm handoff",
    detail:
      "When a family needs more than peer support, connections are made before the program ends.",
  },
  {
    number: 5,
    label: "Summary report",
    detail:
      "A plain-language summary of participation and outcomes. No clinical language, no private identifying information.",
  },
  {
    number: 6,
    label: "Decision point",
    detail: "Continue, adapt, or stop. No automatic renewal.",
  },
];

const WHAT_I_PROVIDE = [
  "Peer support and family engagement",
  "Group facilitation",
  "Practical skill building",
  "Progress notes and a summary report",
  "Warm handoffs to clinical or community resources",
];

const WHAT_YOU_RETAIN = [
  "Clinical decisions",
  "Child safety determination",
  "Crisis response",
  "Mandated reporting",
  "Clinical documentation",
];

export default function OrganizationsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-8 lg:py-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              For Organizations and Nonprofits
            </p>
            <h1 className="mt-3 font-heading text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              Your staff sits across from parents every day.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-normal text-muted-foreground">
              Case managers, behavioral specialists, family advocates, and clinicians. Good
              intentions are not always enough to make those conversations land. Peer-delivered
              support fills a gap that no clinical hire fills, especially with families who are
              hardest to reach through traditional services.
            </p>
          </div>
        </section>

        {/* Offer cards */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 lg:py-20">
            <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
              What I Offer
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {OFFER_CARDS.map((card) => (
                <Card key={card.title} className="h-full py-8">
                  <CardContent className="flex h-full flex-col gap-4 px-7">
                    <h3 className="font-heading text-xl font-medium text-foreground">
                      {card.title}
                    </h3>
                    <p className="text-base font-normal text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How a pilot works */}
        <section className="border-b border-border bg-muted/40">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8 lg:py-20">
            <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
              How a pilot works
            </h2>
            <ol className="mt-10 flex flex-col gap-6">
              {PILOT_STEPS.map((step) => (
                <li key={step.number} className="flex gap-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {step.number}
                  </span>
                  <div className="pt-0.5">
                    <p className="font-heading text-base font-medium text-foreground">
                      {step.label}
                    </p>
                    <p className="mt-1 text-base font-normal text-muted-foreground">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What I do vs what you keep */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8 lg:py-20">
            <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
              What I do and what you keep
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background p-6">
                <p className="font-heading text-base font-semibold text-foreground">
                  What I provide
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {WHAT_I_PROVIDE.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-background p-6">
                <p className="font-heading text-base font-semibold text-foreground">
                  What your organization retains
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {WHAT_YOU_RETAIN.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-6 text-sm font-medium text-foreground">
              This is peer support, not therapy, clinical case management, or a mandated service.
            </p>
          </div>
        </section>

        {/* How this gets funded */}
        <section className="border-b border-border bg-muted/40">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8 lg:py-20">
            <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
              How this gets funded
            </h2>
            <p className="mt-5 max-w-2xl text-base font-normal text-muted-foreground">
              These services typically fit within family engagement, prevention, peer support, or
              grant deliverable budget lines. Structures include a fixed-scope pilot, a sponsored
              cohort, a per-cohort fee, or a longer retainer after a pilot completes. No prices are
              published. All engagements are fixed scope with a fixed cap. Request a quote to start
              the conversation.
            </p>
          </div>
        </section>

        {/* Inquiry form */}
        <section id="inquiry" className="scroll-mt-20">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Get in touch
            </p>
            <h2 className="mt-3 font-heading text-2xl font-medium tracking-tight sm:text-3xl">
              Start a conversation
            </h2>
            <p className="mt-4 text-base font-normal text-muted-foreground">
              Use this form to introduce your organization and what you are working on. No
              commitment, no pitch. Do not include any family or client information in this form.
            </p>
            <div className="mt-10">
              <OrgInquiryForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
