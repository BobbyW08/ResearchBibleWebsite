'use client';

import { useState } from 'react';

export interface MythCard {
  myth: string;
  fact: string;
}

export interface MythbusterCardsProps {
  cards: MythCard[];
}

export function MythbusterCards({ cards }: MythbusterCardsProps) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-3">
      {cards.map((card, i) => {
        const isOpen = !!flipped[i];
        return (
          <button
            key={i}
            type="button"
            aria-expanded={isOpen}
            onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
            className="text-left rounded-lg p-4 transition-all duration-200 min-h-[140px] flex flex-col justify-between"
            style={{ background: 'var(--card)', border: `1px solid ${isOpen ? '#5B8DB8' : 'var(--border)'}` }}
          >
            <p className="text-[13px] leading-relaxed font-semibold" style={{ color: 'var(--foreground)' }}>
              &ldquo;{card.myth}&rdquo;
            </p>
            <div
              className="mt-3 overflow-hidden transition-[max-height] duration-200"
              style={{ maxHeight: isOpen ? 240 : 0 }}
            >
              <div className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: '#5B8DB8' }}>
                The reality:
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {card.fact}
              </p>
            </div>
            <span className="text-[10px] mt-3" style={{ color: 'var(--muted-foreground)' }}>
              {isOpen ? '← Tap to close' : 'Tap to see the reality →'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
