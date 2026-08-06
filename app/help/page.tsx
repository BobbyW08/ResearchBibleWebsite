import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import PainPointCard from "@/components/marketing/pain-point-card";
import { painPoints } from "@/lib/pain-points";

export const metadata: Metadata = {
  title: "Pain Points",
  description:
    "Find the situation that feels closest to what's happening at home, and start there.",
};

export default function HelpIndexPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8 lg:py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              Pick the one that sounds most like your week.
            </h1>
            <p className="max-w-xl text-base font-normal text-muted-foreground">
              You don&apos;t need to have the right words for it. Just find
              the situation that feels closest to what&apos;s happening at
              home — and start there.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {painPoints.map((painPoint) => (
              <PainPointCard key={painPoint.slug} {...painPoint} />
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-card/60 px-6 py-10 text-center">
            <h2 className="font-heading text-xl font-medium">
              More pain points are on the way
            </h2>
            <p className="max-w-xl text-base font-normal text-muted-foreground">
              Not seeing your situation here yet? Book a call and we&apos;ll
              talk through it directly.
            </p>
            <Link
              href="https://cal.com/bobby-washburn/1on1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-secondary transition-all hover:gap-2"
            >
              Book a Call with Bobby
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
