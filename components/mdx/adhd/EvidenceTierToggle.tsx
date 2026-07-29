'use client';

import { useState } from 'react';

export interface Treatment {
  name: string;
  effectSize: string;
  notes: string;
}

export interface EvidenceTier {
  level: number;
  label: string;
  description: string;
  treatments: Treatment[];
}

export interface EvidenceTierToggleProps {
  tiers: EvidenceTier[];
}

const TIER_COLOR = ['#5B8DB8', '#C4B896', 'var(--muted-foreground)'];

export function EvidenceTierToggle({ tiers }: EvidenceTierToggleProps) {
  const [activeLevel, setActiveLevel] = useState<number | 'all'>(tiers[0]?.level ?? 1);

  const visibleTiers = activeLevel === 'all' ? tiers : tiers.filter((t) => t.level === activeLevel);

  return (
    <div className="my-6">
      <div className="flex flex-wrap gap-2 mb-5" role="tablist">
        {tiers.map((tier, i) => (
          <button
            key={tier.level}
            type="button"
            role="tab"
            aria-selected={activeLevel === tier.level}
            onClick={() => setActiveLevel(tier.level)}
            className="flex-1 min-w-[110px] py-2.5 rounded-lg text-[11px] font-semibold transition-all duration-150"
            style={{
              border: `1px solid ${activeLevel === tier.level ? TIER_COLOR[i] : 'var(--border)'}`,
              background: activeLevel === tier.level ? `${TIER_COLOR[i]}15` : 'transparent',
              color: activeLevel === tier.level ? TIER_COLOR[i] : 'var(--muted-foreground)',
            }}
          >
            {tier.label}
          </button>
        ))}
        <button
          type="button"
          role="tab"
          aria-selected={activeLevel === 'all'}
          onClick={() => setActiveLevel('all')}
          className="py-2.5 px-4 rounded-lg text-[11px] font-semibold transition-all duration-150"
          style={{
            border: `1px solid ${activeLevel === 'all' ? 'var(--foreground)' : 'var(--border)'}`,
            color: activeLevel === 'all' ? 'var(--foreground)' : 'var(--muted-foreground)',
          }}
        >
          Show all
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {visibleTiers.map((tier) => {
          const color = TIER_COLOR[tiers.findIndex((t) => t.level === tier.level)];
          return (
            <div key={tier.level}>
              {activeLevel === 'all' && (
                <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color }}>
                  {tier.label}
                </div>
              )}
              <p className="text-[11px] leading-relaxed mb-2.5 italic" style={{ color: 'var(--muted-foreground)' }}>
                {tier.description}
              </p>
              <div className="flex flex-col gap-2.5">
                {tier.treatments.map((t) => (
                  <div
                    key={t.name}
                    className="rounded-lg py-4 px-5"
                    style={{
                      background: 'var(--card)',
                      borderLeft: `3px solid ${color}`,
                      borderTop: '1px solid var(--border)',
                      borderRight: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                      <div className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
                        {t.name}
                      </div>
                      <div className="text-[10px] shrink-0" style={{ color }}>
                        {t.effectSize}
                      </div>
                    </div>
                    <div className="text-[11px] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      {t.notes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
