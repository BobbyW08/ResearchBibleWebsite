"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Logo, { type LogoVariant } from "@/assets/logo/logo";

// homepage-redesign-v3.md's Logo Behavior: as the hero logo shrinks into the
// header on scroll, it cycles through the provided color variants rather than
// staying static, landing on White against the #111111 field once small.
const LOGO_CYCLE: LogoVariant[] = ["gradient", "red", "gray", "white"];

export type Testimonial = { quote: string; attribution: string };

type CardLayout = { position: string; rotate: number; depth: number };

// Loose ring of tilted "paper" cards around the central statement, per
// homepage-redesign-v3.md's Proof Wall spec. Desktop/tablet only — see the
// mobile fallback list further down.
const CARD_LAYOUT: CardLayout[] = [
  { position: "top-0 left-0 lg:-left-10 xl:-left-16", rotate: -6, depth: 16 },
  { position: "top-0 right-0 lg:-right-10 xl:-right-16", rotate: 5, depth: -14 },
  { position: "top-1/2 left-0 -translate-y-1/2 lg:-left-28 xl:-left-40", rotate: 4, depth: 20 },
  { position: "top-1/2 right-0 -translate-y-1/2 lg:-right-28 xl:-right-40", rotate: -4, depth: -18 },
  { position: "bottom-0 left-1/2 -translate-x-1/2", rotate: -2, depth: 12 },
];

function TapeAccent() {
  return (
    <span
      aria-hidden
      className="absolute -top-2.5 left-1/2 h-4 w-12 -translate-x-1/2 -rotate-2 bg-primary/80"
    />
  );
}

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
  const x = useTransform(pointerX, [-1, 1], [-layout.depth, layout.depth]);
  const y = useTransform(pointerY, [-1, 1], [-layout.depth / 1.5, layout.depth / 1.5]);

  return (
    <motion.div
      style={{ x, y, rotate: layout.rotate }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`absolute z-0 hidden w-64 rounded-none bg-brand-offwhite p-5 shadow-2xl xl:w-72 lg:block ${layout.position}`}
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

// Central statement — per homepage-redesign-v3.md Section 1: a big two-tone
// headline ("sucks" in the accent red), a smaller regular-weight subhead, and
// the former hero headline demoted to a still-smaller supporting line above
// the CTA. Shared between the desktop (cards-overlay) and mobile layouts.
function HeroStatement() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-2xl text-center font-title text-4xl font-extrabold leading-tight tracking-tight text-brand-offwhite sm:text-5xl md:text-6xl"
      >
        Parenting <span className="text-primary">sucks</span> right now.
        <br />
        It doesn&apos;t have to.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="max-w-xl text-center text-base font-normal leading-relaxed text-brand-offwhite/85 md:text-lg"
      >
        You&apos;ve got more parenting advice than you know what to do with. What
        you&apos;re missing isn&apos;t information — it&apos;s someone to help you
        actually use it.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        className="max-w-lg text-center font-quote text-lg leading-snug text-brand-offwhite/70 md:text-xl"
      >
        I&apos;ve been through hard things. I learned how to build a life
        through them. Now I help parents do the same.
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
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.32]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.35, 0.55], [1, 1, 0]);

  // Cycles the shrinking logo through the color variants as it scrolls up,
  // rather than staying a single static color (homepage-redesign-v3.md).
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

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden bg-brand-black"
    >
      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl flex-col items-center justify-center px-4 py-16 sm:py-20">
        <motion.div style={{ scale: logoScale, y: logoY, opacity: logoOpacity }} className="mb-10 sm:mb-14">
          <Logo size="lg" onDark variant={logoVariant} />
        </motion.div>

        <div className="relative hidden w-full max-w-4xl lg:block lg:min-h-[560px] xl:min-h-[620px]">
          {cards.map(({ layout, testimonial }, index) => (
            <ProofWallCard
              key={index}
              testimonial={testimonial}
              layout={layout}
              pointerX={smoothPointerX}
              pointerY={smoothPointerY}
            />
          ))}

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-4">
            <HeroStatement />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            >
              <Link
                href="https://cal.com/bobby-washburn/intro-call"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/85"
              >
                Tell Me What&apos;s Happening
              </Link>
            </motion.div>
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
            <Link
              href="https://cal.com/bobby-washburn/intro-call"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/85"
            >
              Tell Me What&apos;s Happening
            </Link>
          </motion.div>
        </div>

        {/* Mobile/tablet fallback — the absolute-tilted layout above is lg+ only. */}
        <div className="mt-10 grid w-full max-w-md gap-4 lg:hidden">
          {cards.map(({ testimonial }, index) => (
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
