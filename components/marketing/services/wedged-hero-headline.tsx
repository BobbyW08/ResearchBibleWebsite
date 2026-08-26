"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import RotatingPathPhoto from "@/components/marketing/services/rotating-path-photo";

// Scroll-converge wedged-photo headline — v5 delta Section 3 fix: the two
// text halves and the photo are now driven off a single shared progress
// value (0-400px of page scroll from load), so they translate inward and
// scale up together, continuously, instead of animating independently. The
// previous element-relative offset ("start 0.9" / "start 0.35") had already
// fully elapsed by the time this hero (the first thing on the page) painted,
// so the headline rendered permanently in its "converged" end state with no
// visible motion at all — using raw page scroll instead of an element target
// fixes that regardless of where this section sits on the page.
function WedgedHeroHeadline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, [0, 400], [0, 1]);

  const leftX = useTransform(progress, [0, 1], [-72, 0]);
  const rightX = useTransform(progress, [0, 1], [72, 0]);
  // Final size lands close to a third of viewport width — bigger than the
  // bymonolog.com reference (roughly a fifth) per the v5 delta.
  const photoWidth = useTransform(progress, [0, 1], [8, 33]);
  const photoSize = useTransform(photoWidth, (v) => `clamp(2.5rem, ${v}vw, 28rem)`);

  return (
    <h1
      ref={ref}
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center font-heading text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:justify-start lg:text-left"
    >
      <motion.span style={{ x: leftX }}>We Build</motion.span>
      <motion.span style={{ width: photoSize, height: photoSize }} className="inline-block shrink-0">
        <RotatingPathPhoto alt="A path through nature" className="h-full w-full rounded-full" />
      </motion.span>
      <motion.span style={{ x: rightX }}>Your Path</motion.span>
    </h1>
  );
}

export default WedgedHeroHeadline;
