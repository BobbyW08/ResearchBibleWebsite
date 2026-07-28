"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import GuideCard, { type Guide } from "@/components/marketing/guide-card";
import SwipeCarousel from "@/components/marketing/swipe-carousel";

// All three link to /docs/adhd for now — the only deep-dive page built so
// far. Swap each href once its own .mdx page exists.
const guides: Guide[] = [
  {
    title: "Understanding ADHD",
    description:
      "What's really going on in your kid's brain, and simple ways to work with it instead of against it.",
    imageAlt:
      "Warm photo of a parent and child laughing together at the kitchen table while doing homework",
    href: "/docs/adhd",
  },
  {
    title: "Big Transitions, Big Feelings",
    description:
      "Moves, new siblings, school changes, divorce — how to help your kid through change without the meltdowns taking over.",
    imageAlt:
      "Photo of a parent kneeling down at eye level to comfort an upset child",
    href: "/docs/adhd",
  },
  {
    title: "Structure and Routines",
    description:
      "Why predictable routines calm your kid's brain, and how to build ones that actually stick in real life.",
    imageAlt:
      "Photo of a parent and child following a morning routine checklist together",
    href: "/docs/adhd",
  },
];

function Guides() {
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
            Guides
          </Badge>
          <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
            Pick where you want to start
          </h2>
          <p className="text-base font-normal text-muted-foreground">
            Every guide walks you through one challenge at a time. Choose the
            one that feels the most like your week right now.
          </p>
        </motion.div>

        {/* Grid on md+ screens */}
        <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
          {guides.map((guide) => (
            <GuideCard key={guide.title} {...guide} />
          ))}
        </div>

        {/* Swipeable carousel on small screens */}
        <SwipeCarousel
          className="mt-10 md:hidden"
          items={guides.map((guide) => (
            <GuideCard key={guide.title} {...guide} />
          ))}
        />
      </div>
    </section>
  );
}

export default Guides;
