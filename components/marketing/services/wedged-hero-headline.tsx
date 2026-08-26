"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import PlaceholderPhoto from "@/components/marketing/placeholder-photo";

// Scroll-converge wedged-photo headline — services-parents-page-v1.md Section 1:
// on scroll into the hero, the two text halves start pulled toward the
// viewport edges with the photo small and centered between them, then
// converge into one tight line (photo growing) by the time the section is
// fully in view. Same scroll-linked-transform technique as the homepage logo
// shrink (components/marketing/proof-wall-hero.tsx), not a fixed entrance.
function WedgedHeroHeadline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.35"],
  });

  const leftX = useTransform(scrollYProgress, [0, 1], [-72, 0]);
  const rightX = useTransform(scrollYProgress, [0, 1], [72, 0]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [0.45, 1]);
  const photoMargin = useTransform(scrollYProgress, [0, 1], [0.5, 0.75]);
  const photoMarginInline = useTransform(photoMargin, (v) => `${v}rem`);

  return (
    <h1
      ref={ref}
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center font-heading text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:justify-start lg:text-left"
    >
      <motion.span style={{ x: leftX }}>We Build</motion.span>
      <motion.span style={{ scale: photoScale, marginInline: photoMarginInline }}>
        <PlaceholderPhoto
          alt="Photo of Bobby Washburn"
          className="inline-flex h-10 w-10 translate-y-1.5 rounded-full align-middle sm:h-12 sm:w-12"
        />
      </motion.span>
      <motion.span style={{ x: rightX }}>Your Path</motion.span>
    </h1>
  );
}

export default WedgedHeroHeadline;
