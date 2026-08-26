"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Logo, { type LogoVariant } from "@/assets/logo/logo";

// homepage-redesign-v5.md Section 2: as the hero logo shrinks/moves toward
// the header slot on scroll, it cycles through the four provided icon color
// variants rather than staying static.
const LOGO_CYCLE: LogoVariant[] = ["gray", "white", "red", "gradient"];

export type Testimonial = { quote: string; attribution: string };

type CardLayout = { side: "left" | "right"; align: "top" | "middle" | "bottom"; rotate: number; depth: number };

// Cards live in their own grid column on each side of a fixed-width center
// column (see the lg:grid wrapper below) so they can never overlap the
// headline text, at any viewport — homepage-redesign-v5.md Section 1 bug fix.
// Desktop/tablet only — see the mobile fallback list further down.
// v5 delta: redistributed out of the former heavy left/right clustering —
// one card moved into the open top-center space above the headline, one into
// a new mid-right slot; left-top/right-top/right-bottom stay put.
const CARD_LAYOUT: CardLayout[] = [
  { side: "left", align: "top", rotate: -6, depth: 16 },
  { side: "right", align: "top", rotate: 5, depth: -14 },
  { side: "right", align: "bottom", rotate: -4, depth: -18 },
  { side: "right", align: "middle", rotate: -2, depth: 12 },
];

// Fills the open black space above the headline (between the nav and the
// headline text) — a fifth testimonial pulled out of the side columns.
const TOP_CENTER_LAYOUT = { rotate: 3, depth: 10 };

// Cards fly into their tilted positions together, in sync with the hero
// logo's scroll-linked shrink toward the header — not a fixed on-load
// entrance. Sharing one range across every card means they arrive as one
// coordinated group rather than staggering in individually, and it also
// means they're not yet in the logo's way while it's still large.
const CARD_ENTRANCE_RANGE: [number, number] = [0, 0.35];

function TapeAccent() {
  return (
    <span
      aria-hidden
      className="absolute -top-2.5 left-1/2 h-4 w-12 -translate-x-1/2 -rotate-2 bg-primary/80"
    />
  );
}

const ALIGN_CLASS: Record<CardLayout["align"], string> = {
  top: "top-0",
  middle: "top-1/2 -translate-y-1/2",
  bottom: "bottom-0",
};

function ProofWallCard({
  testimonial,
  layout,
  pointerX,
  pointerY,
  scrollYProgress,
}: {
  testimonial: Testimonial;
  layout: CardLayout;
  pointerX: ReturnType<typeof useMotionValue<number>>;
  pointerY: ReturnType<typeof useMotionValue<number>>;
  scrollYProgress: ReturnType<typeof useMotionValue<number>>;
}) {
  const parallaxX = useTransform(pointerX, [-1, 1], [-layout.depth, layout.depth]);
  const parallaxY = useTransform(pointerY, [-1, 1], [-layout.depth / 1.5, layout.depth / 1.5]);
  // Flies in from the center (where the logo still is) out to its resting
  // edge, arriving together with the logo's own shrink — see CARD_ENTRANCE_RANGE.
  const flyX = useTransform(scrollYProgress, CARD_ENTRANCE_RANGE, [layout.side === "left" ? 160 : -160, 0]);
  const opacity = useTransform(scrollYProgress, CARD_ENTRANCE_RANGE, [0, 1]);
  const scale = useTransform(scrollYProgress, CARD_ENTRANCE_RANGE, [0.85, 1]);
  const x = useTransform([parallaxX, flyX], ([p, f]: number[]) => p + f);

  return (
    <motion.div
      style={{ x, y: parallaxY, opacity, scale, rotate: layout.rotate }}
      className={`absolute z-0 w-56 rounded-none bg-brand-offwhite p-5 shadow-2xl xl:w-64 ${ALIGN_CLASS[layout.align]} ${layout.side === "left" ? "left-0" : "right-0"}`}
    >
      <TapeAccent />
      <p className="font-quote text-xl leading-snug text-brand-black">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-brand-black/60">
        {testimonial.attribution}
      </p>
    </motion.div>
  );
}

// Fills the open black space above the headline, between the nav and the
// headline text — v5 delta Section 2. Not part of either side column, so it's
// positioned relative to the full hero content area rather than a column.
function TopCenterCard({
  testimonial,
  pointerX,
  pointerY,
  scrollYProgress,
}: {
  testimonial: Testimonial;
  pointerX: ReturnType<typeof useMotionValue<number>>;
  pointerY: ReturnType<typeof useMotionValue<number>>;
  scrollYProgress: ReturnType<typeof useMotionValue<number>>;
}) {
  const parallaxX = useTransform(pointerX, [-1, 1], [-TOP_CENTER_LAYOUT.depth, TOP_CENTER_LAYOUT.depth]);
  const parallaxY = useTransform(pointerY, [-1, 1], [-TOP_CENTER_LAYOUT.depth / 1.5, TOP_CENTER_LAYOUT.depth / 1.5]);
  // Flies up into place from behind the headline, arriving together with the
  // logo's own shrink — see CARD_ENTRANCE_RANGE. Starting below its resting
  // spot (rather than static) is also what keeps it clear of the logo while
  // the logo is still large.
  const flyY = useTransform(scrollYProgress, CARD_ENTRANCE_RANGE, [200, 0]);
  const opacity = useTransform(scrollYProgress, CARD_ENTRANCE_RANGE, [0, 1]);
  const scale = useTransform(scrollYProgress, CARD_ENTRANCE_RANGE, [0.85, 1]);
  const y = useTransform([parallaxY, flyY], ([p, f]: number[]) => p + f);

  return (
    <motion.div
      style={{ x: parallaxX, y, opacity, scale, rotate: TOP_CENTER_LAYOUT.rotate }}
      className="pointer-events-auto w-56 rounded-none bg-brand-offwhite p-5 shadow-2xl xl:w-64"
    >
      <TapeAccent />
      <p className="font-quote text-xl leading-snug text-brand-black">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-brand-black/60">
        {testimonial.attribution}
      </p>
    </motion.div>
  );
}

// CTA button — restyled to match bymonolog.com per v5 delta Section 2: sharp
// corners, an arrow that nudges on hover, and a full color inversion instead
// of a simple opacity fade.
function HeroCTA() {
  return (
    <Link
      href="https://cal.com/bobby-washburn/intro-call"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 rounded-sm bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-colors duration-300 hover:bg-brand-offwhite hover:text-brand-black"
    >
      Tell Me What&apos;s Happening
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

// Central statement — per homepage-redesign-v5.md Sections 3-5: a big
// two-tone headline ("hard" in the accent red), a smaller regular-weight
// subhead, and a closing supporting line above the CTA. Shared between the
// desktop (cards-overlay) and mobile layouts.
function HeroStatement() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-2xl text-center font-title text-4xl font-extrabold leading-tight tracking-tight text-brand-offwhite sm:text-5xl md:text-6xl"
      >
        Parenting is <span className="text-primary">hard</span> for everyone.
        <br />
        We shouldn&apos;t do it alone.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="max-w-xl text-center text-base font-normal leading-relaxed text-brand-offwhite/85 md:text-lg"
      >
        You&apos;ve got more parenting advice than you know what to do with.
        You don&apos;t need more information. You need someone to help you
        use it.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        className="max-w-lg text-center font-quote text-lg leading-snug text-brand-offwhite/70 md:text-xl"
      >
        Father. Husband. Army veteran. Lived experience on every side of the
        system.
      </motion.p>
    </>
  );
}

function ProofWallHero({ testimonials }: { testimonials: Testimonial[] }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 60, damping: 20 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 60, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // Single coordinated scroll-linked transform (homepage-redesign-v5.md
  // Section 2): shrinks, moves toward the top-left header slot, and fades as
  // the user scrolls past the hero, handing off to the header's own landed
  // lockup (see header.tsx's logoAnimatesIn crossfade).
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.32]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const logoX = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.35, 0.55], [1, 1, 0]);

  // Cycles the shrinking logo through the color variants as it scrolls up,
  // rather than staying a single static color (homepage-redesign-v5.md).
  const logoCycleStage = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6],
    [0, 1, 2, 3],
  );
  const [logoVariant, setLogoVariant] = useState<LogoVariant>(LOGO_CYCLE[0]);
  useMotionValueEvent(logoCycleStage, "change", (value) => {
    const index = Math.min(LOGO_CYCLE.length - 1, Math.max(0, Math.round(value)));
    setLogoVariant(LOGO_CYCLE[index]);
  });

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  };

  const cards = CARD_LAYOUT.map((layout, index) => ({ layout, testimonial: testimonials[index] })).filter(
    (item): item is { layout: CardLayout; testimonial: Testimonial } => Boolean(item.testimonial),
  );
  const leftCards = cards.filter(({ layout }) => layout.side === "left");
  const rightCards = cards.filter(({ layout }) => layout.side === "right");
  const topCenterTestimonial = testimonials[CARD_LAYOUT.length];

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden bg-brand-black"
    >
      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl flex-col items-center justify-center px-4 py-16 sm:py-20">
        {/* Fills the open black space above the headline, between the nav and
            the headline text (v5 delta Section 2) — floats above the logo and
            grid below rather than living in either side column. */}
        {topCenterTestimonial && (
          <div className="pointer-events-none absolute inset-x-0 top-4 z-0 hidden justify-center lg:flex xl:top-8">
            <TopCenterCard
              testimonial={topCenterTestimonial}
              pointerX={smoothPointerX}
              pointerY={smoothPointerY}
              scrollYProgress={scrollYProgress}
            />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-14"
        >
          <motion.div style={{ scale: logoScale, x: logoX, y: logoY, opacity: logoOpacity }}>
            <Logo size="lg" onDark variant={logoVariant} lockup={false} />
          </motion.div>
        </motion.div>

        {/* Cards live in their own grid column on each side of a fixed-width
            center column, so they can never overlap the headline text at any
            viewport (homepage-redesign-v5.md Section 1 bug fix). */}
        <div className="relative hidden w-full max-w-6xl lg:grid lg:grid-cols-[1fr_minmax(0,42rem)_1fr] lg:items-center lg:gap-4 lg:min-h-[560px] xl:min-h-[620px]">
          <div className="relative hidden h-full lg:block">
            {leftCards.map(({ layout, testimonial }, index) => (
              <ProofWallCard
                key={index}
                testimonial={testimonial}
                layout={layout}
                pointerX={smoothPointerX}
                pointerY={smoothPointerY}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-2">
            <HeroStatement />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            >
              <HeroCTA />
            </motion.div>
          </div>

          <div className="relative hidden h-full lg:block">
            {rightCards.map(({ layout, testimonial }, index) => (
              <ProofWallCard
                key={index}
                testimonial={testimonial}
                layout={layout}
                pointerX={smoothPointerX}
                pointerY={smoothPointerY}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* Mobile/tablet: cards move below as a simple stack (see fallback list
            further down), so the statement + CTA render directly, unobstructed. */}
        <div className="flex w-full max-w-xl flex-col items-center gap-6 py-4 text-center lg:hidden">
          <HeroStatement />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          >
            <HeroCTA />
          </motion.div>
        </div>

        {/* Mobile/tablet fallback — the absolute-tilted layout above is lg+ only. */}
        <div className="mt-10 grid w-full max-w-md gap-4 lg:hidden">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative rounded-none bg-brand-offwhite p-5 shadow-lg ${index % 2 === 0 ? "-rotate-1" : "rotate-1"}`}
            >
              <TapeAccent />
              <p className="font-quote text-lg leading-snug text-brand-black">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-brand-black/60">
                {testimonial.attribution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProofWallHero;
