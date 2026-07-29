'use client';

import { useEffect, useId, useRef, useState } from 'react';

export const glossary: Record<string, string> = {
  'neurodevelopmental disorder':
    "A condition that originates in how the brain develops before birth, affecting how the brain is structured and wired — not something that develops from life experiences.",
  'prefrontal cortex':
    "The front part of the brain responsible for planning, impulse control, working memory, and managing emotions. The area most affected in ADHD.",
  dopamine:
    "A brain chemical that carries signals between neurons. In ADHD, dopamine is released too quickly and in insufficient amounts, weakening the brain's ability to anticipate and respond to rewards.",
  norepinephrine:
    "A brain chemical that helps regulate sustained attention and alertness. In ADHD, norepinephrine levels in the prefrontal cortex are insufficient, impairing focus.",
  'basal ganglia':
    "A group of brain structures involved in motor control, habit formation, and reward processing. Consistently shows differences in ADHD brain imaging.",
  striatum:
    "A part of the brain's reward system where dopamine is released and reabsorbed. In ADHD, dopamine is reabsorbed too quickly, cutting off the reward signal.",
  'executive function':
    "A set of mental skills — including planning, working memory, impulse control, flexible thinking, and emotional regulation — that act as the brain's management system.",
  'behavioral inhibition':
    "The ability to pause before responding to an impulse. In ADHD, the brain's 'brake pedal' is weaker, so impulses fire before the suppression mechanism can catch them.",
  'working memory':
    "The ability to hold information in mind while using it — like remembering the first part of an instruction while completing the second part. Reliably impaired in ADHD.",
  'cortical maturation':
    "The process by which the brain's outer layer (cortex) develops and matures. In ADHD, this process runs 3–5 years behind neurotypical peers, especially in the prefrontal cortex.",
  'coercive cycle':
    "A reinforcement pattern where parent and child repeatedly escalate against each other, with both parties accidentally learning that escalation works. Common in ADHD families.",
  IEP: "Individualized Education Program — a legally binding school plan that provides specialized instruction and related services for children whose disability significantly impairs academic performance.",
  '504 Plan':
    "A school accommodation plan under Section 504 of the Rehabilitation Act — provides changes to how material is delivered or assessed, without requiring specialized instruction.",
  'Behavioral Parent Training':
    "An evidence-based skills program for parents — not children — that teaches specific strategies for structuring the environment, giving instructions, and delivering consistent consequences.",
  'stimulant medication':
    "Medications (primarily methylphenidate and amphetamine salts) that increase dopamine and norepinephrine availability in the prefrontal cortex, directly addressing ADHD's core neurochemical deficit.",
  methylphenidate:
    "The active ingredient in medications like Ritalin, Concerta, and Focalin. One of the two main classes of ADHD stimulant medication.",
  'amphetamine salts':
    "The active ingredient in medications like Adderall and Vyvanse. One of the two main classes of ADHD stimulant medication.",
  'oppositional defiant disorder':
    "A pattern of angry, argumentative, or defiant behavior toward adults. Co-occurs with ADHD in 35–50% of children, often as a secondary response to accumulated frustration.",
};

export interface GlossaryTooltipProps {
  term: string;
}

export function GlossaryTooltip({ term }: GlossaryTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();
  const definition = glossary[term];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }, []);

  if (!definition) return <>{term}</>;

  const openWithDelay = () => {
    hoverTimer.current = setTimeout(() => setOpen(true), 200);
  };
  const cancelDelayedOpen = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  return (
    <span ref={ref} className="relative inline">
      <span
        role="button"
        tabIndex={0}
        aria-describedby={open ? tooltipId : undefined}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={openWithDelay}
        onMouseLeave={() => {
          cancelDelayedOpen();
          setOpen(false);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
        style={{ borderBottom: '1px dotted #C4B896', color: '#C4B896', cursor: 'help' }}
      >
        {term}
      </span>

      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="absolute z-50 block"
          style={{
            bottom: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 320,
            maxWidth: '85vw',
            background: '#1E3A5A',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '12px 14px',
            fontSize: '1rem',
            color: '#FFFFFF',
            lineHeight: 1.6,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            pointerEvents: 'auto',
          }}
        >
          {definition}
          <span
            className="absolute"
            style={{
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: 8,
              height: 8,
              background: '#1E3A5A',
              borderRight: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
            }}
          />
        </span>
      )}
    </span>
  );
}
