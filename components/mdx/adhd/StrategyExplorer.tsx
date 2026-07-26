'use client';

import { useState } from 'react';

export interface Strategy {
  title: string;
  detail: string;
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
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const active = situations.filter(s => selected.has(s.id));

  return (
    <div className="my-6">
      <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>
        What are you seeing?
      </div>

      {/* Situation buttons */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {situations.map(sit => {
          const isSelected = selected.has(sit.id);
          return (
            <button key={sit.id} onClick={() => toggle(sit.id)}
              className="rounded-lg px-3 py-2.5 text-[11px] text-left leading-tight transition-all duration-150"
              style={{
                border: `1px solid ${isSelected ? '#C4B896' : 'var(--border)'}`,
                background: isSelected ? '#C4B89618' : 'transparent',
                color: isSelected ? '#C4B896' : 'var(--muted-foreground)',
                cursor: 'pointer',
              }}>
              {sit.label}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {selected.size === 0 && (
        <div className="rounded-lg px-5 py-8 text-center text-xs"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
          Select one or more situations above to see strategies
        </div>
      )}

      {/* Strategies */}
      {active.map(sit => (
        <div key={sit.id} className="mb-6">
          <div className="text-[11px] font-bold mb-3" style={{ color: '#C4B896' }}>
            When: {sit.label}
          </div>
          {sit.strategies.map((strat, i) => (
            <div key={i} className="rounded-lg px-4 py-4 mb-2.5"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                {strat.title}
              </div>
              <div className="text-[11px] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {strat.detail}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
