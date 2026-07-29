'use client';

import { useState } from 'react';

export interface DevelopmentalStage {
  age: string;
  label: string;
  primaryPresentation: string;
  whatYouSee: string[];
  whatHelps: string;
  diagnosisNote: string;
}

export interface TemperamentTimelineProps {
  stages: DevelopmentalStage[];
}

export function TemperamentTimeline({ stages }: TemperamentTimelineProps) {
  const [active, setActive] = useState(0);
  const stage = stages[active];

  return (
    <div className="my-6">
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        {stages.map((s, i) => {
          const isActive = active === i;
          return (
            <button
              key={s.age}
              type="button"
              aria-expanded={isActive}
              aria-controls={`stage-panel-${i}`}
              aria-label={`${s.age}: ${s.label}`}
              onClick={() => setActive(i)}
              className="flex-1 text-left rounded-lg px-3 py-2.5 transition-all duration-150"
              style={{
                background: isActive ? '#1E3A5A' : 'var(--card)',
                border: `1px solid ${isActive ? '#4A7A9B' : 'var(--border)'}`,
              }}
            >
              <div className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'var(--muted-foreground)' }}>
                {s.age}
              </div>
              <div className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                {s.label}
              </div>
            </button>
          );
        })}
      </div>

      <div id={`stage-panel-${active}`} className="rounded-lg p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#5B8DB8' }}>
          Primary presentation
        </div>
        <p className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
          {stage.primaryPresentation}
        </p>

        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>
          What you see
        </div>
        <ul className="mb-4">
          {stage.whatYouSee.map((item, i) => (
            <li
              key={i}
              className="text-base leading-relaxed mb-1.5 pl-3"
              style={{ color: 'var(--muted-foreground)', borderLeft: '2px solid #5B8DB840' }}
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>
          What helps
        </div>
        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--foreground)' }}>
          {stage.whatHelps}
        </p>

        <p className="text-base leading-relaxed italic" style={{ color: 'var(--muted-foreground)' }}>
          {stage.diagnosisNote}
        </p>
      </div>
    </div>
  );
}
