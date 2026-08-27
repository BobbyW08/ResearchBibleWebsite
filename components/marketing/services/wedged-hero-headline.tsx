"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
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
  togetherStart: 0.7,
  togetherEnd: 0.88,
};

function PathsHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // "Your Path" starts pulled up near "We Build" and settles at the bottom
  // of the frame by the time convergence completes. Driven as a % of the
  // video box's OWN height (via `top`, not a vh/px `y` translate) — the box
  // is now sized purely by available flex space (see below), which varies
  // a lot by viewport height, and a fixed vh offset that was fine on a
  // tall phone was larger than a short phone's entire box, pushing the
  // text out through the top and off-screen entirely.
  const yourPathTop = useTransform(progress, [0, PHASES.convergeEnd], ["22%", "86%"]);
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

        {/* Video + converging headline — big, vertically rectangular, "We
            Build" / "Your Path" rendered on top of it rather than beside
            it. Sized by AVAILABLE HEIGHT (flex-1 + h-full on the box,
            min-h-0 on this wrapper so it's actually allowed to shrink)
            rather than a fixed vw/rem size — on a short phone viewport a
            fixed size pushed "Your Path" below the fold; letting flexbox
            hand it whatever vertical room is left after the intro copy and
            the "Together" slot means it always fits, on any screen height.
            Gradient scrims top/bottom keep the off-white text legible
            regardless of what the video is showing at that moment. */}
        <div className="flex w-full min-h-0 flex-1 items-center justify-center py-4">
          <motion.div
            aria-hidden
            style={{ scale: videoScale }}
            className="relative aspect-[3/4] h-full max-h-[34rem] max-w-[88vw] overflow-hidden rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
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
            <div className="relative h-full p-4 sm:p-6">
              <p
                data-role="we-build"
                className={`absolute inset-x-0 top-[12%] -translate-y-1/2 text-center text-2xl leading-[0.95] tracking-tight text-brand-offwhite drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-3xl md:text-4xl lg:text-5xl ${HEADLINE_CLASS}`}
              >
                We Build
              </p>
              <motion.p
                data-role="your-path"
                style={{ top: yourPathTop }}
                className={`absolute inset-x-0 -translate-y-1/2 text-center text-2xl leading-[0.95] tracking-tight text-brand-offwhite drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-3xl md:text-4xl lg:text-5xl ${HEADLINE_CLASS}`}
              >
                Your Path
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* "Together" — fades and scales up from behind the composition
            once "We Build"/"Your Path" have settled. Reserves its own
            space below the video the whole time so nothing reflows when it
            appears; only opacity/transform animate. */}
        <div aria-hidden className="mt-4 flex h-16 shrink-0 items-center justify-center sm:mt-6 sm:h-20 lg:h-24">
          <motion.p
            data-role="together"
            style={{ opacity: togetherOpacity, y: togetherY, scale: togetherScale }}
            className="font-quote text-5xl text-brand-red-bright sm:text-6xl lg:text-7xl"
          >
            Together
          </motion.p>
        </div>
      </div>
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
