"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import PainPointCard from "@/components/marketing/pain-point-card";
import SwipeCarousel from "@/components/marketing/swipe-carousel";
import { painPoints } from "@/lib/pain-points";

function PainPoints() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 text-center"
        >
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
        </motion.div>

        {/* Grid on md+ screens */}
        <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
          {painPoints.map((painPoint) => (
            <PainPointCard key={painPoint.slug} {...painPoint} />
          ))}
        </div>

        {/* Swipeable carousel on small screens */}
        <SwipeCarousel
          className="mt-10 md:hidden"
          items={painPoints.map((painPoint) => (
            <PainPointCard key={painPoint.slug} {...painPoint} />
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
