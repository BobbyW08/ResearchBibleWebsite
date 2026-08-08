import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import PlaceholderPhoto from "@/components/marketing/placeholder-photo";
import NewsletterDialog from "@/components/marketing/newsletter-dialog";
import { reader } from "@/lib/keystatic-reader";

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

export default async function AboutPage() {
  const about = await reader.singletons.about.read();

  if (!about) {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1" />
        <Footer />
      </div>
    );
  }

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
            <h1 className="font-heading text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              {about.heroLine1}
              <br />
              <span className="italic text-secondary">{about.heroLine2Italic}</span>
            </h1>
            <p className="max-w-xl text-base font-normal text-muted-foreground">
              {about.heroIntro}
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-12">
            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                {about.section1Heading}
              </h2>
              {about.section1Paragraphs.map((paragraph, index) => (
                <p key={index} className="text-base font-normal text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              <blockquote className="rounded-lg border border-border bg-card px-6 py-6 text-center">
                <p className="font-heading text-lg font-medium italic tracking-tight sm:text-xl">
                  &ldquo;{about.section1Quote}&rdquo;
                </p>
              </blockquote>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                {about.section2Heading}
              </h2>
              {about.section2Paragraphs.map((paragraph, index) => (
                <p key={index} className="text-base font-normal text-muted-foreground">
                  {paragraph}
                </p>
              ))}

              {about.personalDisclosure ? (
                <p className="text-base font-normal text-muted-foreground">
                  {about.personalDisclosure}
                </p>
              ) : (
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
                    Under-share and add more later if you want to. Edit this
                    in Keystatic under &ldquo;About Page&rdquo; → &ldquo;Personal
                    disclosure&rdquo;.
                  </p>
                </div>
              )}
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                {about.section3Heading}
              </h2>
              <p className="text-base font-normal text-muted-foreground">
                {about.section3Intro}
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {about.phases.map((phase) => (
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

              {about.section3Outro.map((paragraph, index) => (
                <p key={index} className="text-base font-normal text-muted-foreground">
                  {paragraph}
                </p>
              ))}
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
                  <p>{about.cprsId}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Current role</p>
                  <p>{about.currentRole}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Training</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {about.training.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground">Prior</p>
                  <p>{about.prior}</p>
                </div>
                {about.also && (
                  <div>
                    <p className="font-medium text-foreground">Also</p>
                    <p>{about.also}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card px-6 py-10 text-center">
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                {about.ctaHeading}
              </h2>
              <p className="max-w-xl text-base font-normal text-muted-foreground">
                {about.ctaBody}
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
                {about.ctaFooterNote}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
