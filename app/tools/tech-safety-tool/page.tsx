import type { Metadata } from "next";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { TechSafetyToolGuide } from "@/components/marketing/tools/tech-safety-tool/tech-safety-tool-guide";

export const metadata: Metadata = {
  title: "Tech Safety & Consequence Setup Guide",
  description:
    "Step-by-step parental controls for every device your child uses. Tell us your setup, and this guide builds itself around your family.",
};

export default function TechSafetyToolPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 lg:py-16 print:max-w-none print:px-0 print:py-0">
          <div className="relative mb-10 overflow-hidden rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-12 sm:py-14 print:hidden">
            <div className="relative z-10 max-w-2xl">
              <p className="mb-3.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
                <span className="h-px w-6 bg-primary-foreground/70" />
                Bobby Washburn Parenting Support
              </p>
              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Tech Safety &amp; Consequence Setup
              </h1>
              <p className="mt-3 text-base leading-relaxed text-primary-foreground/70">
                Step-by-step parental controls for every device your child uses. Tell us your setup, and
                this guide builds itself around your family.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-primary-foreground/50">
                <span>✓ Works on iPhone &amp; Android</span>
                <span>✓ 11 device types covered</span>
                <span>✓ Print &amp; hand out</span>
              </div>
            </div>
          </div>

          <TechSafetyToolGuide />

          <div className="mt-10 border-t border-border pt-4 text-center text-xs text-muted-foreground print:mt-6">
            <strong className="text-foreground">Bobby Washburn Parenting Support</strong> ·{" "}
            <a href="https://www.bobby-washburn.com" className="text-muted-foreground hover:underline">
              www.bobby-washburn.com
            </a>
            <br />
            This is an educational resource. Parental control interfaces update frequently — verify steps
            match your current software version. Not a substitute for professional mental health support
            when concerning patterns are present.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
