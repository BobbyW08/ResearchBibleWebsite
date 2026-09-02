"use client";

import { useState } from "react";

type Modality = {
  title: string;
  explanation: string;
};

// Micro-copy is a first draft, not finalized — flag for Bobby's review/edit
// before this ships (see claude-code-handoff-v12.md).
const MODALITIES: Modality[] = [
  {
    title: "CPRS Principles",
    explanation:
      "Certified Peer Recovery/Support Specialist principles: lived experience paired with real training, so you're getting a peer who's walked through it, not just studied it.",
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

// A single flip card. Front: red box, white title only. Back (on hover, tap,
// or keyboard focus): white box, red title restated at the top, dark-gray
// (muted-foreground) paragraph explanation. Deliberately one-way — once
// flipped, `flipped` never resets to false, so the explanation stays visible
// permanently rather than flipping back when the pointer/focus leaves.
function ModalityCard({ modality }: { modality: Modality }) {
  const [flipped, setFlipped] = useState(false);
  const reveal = () => setFlipped(true);

  return (
    <button
      type="button"
      onMouseEnter={reveal}
      onFocus={reveal}
      onClick={reveal}
      className="group h-56 w-full text-left perspective-distant sm:h-60"
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

export default function ModalityCards() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {MODALITIES.map((modality) => (
        <ModalityCard key={modality.title} modality={modality} />
      ))}
    </div>
  );
}
