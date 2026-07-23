import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

// Section placeholders — each will be replaced with a ShadcnSpace free block
// per the homepage map in CLAUDE.md.

function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 py-24 text-center sm:py-32">
      <h1 className="max-w-2xl text-3xl font-medium tracking-tight sm:text-5xl">
        Research Bible
      </h1>
      <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
        A parenting practice&apos;s home base — subscribe, book a call, and
        explore the research bible.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/docs" className={buttonVariants({ size: "lg" })}>
          Explore the research bible
        </Link>
        <Link
          href="#book-a-call"
          className={buttonVariants({ size: "lg", variant: "outline" })}
        >
          Book a call
        </Link>
      </div>
    </section>
  );
}

function PlaceholderSection({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <section
      id={id}
      className="border-t border-border px-6 py-16 text-center text-muted-foreground"
    >
      <p className="text-xs tracking-wide uppercase">{title}</p>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <PlaceholderSection id="about" title="About / who it's for" />
      <PlaceholderSection id="services" title="Services overview" />
      <PlaceholderSection id="testimonials" title="Credibility" />
      <PlaceholderSection id="subscribe" title="Subscribe" />
      <PlaceholderSection id="book-a-call" title="Book a call" />
      <PlaceholderSection id="faq" title="FAQ" />
      <PlaceholderSection id="footer" title="Footer" />
    </div>
  );
}
