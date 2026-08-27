"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import RotatingPathPhoto from "@/components/marketing/services/rotating-path-photo";

const TEXT_CLASS = "font-subtitle font-bold";

// --- Desktop / tablet (sm and up) --------------------------------------
//
// Unpinned — the convergence is simply tied to how far down the page you've
// scrolled (the first 500px), no scroll-jacking. Each two-word half starts
// flush against its own screen edge and the (still-cycling) path photo
// starts tiny between them; as you scroll, both halves slide in from the
// edges while the photo grows, landing as one tight, close-set line on a
// single row by the time the section is fully in view.
//
// "Flush against its own screen edge" is exact, not a guessed offset — it's
// the standard "break a centered flex child out to the viewport edge" CSS
// trick: translateX(calc(-50vw + 50%)). -50vw shifts the element's *center*
// (which sits at the viewport's horizontal center, since this row spans the
// full viewport width with nothing else beside it) to the viewport's left
// edge; +50% (a transform percentage is relative to the element's *own* box)
// then shifts it back right by half its own width, landing its left EDGE
// exactly on the viewport's left edge — for any word length, font size, or
// viewport width, with no measurement or per-breakpoint tuning required. The
// mirrored calc does the same for the right half against the right edge. A
// fixed pixel offset (an earlier version used ±72px) barely registers on a
// wide desktop viewport but is a huge fraction of a phone screen, which is
// part of why this treatment is desktop/tablet-only — see the mobile variant
// below for the phone-width equivalent.
function DesktopWedgedHeadline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, [0, 500], [0, 1]);

  const leftX = useTransform(progress, (p) => `calc(${-50 * (1 - p)}vw + ${50 * (1 - p)}%)`);
  const rightX = useTransform(progress, (p) => `calc(${50 * (1 - p)}vw - ${50 * (1 - p)}%)`);
  // Photo starts small (a coin-sized circle) and grows toward roughly a
  // third of viewport width at full convergence — clamped so it never
  // dominates a narrow tablet screen or balloons on an ultra-wide monitor.
  const photoWidth = useTransform(progress, [0, 1], [5, 30]);
  const photoSize = useTransform(photoWidth, (v) => `clamp(2rem, ${v}vw, 26rem)`);

  return (
    <div ref={ref} className="hidden w-full overflow-x-clip py-10 sm:block">
      {/* Not the page's <h1> — see the shared sr-only heading in
          WedgedHeroHeadline below, which stays in the DOM regardless of
          which of these two breakpoint-specific visual treatments is
          showing. */}
      <div
        aria-hidden
        className={`flex flex-row flex-wrap items-center justify-center gap-x-4 text-center leading-tight tracking-tight ${TEXT_CLASS} text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`}
      >
        <motion.span style={{ x: leftX }}>We Build</motion.span>
        <motion.span style={{ width: photoSize, height: photoSize }} className="inline-block shrink-0">
          <RotatingPathPhoto alt="A path through nature" className="h-full w-full rounded-full" />
        </motion.span>
        <motion.span style={{ x: rightX }}>Your Path</motion.span>
      </div>
    </div>
  );
}

// --- Mobile (below sm) — pinned scroll-jack ------------------------------
//
// Matches bymonolog.com's own mobile behavior rather than shrinking the
// desktop layout down: the section pins to the screen (sticky + a tall
// spacer) and "eats" the next stretch of scroll/swipe input to drive the
// convergence, releasing to normal page scroll once it completes — a real
// scroll-jack, not just a scroll-linked transform. "We Build" and "Your
// Path" render as two centered lines (not overlapping each other) with the
// growing photo between them; both lines start pushed toward the pinned
// screen's top/bottom edge and slide in together over the photo as the user
// scrolls, so it reads as one continuous swipe gesture, not three separate
// stacked rows (the desktop-style horizontal wedge has nowhere to go on a
// phone-width screen, which is what made a shrunk-down version of it feel
// cramped and reflow-prone).
//
// Progress is derived from the pin container's own scroll position (Motion's
// `useScroll({ target, offset: ["start start", "end end"] })`), not raw page
// scrollY — that maps 0→1 across exactly the container's pinned scroll
// distance (containerHeight − 100dvh, since the sticky child is one viewport
// tall), regardless of where this section lands on the page.
function MobilePinnedWedgedHeadline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Start well above/below their settled position — close to the pinned
  // viewport's own top/bottom edge — and animate to 0 (settled, centered)
  // as the pin plays out.
  const topLineY = useTransform(progress, [0, 1], ["-38vh", "0vh"]);
  const bottomLineY = useTransform(progress, [0, 1], ["38vh", "0vh"]);
  const photoWidth = useTransform(progress, [0, 1], [16, 46]);
  const photoSize = useTransform(photoWidth, (v) => `clamp(4rem, ${v}vw, 15rem)`);

  return (
    <div ref={containerRef} className="relative h-[220vh] sm:hidden">
      <div aria-hidden className="sticky top-0 flex h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-6">
        <motion.p style={{ y: topLineY }} className={`text-center text-4xl leading-tight tracking-tight ${TEXT_CLASS}`}>
          We Build
        </motion.p>
        <motion.span style={{ width: photoSize, height: photoSize }} className="inline-block shrink-0">
          <RotatingPathPhoto alt="A path through nature" className="h-full w-full rounded-full" />
        </motion.span>
        <motion.p
          style={{ y: bottomLineY }}
          className={`text-center text-4xl leading-tight tracking-tight ${TEXT_CLASS}`}
        >
          Your Path
        </motion.p>
      </div>
    </div>
  );
}

function WedgedHeroHeadline() {
  return (
    <>
      {/* The real page heading — present once regardless of breakpoint. Both
          variants below are purely visual/animated (aria-hidden), since
          neither is a plain static string a screen reader should read
          mid-animation. */}
      <h1 className="sr-only">We Build Your Path</h1>
      <MobilePinnedWedgedHeadline />
      <DesktopWedgedHeadline />
    </>
  );
}

export default WedgedHeroHeadline;
