"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { testimonials, type Testimonial } from "@/lib/testimonials";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-[300px] shrink-0 rounded-lg border border-primary-foreground/15 bg-secondary p-5 sm:w-[340px]",
        className,
      )}
    >
      <p className="line-clamp-5 text-sm leading-relaxed text-primary-foreground">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <p className="mt-3 text-xs text-primary-foreground/75">{testimonial.attribution}</p>
    </div>
  );
}

function Testimonials() {
  const reducedMotion = useReducedMotion();

  const marqueeCards = [...testimonials, ...testimonials];

  return (
    <section className="bg-primary py-14 text-primary-foreground sm:py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/70">
          What parents say
        </p>
        <h2 className="mt-2 font-heading text-2xl font-medium tracking-tight sm:text-3xl">
          From parents who were in the thick of it.
        </h2>
      </div>

      <div
        className="marquee-group relative mt-8 overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        }}
      >
        {reducedMotion ? (
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                className="snap-start"
              />
            ))}
          </div>
        ) : (
          <div className="marquee-track flex w-max gap-4">
            {marqueeCards.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Testimonials;
