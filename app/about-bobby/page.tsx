import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import PlaceholderPhoto from "@/components/marketing/placeholder-photo";
import { reader } from "@/lib/keystatic-reader";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bobby Washburn",
  url: "https://bobby-washburn.com/about-bobby",
  jobTitle: "Certified Peer Recovery Specialist (CPRS)",
  description:
    "Certified Peer Recovery Specialist and Peer Parent Consultant, working with families navigating the child welfare and behavioral health system in Rhode Island.",
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
    absolute: "About Bobby | Certified Peer Recovery Specialist",
  },
  description:
    "Peer support to help you handle this, and whatever's next. Here's how I got here and what I actually do.",
  alternates: {
    canonical: "/about-bobby",
  },
  openGraph: {
    title: "About Bobby",
    description: "Peer support to help you handle this, and whatever's next.",
    type: "profile",
    url: "https://bobby-washburn.com/about-bobby",
  },
};

const introCallCta = (
  <div className="flex flex-col items-center gap-2">
    <Link
      href="https://cal.com/bobby-washburn/intro-call"
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants({ size: "lg" })}
    >
      Book an intro call →
    </Link>
    <p className="text-sm font-normal text-muted-foreground">Free 30-min call. No pitch.</p>
  </div>
);

export default async function AboutBobbyPage() {
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
          <div className="flex flex-col items-center gap-6 text-center">
            {about.photo ? (
              <Image
                src={`/images/about/${about.photo}`}
                alt="Photo of Bobby Washburn"
                width={128}
                height={128}
                className="h-32 w-32 rounded-full object-cover"
              />
            ) : (
              <PlaceholderPhoto
                alt="Photo of Bobby Washburn"
                className="h-32 w-32 rounded-full"
              />
            )}
            <h1 className="font-heading text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              About Bobby
            </h1>
            <p className="max-w-xl text-base font-normal text-muted-foreground">
              {about.heroSubhead}
            </p>
            <p className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              {about.credentialBadge}
            </p>
            {introCallCta}
          </div>

          <div className="mt-12 flex flex-col gap-12">
            <section className="flex flex-col gap-4">
              {about.shortAboutParagraphs.map((paragraph, index) => (
                <p key={index} className="text-base font-normal text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              <div className="flex justify-center pt-2">{introCallCta}</div>
            </section>

            <section className="flex flex-col gap-4 border-t border-border pt-10">
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
