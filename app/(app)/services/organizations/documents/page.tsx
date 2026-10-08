import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Partner Documents",
  description:
    "Documents available to partner organizations, including capability statement, privacy policy, and scope information.",
  alternates: {
    canonical: "/services/organizations/documents",
  },
};

const PUBLIC_DOCUMENTS = [
  { title: "Capability Statement", available: false },
  { title: "Pilot Program One-Pager", available: false },
  { title: "Scope and Boundaries", available: false },
  { title: "Privacy Policy", available: true, href: "/privacy" },
  { title: "Nonclinical Disclaimer", available: false },
];

const REQUEST_DOCUMENTS = [
  "Certificate of Insurance",
  "W-9",
  "Sample Agreement",
  "References",
];

export default function PartnerDocumentsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:py-24">
            <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              Partner Documents
            </h1>
            <p className="mt-5 text-base font-normal text-muted-foreground">
              The documents below are available to partner organizations. Items marked
              &quot;available on request&quot; are not posted here because they contain tax or
              identifying information; ask for them after we&apos;ve been in contact.
            </p>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
            <h2 className="font-heading text-xl font-medium tracking-tight">
              Publicly posted
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {PUBLIC_DOCUMENTS.map((doc) => (
                <li key={doc.title} className="flex items-center gap-3 text-base">
                  {doc.available && doc.href ? (
                    <Link
                      href={doc.href}
                      className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      {doc.title}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">
                      {doc.title}{" "}
                      <span className="text-sm font-normal">(coming soon)</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
            <h2 className="font-heading text-xl font-medium tracking-tight">
              Available on request
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {REQUEST_DOCUMENTS.map((doc) => (
                <li key={doc} className="text-base text-muted-foreground">
                  {doc}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm font-normal text-muted-foreground">
              To request any of the items above, use the{" "}
              <Link
                href="/services/organizations#inquiry"
                className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
              >
                inquiry form
              </Link>{" "}
              on the organizations page.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
