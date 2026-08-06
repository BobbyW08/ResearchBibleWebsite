import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { getPainPoint, painPoints } from "@/lib/pain-points";

type HelpPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return painPoints.map((painPoint) => ({ slug: painPoint.slug }));
}

export async function generateMetadata({
  params,
}: HelpPageProps): Promise<Metadata> {
  const { slug } = await params;
  const painPoint = getPainPoint(slug);
  if (!painPoint) return {};

  return {
    title: painPoint.title,
    description: painPoint.body,
  };
}

export default async function HelpPage({ params }: HelpPageProps) {
  const { slug } = await params;
  const painPoint = getPainPoint(slug);

  if (!painPoint) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-8 lg:py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm font-medium text-secondary">{painPoint.label}</p>
            <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              {painPoint.title}
            </h1>
            <p className="text-base font-normal text-muted-foreground">
              {painPoint.body}
            </p>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-lg border border-border bg-card px-6 py-10 text-center">
            <h2 className="font-heading text-xl font-medium">
              This guide is still being written
            </h2>
            <p className="max-w-xl text-base font-normal text-muted-foreground">
              The full breakdown for this pain point isn&apos;t live yet. In
              the meantime, book a call and we&apos;ll talk through exactly
              what&apos;s happening — no need to wait for the guide.
            </p>
            <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
              <Link
                href="https://cal.com/bobby-washburn/1on1"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ size: "lg" })}
              >
                Book a Call with Bobby
              </Link>
              <Link
                href="/help"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                See all pain points
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
