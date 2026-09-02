"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const HEADLINE_CLASS = "font-subtitle font-bold";

// Full rebuild, per Bobby's own scroll-by-scroll spec (bymonolog.com as the
// reference for "pin the section, converge over the visual, then release"):
//
// - The WHOLE hero — eyebrow/headline/paragraph, the video, "We Build" /
//   "Your Path", and the "Together" reveal — lives inside one pinned
//   (`sticky`) panel so the page visually never jumps. Instead of the
//   viewport appearing to scroll up, a tall spacer beneath the sticky panel
//   is what "moves" — the dark field just keeps extending downward as you
//   scroll through it, and the actual page content (the closing paragraph +
//   CTA, rendered by the caller after this component) only appears once the
//   pin releases at the end.
// - "We Build" sits fixed at the top of the video frame the entire time —
//   it never animates. "Your Path" is the one that moves: it starts pulled
//   up near "We Build" and slides DOWN into its resting spot at the bottom
//   of the frame as you scroll, so the motion reads as walking forward
//   down the path (things receding away/below you), not two words sliding
//   toward each other from a static hold.
// - Once that's settled, a beat of dead scroll, then "Together" (Caveat,
//   brand red) fades and scales up from behind the composition. Once it's
//   at full size the spacer's scroll distance is exhausted and normal
//   scrolling resumes.
const PHASES = {
  convergeEnd: 0.55,
  togetherStart: 0.65,
  togetherEnd: 0.75,
};

function PathsHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // "We Build" slides in from the left, "Your Path" from the right, on the
  // same progress range so they meet at the horizontal center at the same
  // moment. Neither ever moves vertically. Percentages are relative to
  // each span's own width, so the entrance distance scales with the text
  // itself rather than a fixed px/vw amount, and the overlay row's own
  // `overflow-hidden` (below) clips the off-position starting point so it
  // never introduces horizontal page overflow.
  const weBuildX = useTransform(progress, [0, PHASES.convergeEnd], ["-140%", "0%"]);
  const yourPathX = useTransform(progress, [0, PHASES.convergeEnd], ["140%", "0%"]);
  // A small, deliberate shrink once things are settled — "a few sizes,
  // nothing drastic" — not a shrink back toward the opening size.
  const videoScale = useTransform(
    progress,
    [0, PHASES.convergeEnd, PHASES.togetherStart],
    [1, 1, 0.88],
  );
  const togetherOpacity = useTransform(
    progress,
    [PHASES.togetherStart, PHASES.togetherEnd],
    [0, 1],
  );
  const togetherY = useTransform(progress, [PHASES.togetherStart, PHASES.togetherEnd], [28, 0]);
  const togetherScale = useTransform(progress, [PHASES.togetherStart, PHASES.togetherEnd], [0.75, 1]);

  // Once "Together" finishes growing in, it locks permanently on screen —
  // not just "sticky until the pin releases." `locked` never resets to
  // false (no reset path), so scrolling back up afterward doesn't undo it
  // either. The in-flow animated instance below fades to opacity 0 (but
  // keeps its layout space, so nothing jumps) and a second instance takes
  // over, portaled straight to document.body (createPortal) so it's
  // structurally guaranteed to be a direct child of <body> — it can never
  // end up nested inside a transformed/filtered ancestor (this component's
  // own animated video wrapper, or anything added later) that would turn
  // its `fixed` positioning into something relative to that ancestor's box
  // instead of the real viewport. Its `top` is captured, once, from the
  // animated instance's own getBoundingClientRect() at the exact moment it
  // locks — pixel-exact continuity from the animated position, rather than
  // a guessed Tailwind bottom-* offset that only approximately matched it.
  // togetherRef/lockedRef are refs (not state) so the one-time capture in
  // this scroll-driven callback always reads current values, never a stale
  // closure.
  const togetherRef = useRef<HTMLParagraphElement>(null);
  const lockedRef = useRef(false);
  const [locked, setLocked] = useState(false);
  const [lockedTop, setLockedTop] = useState<number | null>(null);
  useMotionValueEvent(togetherOpacity, "change", (value) => {
    if (value >= 1 && !lockedRef.current) {
      lockedRef.current = true;
      setLockedTop(togetherRef.current?.getBoundingClientRect().top ?? null);
      setLocked(true);
    }
  });

  return (
    <div ref={containerRef} className="relative h-[340vh] bg-brand-black">
      <div className="sticky top-0 flex h-dvh flex-col items-center overflow-hidden px-4 pt-24 pb-6 sm:px-8 sm:pt-28">
        {/* Stationary intro copy — never animates, stays put and readable
            the entire time the section below it is converging. */}
        <div className="mx-auto max-w-2xl shrink-0 text-center">
          <p className="font-subtitle text-xs font-semibold uppercase tracking-[0.25em] text-brand-red-bright sm:text-sm">
            For Parents
          </p>
          <p className="mt-4 font-heading text-2xl font-semibold tracking-tight text-brand-offwhite sm:text-3xl lg:text-4xl">
            By the time most families find their way to me, they&apos;re already
            lost in the woods.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm font-normal leading-relaxed text-brand-offwhite/75 sm:text-base lg:text-lg">
            Some days you can just make out a path through the trees. Other
            days they&apos;re too dense to see two feet in front of you. Either
            way, you don&apos;t have to find your own way through it alone.
          </p>
        </div>

        {/* Video + converging headline. Sized by AVAILABLE HEIGHT (flex-1 +
            h-full on the box, min-h-0 on this wrapper so it's actually
            allowed to shrink) rather than a fixed vw/rem size — on a short
            phone viewport a fixed size pushed content below the fold;
            letting flexbox hand it whatever vertical room is left after the
            intro copy and the "Together" slot means it always fits, on any
            screen height. The caps are generous (44rem / 94vw) so the frame
            reads as genuinely large on real screens, not just filling
            leftover space. Gradient scrims top/bottom keep the off-white
            text legible regardless of what the video is showing. The
            headline overlay is a sibling of the video box, not a child of
            it, so its horizontal slide-in isn't clipped by the video's own
            rounded-corner `overflow-hidden` — it travels (and visually
            overlaps) across the wider shared wrapper instead. */}
        <div className="flex w-full min-h-0 flex-1 items-center justify-center py-4">
          <div className="relative flex h-full w-full max-w-4xl items-center justify-center">
            <motion.div
              aria-hidden
              style={{ scale: videoScale }}
              className="relative aspect-[3/4] h-full max-h-[44rem] max-w-[94vw] overflow-hidden rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
            >
              <video
                src="/videos/paths-loop.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/60"
              />
            </motion.div>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center overflow-hidden px-2"
            >
              <motion.span
                data-role="we-build"
                style={{ x: weBuildX }}
                className={`whitespace-nowrap pr-[0.2em] text-right text-2xl leading-[0.95] tracking-tight text-brand-offwhite drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-3xl md:text-4xl lg:text-5xl ${HEADLINE_CLASS}`}
              >
                We Build
              </motion.span>
              <motion.span
                data-role="your-path"
                style={{ x: yourPathX }}
                className={`whitespace-nowrap pl-[0.2em] text-left text-2xl leading-[0.95] tracking-tight text-brand-offwhite drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-3xl md:text-4xl lg:text-5xl ${HEADLINE_CLASS}`}
              >
                Your Path
              </motion.span>
            </div>
          </div>
        </div>

        {/* "Together" — fades and scales up from behind the composition
            once "We Build"/"Your Path" have settled. Reserves its own
            space below the video the whole time so nothing reflows when it
            appears; only opacity/transform animate. */}
        <div aria-hidden className="-mt-6 flex h-20 shrink-0 items-center justify-center sm:-mt-8 sm:h-28 lg:-mt-10 lg:h-32">
          <motion.p
            ref={togetherRef}
            data-role="together"
            style={{ opacity: locked ? 0 : togetherOpacity, y: togetherY, scale: togetherScale }}
            className="font-quote text-7xl font-bold text-brand-red-bright sm:text-8xl lg:text-9xl"
          >
            Together
          </motion.p>
        </div>
      </div>

      {/* Locked-in-place instance — renders once `locked` flips true (see
          above) and stays mounted for the rest of the page's scroll.
          Portaled to document.body (not just `fixed` in place here) so no
          ancestor of this component can ever turn its fixed positioning
          into something relative to itself; anchored via an inline `top`
          captured pixel-for-pixel from the animated instance's position at
          lock time, not a guessed breakpoint offset, so the swap is
          seamless and, since `top` doesn't depend on the viewport's bottom
          edge, robust to mobile browsers resizing the visual viewport as
          their toolbar collapses/expands during scroll. z-40 keeps it under
          the header (z-50) but above normal page content; pointer-events-none
          so it never blocks clicks on the CTA/content underneath it. */}
      {locked &&
        lockedTop !== null &&
        createPortal(
          <p
            aria-hidden
            data-role="together-locked"
            style={{ top: lockedTop }}
            className="pointer-events-none fixed inset-x-0 z-40 text-center font-quote text-7xl font-bold text-brand-red-bright sm:text-8xl lg:text-9xl"
          >
            Together
          </p>,
          document.body,
        )}
    </div>
  );
}

// Closing paragraph + CTA — rendered by the caller once the pin above
// releases, still on the same dark field (the field is one continuous
// bg-brand-black across both this component and PathsHeroSection, so it
// reads as one section, not two stacked ones).
function PathsHeroClosing() {
  return (
    <div className="bg-brand-black px-4 pb-16 pt-4 text-center sm:px-8 sm:pb-20 lg:pb-28">
      <p className="mx-auto max-w-2xl text-lg font-normal leading-relaxed text-brand-offwhite/80 sm:text-xl">
        I don&apos;t hand you a map and walk away. We figure out the changes you
        actually want to make, then build the path together, one real step at
        a time — forward, sideways, sometimes one step back. As long as
        we&apos;re still moving in the direction you want to go, that counts as
        progress.
      </p>
      <div className="mt-8">
        <Link
          href="https://cal.com/bobby-washburn/intro-call"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Book an intro call →
        </Link>
      </div>
    </div>
  );
}

function WedgedHeroHeadline() {
  return (
    <>
      {/* The real page heading — present once, regardless of scroll
          position. "We Build" / "Your Path" / "Together" above are purely
          visual (see PathsHeroSection's own aria-hidden usage). */}
      <h1 className="sr-only">We Build Your Path Together</h1>
      <PathsHeroSection />
      <PathsHeroClosing />
    </>
  );
}

export default WedgedHeroHeadline;
