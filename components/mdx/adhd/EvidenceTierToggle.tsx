'use client';

import { useState } from 'react';

export interface EvidenceItem {
  claim: string;
  detail: string;
}

export interface EvidenceTierToggleProps {
  tiers: {
    know:    { label: string; items: EvidenceItem[] };
    testing: { label: string; items: EvidenceItem[] };
  };
}

export function EvidenceTierToggle({ tiers }: EvidenceTierToggleProps) {
  const [tab, setTab] = useState<'know' | 'testing'>('know');
  const content = tiers[tab];
  const accentColor = tab === 'know' ? '#5B8DB8' : '#C4B896';

  return (
    <div className="my-6">
      {/* Tab toggle */}
      <div className="flex gap-2 mb-5">
        {(['know', 'testing'] as const).map(key => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
              border: `1px solid ${tab === key ? (key === 'know' ? '#5B8DB8' : '#C4B896') : 'var(--border)'}`,
              background: tab === key ? (key === 'know' ? '#5B8DB815' : '#C4B89615') : 'transparent',
              color: tab === key ? (key === 'know' ? '#5B8DB8' : '#C4B896') : 'var(--muted-foreground)',
            }}>
            {tiers[key].label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2.5">
        {content.items.map((item, i) => (
          <div key={i} className="rounded-lg py-4 px-5"
            style={{
              background: 'var(--card)',
              borderLeft: `3px solid ${accentColor}`,
              borderTop: '1px solid var(--border)',
              borderRight: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              {item.claim}
            </div>
            <div className="text-[11px] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              {item.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
