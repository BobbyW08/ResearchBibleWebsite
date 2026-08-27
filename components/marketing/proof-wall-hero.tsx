"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export type Testimonial = { quote: string; attribution: string };

type CardLayout = { side: "left" | "right"; align: "top" | "middle" | "bottom"; rotate: number; depth: number };

// Cards live in their own grid column on each side of a fixed-width center
// column (see the lg:grid wrapper below) so they can never overlap the
// headline text, at any viewport — homepage-redesign-v5.md Section 1 bug fix.
// Desktop/tablet only — see the mobile fallback list further down.
const CARD_LAYOUT: CardLayout[] = [
  { side: "left", align: "top", rotate: -10, depth: 16 },
  { side: "right", align: "top", rotate: 8, depth: -14 },
  { side: "right", align: "bottom", rotate: -7, depth: -18 },
  { side: "left", align: "bottom", rotate: 6, depth: 12 },
];

// Fills the open space above the headline (between the nav and the headline
// text) — a fifth testimonial pulled out of the side columns.
const TOP_CENTER_LAYOUT = { rotate: 5, depth: 10 };

function TapeAccent() {
  return (
    <span
      aria-hidden
      className="absolute -top-2.5 left-1/2 h-4 w-12 -translate-x-1/2 -rotate-2 bg-primary"
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
}: {
  testimonial: Testimonial;
  layout: CardLayout;
  pointerX: ReturnType<typeof useMotionValue<number>>;
  pointerY: ReturnType<typeof useMotionValue<number>>;
}) {
  const parallaxX = useTransform(pointerX, [-1, 1], [-layout.depth, layout.depth]);
  const parallaxY = useTransform(pointerY, [-1, 1], [-layout.depth / 1.5, layout.depth / 1.5]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: layout.side === "left" ? 160 : -160 }}
      whileInView={{ opacity: 1, scale: 1, x: 0 }}
      whileHover={{ scale: 1.22, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ y: parallaxY, rotate: layout.rotate }}
      className={`absolute z-0 w-56 cursor-default rounded-none bg-brand-offwhite p-7 shadow-2xl transition-shadow duration-300 hover:z-30 hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)] xl:w-64 ${ALIGN_CLASS[layout.align]} ${layout.side === "left" ? "left-0" : "right-0"}`}
    >
      <motion.div style={{ x: parallaxX }}>
        <TapeAccent />
        <p className="text-center font-quote text-2xl leading-snug text-brand-black">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <p className="mt-4 text-center text-sm font-medium uppercase tracking-wide text-brand-black/80">
          {testimonial.attribution}
        </p>
      </motion.div>
    </motion.div>
  );
}

// Fills the open space above the headline, between the nav and the headline
// text — not part of either side column, so it's positioned relative to the
// full hero content area rather than a column.
function TopCenterCard({
  testimonial,
  pointerX,
  pointerY,
}: {
  testimonial: Testimonial;
  pointerX: ReturnType<typeof useMotionValue<number>>;
  pointerY: ReturnType<typeof useMotionValue<number>>;
}) {
  const parallaxX = useTransform(pointerX, [-1, 1], [-TOP_CENTER_LAYOUT.depth, TOP_CENTER_LAYOUT.depth]);
  const parallaxY = useTransform(pointerY, [-1, 1], [-TOP_CENTER_LAYOUT.depth / 1.5, TOP_CENTER_LAYOUT.depth / 1.5]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 200 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.22, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ x: parallaxX, rotate: TOP_CENTER_LAYOUT.rotate }}
      className="pointer-events-auto w-56 cursor-default rounded-none bg-brand-offwhite p-7 shadow-2xl transition-shadow duration-300 hover:z-30 hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)] xl:w-64"
    >
      <motion.div style={{ y: parallaxY }}>
        <TapeAccent />
        <p className="text-center font-quote text-2xl leading-snug text-brand-black">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <p className="mt-4 text-center text-sm font-medium uppercase tracking-wide text-brand-black/80">
          {testimonial.attribution}
        </p>
      </motion.div>
    </motion.div>
  );
}

// CTA button — hard offset red shadow, sharp corners, that tucks flush into
// the button on hover (a "pressed in" effect) rather than a color inversion.
function HeroCTA() {
  return (
    <Link
      href="https://cal.com/bobby-washburn/intro-call"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 rounded-sm bg-brand-offwhite px-10 py-5 text-base font-semibold uppercase tracking-wide text-brand-black shadow-[6px_6px_0_0_var(--primary)] transition-all duration-200 hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-[0px_0px_0_0_var(--primary)]"
    >
      Tell Me What&apos;s Happening
      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

// Central statement — a big two-tone headline ("hard" in the accent red), a
// smaller regular-weight subhead, and a closing supporting line above the
// CTA. Shared between the desktop (cards-overlay) and mobile layouts. Each
// headline sentence stays on its own single line (no internal wrap) from
// lg up, where the widened hero has room for it.
function HeroStatement() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="text-center font-title text-4xl font-extrabold leading-tight tracking-tight text-brand-offwhite sm:text-5xl md:text-6xl lg:whitespace-nowrap lg:text-6xl xl:text-7xl"
      >
        Parenting is <span className="text-primary">hard</span> for everyone.
        <br />
        We shouldn&apos;t do it alone.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="max-w-2xl text-center text-lg font-normal leading-relaxed text-brand-offwhite/85 md:text-xl"
      >
        You&apos;ve got more parenting advice than you know what to do with.
        You don&apos;t need more information. You need someone to help you
        use it.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        className="max-w-xl text-center font-quote text-xl leading-snug text-brand-offwhite/70 md:text-2xl"
      >
        Father. Husband. Army veteran. Lived experience on every side of the
        system.
      </motion.p>
    </>
  );
}

// Mobile/tablet testimonial carousel — replaces the old static vertical stack
// (the absolute-tilted desktop layout is lg+ only, see CARD_LAYOUT above).
// Horizontal, native scroll-snap so it's a real touch swipe with no library,
// plus a slow auto-advance that steps to the next card every few seconds.
// Auto-advance always re-derives "current card" from actual scroll position
// (rather than trusting a stale index) so it resumes from wherever the user
// last swiped to, and pauses while a finger/pointer is down on the strip.
function MobileTestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || testimonials.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      if (pausedRef.current) return;
      const cards = Array.from(el.children) as HTMLElement[];
      if (!cards.length) return;
      const current = cards.reduce(
        (closest, card, index) => {
          const diff = Math.abs(card.offsetLeft - el.scrollLeft);
          return diff < closest.diff ? { index, diff } : closest;
        },
        { index: 0, diff: Infinity },
      ).index;
      const next = cards[(current + 1) % cards.length];
      next.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }, 4000);

    return () => clearInterval(id);
  }, [testimonials.length]);

  const pause = () => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };
  const scheduleResume = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 3500);
  };

  return (
    <div
      ref={scrollerRef}
      onPointerDown={pause}
      onPointerUp={scheduleResume}
      onPointerCancel={scheduleResume}
      onTouchStart={pause}
      onTouchEnd={scheduleResume}
      className="mt-10 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-[9%] pb-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className={`relative w-[82%] shrink-0 snap-center rounded-none bg-brand-offwhite p-6 shadow-lg ${index % 2 === 0 ? "-rotate-1" : "rotate-1"}`}
        >
          <TapeAccent />
          <p className="text-center font-quote text-xl leading-snug text-brand-black">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <p className="mt-3 text-center text-xs font-medium uppercase tracking-wide text-brand-black/80">
            {testimonial.attribution}
          </p>
        </div>
      ))}
    </div>
  );
}

function ProofWallHero({ testimonials }: { testimonials: Testimonial[] }) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 60, damping: 20 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 60, damping: 20 });

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
    <section onPointerMove={handlePointerMove} className="relative overflow-hidden bg-brand-black">
      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-[110rem] flex-col items-center justify-center px-6 py-16 sm:py-20 lg:px-12">
        {/* Fills the open space above the headline, between the nav and the
            headline text — floats above the grid below rather than living in
            either side column. Sits well clear of the headline below it. */}
        {topCenterTestimonial && (
          <div className="pointer-events-none absolute inset-x-0 top-8 z-0 hidden justify-center lg:flex xl:top-12">
            <TopCenterCard
              testimonial={topCenterTestimonial}
              pointerX={smoothPointerX}
              pointerY={smoothPointerY}
            />
          </div>
        )}

        {/* Cards live in their own grid column on each side of a fixed-width
            center column, so they can never overlap the headline text at any
            viewport. */}
        <div className="relative hidden w-full lg:grid lg:grid-cols-[1fr_minmax(0,68rem)_1fr] lg:items-center lg:gap-6 lg:min-h-[560px] xl:min-h-[620px]">
          <div className="relative hidden h-full lg:block">
            {leftCards.map(({ layout, testimonial }, index) => (
              <ProofWallCard
                key={index}
                testimonial={testimonial}
                layout={layout}
                pointerX={smoothPointerX}
                pointerY={smoothPointerY}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center gap-4 px-2 pt-20 xl:pt-24">
            <HeroStatement />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
              className="mt-2"
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          >
            <HeroCTA />
          </motion.div>
        </div>

        {/* Mobile/tablet fallback — the absolute-tilted layout above is lg+ only. */}
        <MobileTestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  );
}

export default ProofWallHero;
