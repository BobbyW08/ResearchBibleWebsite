import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import PlaceholderPhoto from "@/components/marketing/placeholder-photo";
import NewsletterDialog from "@/components/marketing/newsletter-dialog";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bobby Washburn",
  url: "https://bobby-washburn.com/about",
  jobTitle: "Certified Peer Recovery Specialist (CPRS)",
  description:
    "Certified Peer Recovery Specialist and Peer Parent Consultant with Tides Family Services, working with families navigating the child welfare and behavioral health system in Rhode Island.",
  worksFor: {
    "@type": "Organization",
    name: "Tides Family Services",
  },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "certification",
    name: "Certified Peer Recovery Specialist (CPRS)",
    recognizedBy: {
      "@type": "Organization",
      name: "Rhode Island Certification Board",
    },
  },
  alumniOf: {
    "@type": "Organization",
    name: "United States Army",
  },
  sameAs: [
    "https://www.linkedin.com/in/bobby-washburn/",
    "https://roughlyeducated.substack.com/",
  ],
};

export const metadata: Metadata = {
  title: {
    absolute: "About Bobby Washburn | Certified Peer Recovery Specialist",
  },
  description:
    "I'm a CPRS who works with parents in the middle of the hardest stretch of their family's life. Here's how I got here and what I actually do.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Bobby Washburn",
    description:
      "Peer support, lived experience, and the research — for parents who've tried everything.",
    type: "profile",
    url: "https://bobby-washburn.com/about",
  },
};

const phases = [
  {
    name: "Stabilize",
    line: "Nobody learns anything while their nervous system is in threat mode. Yours included. This comes first.",
  },
  {
    name: "Connect",
    line: "You can't discipline your way into a relationship. Connection is what makes everything after it work.",
  },
  {
    name: "Structure",
    line: "Once there's trust, structure holds. Routines, expectations, follow-through — the boring stuff that changes everything.",
  },
  {
    name: "Adapt",
    line: "Now you can handle the specific thing: the diagnosis, the school fight, the co-parenting, the teenager.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8 lg:py-16">
          {/* TODO: photo — authentic, not stock. Working, mid-conversation, or plain and
              direct. Not a studio headshot with folded arms. */}
          <div className="flex flex-col items-center gap-6 text-center">
            <PlaceholderPhoto
              alt="Photo of Bobby Washburn"
              className="h-32 w-32 rounded-full"
            />
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              About
            </p>
            {/* Alternate H1, if the line below reads too blunt on a first visit:
                "I've sat where you're sitting. That's the whole credential." */}
            <h1 className="font-heading text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              I&apos;m not here to fix you.
              <br />
              <span className="italic text-secondary">
                I&apos;m here because I&apos;ve been where you are.
              </span>
            </h1>
            <p className="max-w-xl text-base font-normal text-muted-foreground">
              My name is Bobby Washburn. I&apos;m a Certified Peer Recovery
              Specialist, which is a formal way of saying: I do this work as a
              peer, not a clinician. I sit with parents in the middle of the
              hardest stretch of their family&apos;s life — usually after
              they&apos;ve already tried everything the internet told them to
              try.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-12">
            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                Almost every parent I meet thinks they&apos;re the only one.
              </h2>
              <p className="text-base font-normal text-muted-foreground">
                They&apos;re not. That&apos;s usually the first thing I get to
                tell them, and it&apos;s usually the first time anyone has
                said it out loud.
              </p>
              <p className="text-base font-normal text-muted-foreground">
                By the time I show up, most parents have been through a lot
                of professionals. Therapists, caseworkers, school meetings,
                evaluations. And in almost every one of those rooms, the
                conversation is about their kid. Nobody has asked the parent
                how they&apos;re doing. Nobody has asked what they actually
                want their family to look like.
              </p>
              <p className="text-base font-normal text-muted-foreground">
                Here&apos;s what I&apos;ve found: if a parent can pick up a
                win or two — one real, concrete win — you can build on it.
                And once they find their own reason for doing the hard thing,
                the ceiling comes off. These are not broken people.
                They&apos;re people who lost the thread.
              </p>
              <p className="text-base font-normal text-muted-foreground">
                My job was never to fix anybody. It&apos;s to help parents
                see that change is actually possible — for them, for their
                kids, and for the pattern the whole family has been stuck in.
              </p>
              <blockquote className="rounded-lg border border-border bg-card px-6 py-6 text-center">
                <p className="font-heading text-lg font-medium italic tracking-tight sm:text-xl">
                  &ldquo;You&apos;re not failing. There&apos;s a reason this
                  feels impossible. And there&apos;s something you can do
                  about it.&rdquo;
                </p>
              </blockquote>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                The short version
              </h2>
              <p className="text-base font-normal text-muted-foreground">
                I spent five years in the Army as a signals intelligence
                analyst. I deployed to Afghanistan and led a team of
                soldiers. That work taught me how to stay calm when
                everything is on fire, how to read a situation fast, and how
                to train other people to do the same.
              </p>
              <p className="text-base font-normal text-muted-foreground">
                After the service I spent almost a decade in business —
                running operations for a marketing agency, managing the build
                of more than four hundred online courses in healthcare, and
                designing international travel programs. That stretch taught
                me how adults actually learn, and how to take something
                complicated and make it usable.
              </p>
              <p className="text-base font-normal text-muted-foreground">
                Then I moved into behavioral health, and it stopped being a
                career and started being the work.
              </p>
              <p className="text-base font-normal text-muted-foreground">
                I started as a behavioral health technician. I spent nearly
                two years as a youth care counselor at a residential program
                for teenage boys with serious trauma histories — managing
                crises, learning de-escalation the hard way, and figuring out
                that most &ldquo;defiance&rdquo; is a skill a kid doesn&apos;t
                have yet. Then I worked as a youth advocate, going into homes
                and communities instead of institutions.
              </p>
              {/* Tides mention: naming a current employer on a private-practice
                  site — confirm it's fine with them before launch. */}
              <p className="text-base font-normal text-muted-foreground">
                Since January 2025 I&apos;ve been a Peer Parent Consultant
                with Tides Family Services, embedded in an intensive
                wraparound team, working every week with families in the
                middle of the child welfare and behavioral health system.
              </p>

              <div className="rounded-lg border-2 border-dashed border-amber-300/60 bg-amber-50 px-6 py-5 dark:border-amber-800/60 dark:bg-amber-950/30">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-500">
                  Bobby — write this. Blocking: the page doesn&apos;t work
                  without it.
                </p>
                <p className="text-sm leading-relaxed text-foreground">
                  Two to five sentences, matter-of-fact, on what happened
                  that put you on this side of the table — not a confession,
                  not a trauma dump. What happened → what it cost → what
                  changed → why that makes you useful to the parent reading
                  this. Whatever you disclose here is permanent and public:
                  say only what you&apos;d be fine with a parent, a
                  supervisor, a licensing board, and your kids all reading.
                  Under-share and add more later if you want to.
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                There&apos;s an order to this.
              </h2>
              <p className="text-base font-normal text-muted-foreground">
                Over 2025 I built a full parenting curriculum — not in a
                classroom, but at kitchen tables. Every tool in it started as
                something I taught a real family, watched flop, reworked,
                and taught again until a parent could use it in the middle of
                a meltdown with no notes in front of them. It&apos;s
                twenty-nine modules now, and it&apos;s built on four phases
                that have to happen in order:
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {phases.map((phase) => (
                  <div
                    key={phase.name}
                    className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4"
                  >
                    <p className="font-heading text-sm font-medium tracking-tight">
                      {phase.name}
                    </p>
                    <p className="text-sm font-normal text-muted-foreground">
                      {phase.line}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-base font-normal text-muted-foreground">
                That sequence isn&apos;t a preference. It&apos;s the order
                your brain — and your child&apos;s — actually becomes capable
                of learning at each level. It&apos;s why so much parenting
                advice fails: it hands you a Structure tool when your family
                is still stuck at Stabilize.
              </p>
              <p className="text-base font-normal text-muted-foreground">
                Everything on this site is built from the same evidence base
                I use in the field — motivational interviewing,
                trauma-informed practice, the neuroscience of co-regulation,
                and DBT skills adapted for parents. Then translated into
                something you can read at 10pm on a Tuesday and use on
                Wednesday morning.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-lg font-medium tracking-tight text-muted-foreground">
                The formal part
              </h2>
              <div className="flex flex-col gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">
                    Certified Peer Recovery Specialist (CPRS)
                  </p>
                  <p>Rhode Island Certification Board · ID 202153</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Current role</p>
                  <p>
                    Peer Parent Consultant, Tides Family Services / Community
                    Care Alliance
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Training</p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Motivational Interviewing</li>
                    <li>
                      Youth Mental Health First Aid (national certification)
                    </li>
                    <li>Trauma-informed care</li>
                    <li>
                      Ethical Decision-Making for Peers (RICARES, 6.0 CEU)
                    </li>
                    <li>Educational advocacy — IEPs, 504 plans, IDEA</li>
                    <li>
                      Working with gender diverse and LGBTQ+ youth and
                      families
                    </li>
                    <li>Mandated reporter · CPR/First Aid</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground">Prior</p>
                  <p>
                    U.S. Army, Signals Intelligence Analyst (35N), Sergeant ·
                    Afghanistan. Honorable discharge, 2012.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Also</p>
                  <p>
                    Author, &ldquo;Consolidating Rhode Island&apos;s Child
                    Welfare Service Array&rdquo; — an independent policy
                    proposal submitted to Rhode Island state stakeholders,
                    March 2026.
                  </p>
                </div>
                {/* Bobby — confirm: list the URI psychology degree (in progress via
                    prior learning assessment) here? Left off for now — "in progress"
                    can read as a gap to a skeptical parent, and the CPRS + field
                    record is the stronger credential for this audience. Easy to add
                    if you disagree. */}
              </div>
            </section>

            <section className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card px-6 py-10 text-center">
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                If any of this sounds like your house, start here.
              </h2>
              <p className="max-w-xl text-base font-normal text-muted-foreground">
                An intro call is thirty minutes. You tell me what&apos;s
                going on. I tell you honestly whether I&apos;m the right kind
                of help — and if I&apos;m not, I&apos;ll point you toward
                what is. No pitch.
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
              <p className="max-w-xl text-sm font-normal text-muted-foreground">
                Peer support and parenting education — not therapy,
                diagnosis, or medical advice. If your family needs clinical
                care, I&apos;ll tell you that directly.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
