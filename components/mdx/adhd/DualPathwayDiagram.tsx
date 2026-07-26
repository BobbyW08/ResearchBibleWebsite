'use client';

import { useState } from 'react';

export interface Pathway {
  key: string;
  label: string;
  subtitle: string;
  color: string;
  mechanism: string;
  signs: string[];
  screen: string;
}

export interface DualPathwayDiagramProps {
  pathways: Pathway[];
  centralLabel?: string;
}

export function DualPathwayDiagram({ pathways, centralLabel = 'ADHD' }: DualPathwayDiagramProps) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="my-6 font-sans">
      {/* Central node */}
      <div className="flex justify-center mb-4">
        <div style={{ background: '#1E3A5A', border: '2px solid #4A7A9B', borderRadius: 50 }}
          className="px-7 py-3 text-sm font-bold tracking-wide text-[var(--foreground)]">
          {centralLabel}
        </div>
      </div>

      {/* Connector */}
      <div className="flex justify-center">
        <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
      </div>
      <div className="flex justify-center mb-0">
        <div style={{
          width: '60%', height: 20,
          borderTop: '1px solid var(--border)',
          borderLeft: '1px solid var(--border)',
          borderRight: '1px solid var(--border)',
          borderTopLeftRadius: 4, borderTopRightRadius: 4,
        }} />
      </div>

      {/* Pathway cards */}
      <div className="grid grid-cols-2 gap-3">
        {pathways.map((pathway) => (
          <button
            key={pathway.key}
            onClick={() => setOpen(open === pathway.key ? null : pathway.key)}
            className="text-left rounded-lg p-4 transition-all duration-200"
            style={{
              background: 'var(--card)',
              border: `1px solid ${open === pathway.key ? pathway.color : 'var(--border)'}`,
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 mr-2">
                <div className="text-xs font-bold mb-1" style={{ color: pathway.color }}>
                  {pathway.label}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>
                  {pathway.subtitle}
                </div>
              </div>
              <span style={{
                color: 'var(--muted-foreground)', fontSize: 14,
                transform: open === pathway.key ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
                flexShrink: 0,
              }}>▾</span>
            </div>

            {open === pathway.key && (
              <div className="mt-4 text-left">
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--foreground)' }}>
                  {pathway.mechanism}
                </p>
                <div className="mb-4">
                  <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>
                    Day-to-day signs
                  </div>
                  {pathway.signs.map((sign, i) => (
                    <div key={i} className="text-[11px] leading-relaxed mb-1.5 pl-3"
                      style={{ color: 'var(--muted-foreground)', borderLeft: `2px solid ${pathway.color}40` }}>
                      {sign}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>
                    With screens
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    {pathway.screen}
                  </p>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-center text-[10px] mt-3" style={{ color: 'var(--muted-foreground)' }}>
        Tap a pathway to expand
      </p>
    </div>
  );
}
