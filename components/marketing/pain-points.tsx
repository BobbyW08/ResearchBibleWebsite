import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PainPointCard from "@/components/marketing/pain-point-card";
import SwipeCarousel from "@/components/marketing/swipe-carousel";
import FadeInView from "@/components/marketing/fade-in-view";
import { getFeaturedPainPoints } from "@/lib/pain-points-reader";

async function PainPoints() {
  const featured = await getFeaturedPainPoints();

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
        <FadeInView className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 text-center">
          <Badge variant="outline" className="h-auto px-3 py-1 text-sm">
            Pain Points
          </Badge>
          <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
            Pick the one that sounds most like your week.
          </h2>
          <p className="text-base font-normal text-muted-foreground">
            You don&apos;t need to have the right words for it. Just find the
            situation that feels closest to what&apos;s happening at home —
            and start there.
          </p>
        </FadeInView>

        {/* Grid on md+ screens */}
        <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
          {featured.map((topic) => (
            <PainPointCard key={topic.slug} entry={topic} />
          ))}
        </div>

        {/* Swipeable carousel on small screens */}
        <SwipeCarousel
          className="mt-10 md:hidden"
          items={featured.map((topic) => (
            <PainPointCard key={topic.slug} entry={topic} />
          ))}
        />

        <div className="mt-10 flex justify-center">
          <Link
            href="/help"
            className="inline-flex items-center gap-1 text-sm font-medium text-secondary transition-all hover:gap-2"
          >
            See all pain points
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PainPoints;
