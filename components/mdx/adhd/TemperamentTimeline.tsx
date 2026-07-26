'use client';

import { useState } from 'react';

export interface TimelineOutcome {
  id: string;
  label: string;
  color: string;
  description: string;
  outcomes: string[];
}

export interface TemperamentTimelineProps {
  startingPoint: string;
  outcomes: TimelineOutcome[];
  footerNote?: string;
}

export function TemperamentTimeline({ startingPoint, outcomes, footerNote }: TemperamentTimelineProps) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="my-6">
      {/* Starting node */}
      <div className="flex flex-col items-center mb-5">
        <div className="rounded-lg px-6 py-3 text-center max-w-sm"
          style={{ background: '#1E3A5A', border: '2px solid #4A7A9B' }}>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Starting point
          </div>
          <p className="text-xs font-semibold leading-snug" style={{ color: 'var(--foreground)' }}>
            {startingPoint}
          </p>
        </div>

        {/* Branch indicator */}
        <div className="flex flex-col items-center mt-3">
          <div style={{ width: 1, height: 12, background: 'var(--border)' }} />
          <div className="text-[10px] my-1" style={{ color: 'var(--muted-foreground)' }}>environment shapes</div>
          <div style={{ width: 1, height: 12, background: 'var(--border)' }} />
          <span style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>▾</span>
        </div>
      </div>

      {/* Outcome paths */}
      <div className="flex flex-col gap-2.5">
        {outcomes.map(outcome => {
          const isOpen = revealed.has(outcome.id);
          return (
            <button key={outcome.id} onClick={() => toggle(outcome.id)}
              className="text-left rounded-lg p-4 transition-all duration-200"
              style={{
                background: 'var(--card)',
                borderLeft: `4px solid ${outcome.color}`,
                borderTop: '1px solid var(--border)',
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Environment:</div>
                  <div className="text-xs font-bold" style={{ color: outcome.color }}>{outcome.label}</div>
                </div>
                <span style={{
                  color: 'var(--muted-foreground)', fontSize: 13,
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}>▾</span>
              </div>

              {isOpen && (
                <div className="mt-4">
                  <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--foreground)' }}>
                    {outcome.description}
                  </p>
                  <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>
                    Over time
                  </div>
                  {outcome.outcomes.map((o, i) => (
                    <div key={i} className="text-[11px] leading-relaxed mb-1.5 pl-3"
                      style={{ color: 'var(--muted-foreground)', borderLeft: `2px solid ${outcome.color}40` }}>
                      {o}
                    </div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {footerNote && (
        <p className="text-[10px] leading-relaxed mt-4" style={{ color: 'var(--muted-foreground)' }}>
          {footerNote}
        </p>
      )}
    </div>
  );
}
