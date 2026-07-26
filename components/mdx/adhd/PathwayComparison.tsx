'use client';

import { useState } from 'react';

export interface PathwayPattern {
  key: string;
  label: string;
  color: string;
  intro: string;
  patterns: string[];
}

export interface PathwayComparisonProps {
  pathways: PathwayPattern[];
  disclaimer?: string;
}

export function PathwayComparison({ pathways, disclaimer }: PathwayComparisonProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const visiblePathways = activeKey
    ? pathways.filter(p => p.key === activeKey)
    : pathways;

  return (
    <div className="my-6">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {pathways.map(p => (
          <button key={p.key}
            onClick={() => setActiveKey(activeKey === p.key ? null : p.key)}
            className="flex-1 py-2 px-2 rounded-lg text-[10px] font-semibold leading-tight transition-all duration-150"
            style={{
              border: `1px solid ${activeKey === null || activeKey === p.key ? p.color : 'var(--border)'}`,
              background: activeKey === p.key ? `${p.color}18` : 'transparent',
              color: activeKey === null || activeKey === p.key ? p.color : 'var(--muted-foreground)',
            }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Pathway cards */}
      <div className={`grid gap-3 ${visiblePathways.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {visiblePathways.map(p => (
          <div key={p.key} className="rounded-lg p-4"
            style={{
              background: 'var(--card)',
              borderTop: `3px solid ${p.color}`,
              border: `1px solid var(--border)`,
              borderTopWidth: 3,
            }}>
            <div className="text-xs font-bold mb-1" style={{ color: p.color }}>{p.label}</div>
            <div className="text-[10px] italic mb-3" style={{ color: 'var(--muted-foreground)' }}>{p.intro}</div>
            {p.patterns.map((pattern, i) => (
              <div key={i} className="text-[11px] leading-relaxed mb-2 pl-3 italic"
                style={{ color: 'var(--foreground)', borderLeft: `2px solid ${p.color}30` }}>
                {pattern}
              </div>
            ))}
          </div>
        ))}
      </div>

      {disclaimer && (
        <p className="text-[10px] leading-relaxed mt-3" style={{ color: 'var(--muted-foreground)' }}>
          {disclaimer}
        </p>
      )}
    </div>
  );
}
