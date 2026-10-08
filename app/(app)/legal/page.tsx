import type { Metadata } from "next";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Legal & Disclaimers",
  description:
    "Business registration, credentials, insurance, and the scope and limits of peer support services offered by Bobby Washburn Parent Support, LLC.",
  alternates: {
    canonical: "/legal",
  },
};

const SECTIONS = [
  {
    heading: "Business and credentials",
    body: "Bobby Washburn Parent Support, LLC is a registered Rhode Island business. It carries general liability, professional liability, and cyber liability insurance. Bobby Washburn is a Certified Peer Recovery Specialist (CPRS), certified through the Rhode Island Certification Board, ID #202153.",
  },
  {
    heading: "This is peer support, not clinical care",
    body: "Services offered through this site and by Bobby Washburn Parent Support, LLC are peer support and parenting education. They are grounded in lived experience and a real evidence base, but they are not therapy, counseling, case management, medical treatment, or diagnosis. Nothing here is a substitute for care from a licensed clinician. If you need clinical treatment, ask, and you'll get help finding it.",
  },
  {
    heading: "No outcome is guaranteed",
    body: "Peer support can help you build skills, perspective, and a steadier footing, but no specific result or outcome is promised for any individual or family.",
  },
  {
    heading: "Confidentiality has limits",
    body: "What you share in sessions is treated as confidential, with the same limits that apply to any peer support or helping relationship. As a mandated reporter, Bobby is required by Rhode Island law to report suspected child abuse or neglect, and that applies to anyone he works with through this practice.",
  },
  {
    heading: "Not a crisis service",
    body: "This site and this practice are not a crisis service. If you or your child are in immediate danger, call 911 or the 988 Suicide and Crisis Lifeline.",
  },
];

export default function LegalPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8 lg:py-16">
          <h1 className="font-heading text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Legal &amp; Disclaimers
          </h1>
          <div className="mt-10 flex flex-col gap-8">
            {SECTIONS.map((section) => (
              <section key={section.heading} className="flex flex-col gap-2">
                <h2 className="font-heading text-lg font-medium tracking-tight text-foreground">
                  {section.heading}
                </h2>
                <p className="text-base font-normal text-muted-foreground">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
