import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import PlaceholderPhoto from "@/components/marketing/placeholder-photo";

export const metadata: Metadata = {
  title: "About Bobby Washburn",
  description:
    "[Bobby Washburn] is a [credential] specializing in evidence-based parenting support for neurodivergent and twice-exceptional children. Learn about the platform and the approach behind it.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8 lg:py-16">
          <div className="flex flex-col items-center gap-6 text-center">
            <PlaceholderPhoto
              alt="Photo of Bobby Washburn"
              className="h-32 w-32 rounded-full"
            />
            <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              About Bobby Washburn
            </h1>
          </div>

          <div className="mt-12 flex flex-col gap-12">
            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                Why this exists
              </h2>
              <p className="text-base font-normal text-muted-foreground">
                Most parenting advice lives in one of two places: too simple
                to actually help, or too clinical to actually use.
              </p>
              <p className="text-base font-normal text-muted-foreground">
                The research on ADHD, anxiety, and neurodivergence is good.
                There are decades of peer-reviewed studies on what works, why
                it works, and for which kids. The problem is that research
                lives behind paywalls, in academic journals, or gets
                filtered through a chain of interpretation until the
                original meaning is lost.
              </p>
              <p className="text-base font-normal text-muted-foreground">
                [Bobby Washburn] built this platform to close that gap.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                Background
              </h2>
              <p className="text-base font-normal text-muted-foreground">
                [FILL IN — Bobby, write this section yourself. Suggested
                structure:]
              </p>
              <ul className="list-disc space-y-2 pl-5 text-base font-normal text-muted-foreground">
                <li>
                  Your credential(s): [e.g. CPRS, licensed counselor,
                  degree, relevant training]
                </li>
                <li>
                  How long you&apos;ve been doing this work and in what
                  capacity [e.g. &ldquo;I&apos;ve spent eight years working
                  with parents in clinical and community settings...&rdquo;]
                </li>
                <li>
                  Your personal connection to the material, if you have one
                  [e.g. a child of your own, a professional turning point, a
                  family you worked with who changed how you saw this]
                </li>
                <li>
                  One concrete thing you believe that most parenting advice
                  gets wrong
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                The approach
              </h2>
              <p className="text-base font-normal text-muted-foreground">
                Every guide on this platform starts from the peer-reviewed
                research — not anecdote, not opinion, not one clinician&apos;s
                protocol. It goes through a structured review and translation
                process: mechanism-level accuracy first, plain language
                second, practical examples third.
              </p>
              <p className="text-base font-normal text-muted-foreground">
                What that means in practice:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-base font-normal text-muted-foreground">
                <li>Strategies are explained at the brain level, not just described</li>
                <li>Every claim traces back to a source</li>
                <li>
                  Content is written at an 8th-grade reading level without
                  sacrificing accuracy
                </li>
                <li>
                  Examples are drawn from real family situations — morning
                  routines, homework, after-school meltdowns, IEP meetings
                </li>
              </ul>
              <p className="text-base font-normal text-muted-foreground">
                This isn&apos;t &ldquo;here&apos;s what worked for us.&rdquo;
                It&apos;s &ldquo;here&apos;s what the research says works,
                and why.&rdquo;
              </p>
            </section>

            <section className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card px-6 py-10 text-center">
              <h2 className="font-heading text-2xl font-medium tracking-tight">
                Ready to start?
              </h2>
              <p className="max-w-xl text-base font-normal text-muted-foreground">
                The ADHD guide is free. It&apos;s the most complete
                plain-language resource I know of on ADHD in children and
                teens — built from the same research bibles used in clinical
                training.
              </p>
              <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
                <Link href="/docs/adhd" className={buttonVariants({ size: "lg" })}>
                  Read the Free ADHD Guide →
                </Link>
                <Link
                  href="https://cal.com/bobby-washburn/intro-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ size: "lg", variant: "outline" })}
                >
                  Book a 30-minute call →
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
