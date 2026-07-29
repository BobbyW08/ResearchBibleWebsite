'use client';

import { useState } from 'react';

export interface Strategy {
  name: string;
  detail: string;
  tier: number;
}

export interface Situation {
  id: string;
  label: string;
  strategies: Strategy[];
}

export interface StrategyExplorerProps {
  situations: Situation[];
}

export function StrategyExplorer({ situations }: StrategyExplorerProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const active = situations.filter((s) => selected.has(s.id));
  const strategyCount = active.reduce((sum, s) => sum + s.strategies.length, 0);

  return (
    <div className="my-6">
      <div className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>
        What are you seeing?
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto md:flex-wrap md:overflow-visible pb-1">
        {situations.map((sit) => {
          const isSelected = selected.has(sit.id);
          return (
            <button
              key={sit.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggle(sit.id)}
              className="shrink-0 rounded-lg px-3 py-2.5 text-sm text-left leading-tight whitespace-nowrap transition-all duration-150"
              style={{
                border: `1px solid ${isSelected ? '#C4B896' : 'var(--border)'}`,
                background: isSelected ? '#C4B89618' : 'transparent',
                color: isSelected ? '#C4B896' : 'var(--muted-foreground)',
              }}
            >
              {sit.label}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="sr-only">
        {selected.size === 0
          ? 'No situation selected'
          : `Showing ${strategyCount} strategies for ${active.map((s) => s.label).join(', ')}`}
      </div>

      {selected.size === 0 && (
        <div
          className="rounded-lg px-5 py-8 text-center text-base"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
        >
          Select one or more situations above to see strategies
        </div>
      )}

      {active.map((sit) => (
        <div key={sit.id} className="mb-6">
          <div className="text-sm font-bold mb-3" style={{ color: '#C4B896' }}>
            When: {sit.label}
          </div>
          {sit.strategies.map((strat, i) => (
            <div key={i} className="rounded-lg px-4 py-4 mb-2.5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <div className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
                  {strat.name}
                </div>
                <div className="text-xs uppercase tracking-wide shrink-0" style={{ color: 'var(--muted-foreground)' }}>
                  Tier {strat.tier}
                </div>
              </div>
              <div className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {strat.detail}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
