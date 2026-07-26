'use client';

import { useState } from 'react';

export interface MythCard {
  id: string;
  belief: string;
  partial: string;
}

export interface MythbusterCardsProps {
  cards: MythCard[];
  takeaway: string;
}

export function MythbusterCards({ cards, takeaway }: MythbusterCardsProps) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  return (
    <div className="my-6">
      <div className="grid grid-cols-2 gap-3 mb-4">
        {cards.map(card => {
          const isFlipped = !!flipped[card.id];
          return (
            <button key={card.id} onClick={() => setFlipped(f => ({ ...f, [card.id]: !f[card.id] }))}
              className="text-left rounded-lg p-4 transition-all duration-200 min-h-[160px] flex flex-col justify-between"
              style={{ background: 'var(--card)', border: `1px solid ${isFlipped ? '#5B8DB840' : 'var(--border)'}` }}>
              {!isFlipped ? (
                <>
                  <p className="text-[11px] leading-relaxed italic" style={{ color: 'var(--foreground)' }}>
                    {card.belief}
                  </p>
                  <span className="text-[10px] mt-3" style={{ color: 'var(--muted-foreground)' }}>
                    Tap to see the partial truth →
                  </span>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#5B8DB8' }}>
                      The partial truth
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      {card.partial}
                    </p>
                  </div>
                  <span className="text-[10px] mt-3" style={{ color: 'var(--muted-foreground)' }}>
                    ← Tap to flip back
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Combined takeaway */}
      <div className="rounded-lg px-5 py-4"
        style={{ background: '#1A2E44', border: '1px solid #5B8DB830' }}>
        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>
          The whole picture
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--foreground)' }}>
          {takeaway}
        </p>
      </div>
    </div>
  );
}
