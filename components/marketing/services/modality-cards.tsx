"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Modality = {
  title: string;
  explanation: string;
};

// Micro-copy is a first draft, not finalized — flag for Bobby's review/edit
// before this ships (see claude-code-handoff-v12.md, v13.md).
const MODALITIES: Modality[] = [
  {
    title: "Peer Support Principles",
    explanation:
      "Peer Support Specialist principles: lived experience paired with real training, so you're getting a peer who's walked through it, not just studied it.",
  },
  {
    title: "Trauma-Informed Parenting",
    explanation:
      "Understanding how trauma reshapes a child's nervous system, so we respond to what's actually driving the behavior instead of punishing the behavior itself.",
  },
  {
    title: "Brain-Based Parenting",
    explanation:
      "Working with how your child's brain develops and reacts under stress, not against it, so the strategies actually match what's happening in their head.",
  },
  {
    title: "DBT-Influenced Skill Building",
    explanation:
      "Practical, evidence-based skills for handling big emotions and hard moments in the room, borrowed from Dialectical Behavior Therapy and adapted for parents and kids.",
  },
];

// A single flip card (sm and up only — mobile gets ModalityAccordionMobile
// below instead). Front: red box, white title only. Back (on hover, tap, or
// keyboard focus): white box, red title restated at the top, dark-gray
// (muted-foreground) paragraph explanation. Deliberately one-way — once
// flipped, `flipped` never resets to false, so the explanation stays visible
// permanently rather than flipping back when the pointer/focus leaves.
// Height bumped from h-56/h-60 (v12) to h-64/h-72 — the DBT card's back-face
// text was clipping against the bottom edge at the old height.
function ModalityCard({ modality }: { modality: Modality }) {
  const [flipped, setFlipped] = useState(false);
  const reveal = () => setFlipped(true);

  return (
    <button
      type="button"
      onMouseEnter={reveal}
      onFocus={reveal}
      onClick={reveal}
      className="group h-64 w-full text-left perspective-distant sm:h-72"
      aria-label={
        flipped
          ? `${modality.title}: ${modality.explanation}`
          : `${modality.title} — select to read more`
      }
    >
      <span
        className={`relative block h-full w-full transform-3d transition-transform duration-500 ease-out ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary p-5 text-center backface-hidden">
          <span className="font-heading text-lg font-semibold tracking-tight text-primary-foreground">
            {modality.title}
          </span>
        </span>

        {/* Back */}
        <span className="absolute inset-0 flex rotate-y-180 flex-col gap-2 rounded-lg bg-brand-offwhite p-5 text-left backface-hidden">
          <span className="font-heading text-base font-semibold tracking-tight text-primary">
            {modality.title}
          </span>
          <span className="text-sm font-normal leading-relaxed text-muted-foreground">
            {modality.explanation}
          </span>
        </span>
      </span>
    </button>
  );
}

const SWIPE_THRESHOLD_PX = 40;

// Mobile-only (<sm) replacement for the flip-card grid: a vertical accordion
// with all four titles visible at once (collapsed rows, red/white — same
// palette as the desktop card's front face), matching the visual language of
// components/marketing/faq-accordion.tsx (grid-rows-[0fr]/[1fr] height
// transition, ChevronDown that rotates on open). Tapping a row expands it in
// place; opening a new row closes whichever was open (standard accordion
// behavior, one open at a time). While a row is open, a left/right touch
// swipe on its panel moves to the next/previous card's explanation without
// having to collapse and re-tap — plain touch-delta detection rather than
// proof-wall-hero.tsx's MobileTestimonialCarousel's scroll-snap-strip
// technique, since a horizontal snap strip doesn't compose cleanly with
// rows that need to stay vertically stacked and individually collapsible;
// still native touch handling, no added dependency.
//
// This combination (accordion + swipe-while-open) is one reasonable reading
// of an ambiguous request, not a previously agreed spec — first pass, flag
// to Bobby for a look before treating it as final (see
// claude-code-handoff-v13.md). If he pictured something simpler (plain
// accordion, no swipe, or tap-arrows instead of swipe), that's an easy
// follow-up once he's seen it live.
function ModalityAccordionMobile({ modalities }: { modalities: Modality[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent, index: number) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null) return;

    const endX = event.changedTouches[0]?.clientX ?? startX;
    const delta = endX - startX;
    if (delta <= -SWIPE_THRESHOLD_PX && index < modalities.length - 1) {
      setOpenIndex(index + 1);
    } else if (delta >= SWIPE_THRESHOLD_PX && index > 0) {
      setOpenIndex(index - 1);
    }
  };

  return (
    <div className="mt-10 flex flex-col gap-2 sm:hidden">
      {modalities.map((modality, index) => {
        const open = openIndex === index;
        const panelId = `modality-panel-${index}`;

        return (
          <div key={modality.title} className="overflow-hidden rounded-lg border border-brand-offwhite/15">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => toggle(index)}
              className={cn(
                "flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors",
                open ? "bg-brand-offwhite text-primary" : "bg-primary text-primary-foreground",
              )}
            >
              <span className="font-heading text-sm font-semibold tracking-tight">{modality.title}</span>
              <ChevronDown
                className={cn("h-4 w-4 shrink-0 transition-transform duration-300", open && "rotate-180")}
              />
            </button>
            <div
              id={panelId}
              className={cn(
                "grid bg-brand-offwhite transition-all duration-300 ease-in-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
              onTouchStart={handleTouchStart}
              onTouchEnd={(event) => handleTouchEnd(event, index)}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 pt-1 text-sm font-normal leading-relaxed text-muted-foreground">
                  {modality.explanation}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ModalityCards() {
  return (
    <>
      <div className="mt-10 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {MODALITIES.map((modality) => (
          <ModalityCard key={modality.title} modality={modality} />
        ))}
      </div>
      <ModalityAccordionMobile modalities={MODALITIES} />
    </>
  );
}
