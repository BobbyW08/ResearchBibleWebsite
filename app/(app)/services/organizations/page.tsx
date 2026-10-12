import type { Metadata } from "next";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { PageContainer } from "@/components/layout/page-container";
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
      "A Medicaid-covered peer services model for any agency with PBRSS certification. Your agency holds the certification, supervision and billing. I deliver the peer parent support to the families you refer, working alongside your clinical team and inside your existing workflow.",
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

export default function OrganizationsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border">
          <PageContainer className="py-16 text-center lg:py-24">
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
          </PageContainer>
        </section>

        {/* Offer cards */}
        <section className="border-b border-border">
          <PageContainer className="py-16 lg:py-20">
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
                    <p className="text-base font-normal text-muted-foreground">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageContainer>
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
