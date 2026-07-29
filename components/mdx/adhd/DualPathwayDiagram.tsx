'use client';

import { useState } from 'react';

export type PathwayStepState = 'normal' | 'active' | 'success' | 'impaired' | 'failure';

export interface PathwayStep {
  node: string;
  state: PathwayStepState;
  note?: string;
}

export interface PathwaySide {
  label: string;
  steps: PathwayStep[];
}

export interface Pathway {
  name: string;
  neurotypical: PathwaySide;
  adhd: PathwaySide;
}

export interface DualPathwayDiagramProps {
  pathways: Pathway[];
}

const STATE_STYLE: Record<PathwayStepState, { border: string; dashed?: boolean }> = {
  normal: { border: 'var(--border)' },
  active: { border: '#5B8DB8' },
  success: { border: '#5B8DB8' },
  impaired: { border: '#C4645A', dashed: true },
  failure: { border: '#C4645A', dashed: true },
};

function StepColumn({ side, color }: { side: PathwaySide; color: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest mb-2 text-center" style={{ color }}>
        {side.label}
      </div>
      <div className="flex flex-col items-stretch">
        {side.steps.map((step, i) => {
          const style = STATE_STYLE[step.state];
          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className="w-full rounded-lg px-3 py-2.5 text-center"
                style={{
                  background: 'var(--card)',
                  border: `1px ${style.dashed ? 'dashed' : 'solid'} ${style.border}`,
                }}
              >
                <div className="text-base leading-snug" style={{ color: 'var(--foreground)' }}>
                  {step.node}
                </div>
                {step.note && (
                  <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    {step.note}
                  </div>
                )}
              </div>
              {i < side.steps.length - 1 && (
                <div style={{ width: 1, height: 14, background: 'var(--border)' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DualPathwayDiagram({ pathways }: DualPathwayDiagramProps) {
  const [active, setActive] = useState(0);
  const pathway = pathways[active];

  return (
    <div className="my-6">
      <div className="flex gap-2 mb-4" role="tablist">
        {pathways.map((p, i) => (
          <button
            key={p.name}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className="flex-1 py-2 rounded-lg text-base font-semibold transition-all duration-150"
            style={{
              border: `1px solid ${active === i ? '#5B8DB8' : 'var(--border)'}`,
              background: active === i ? '#5B8DB815' : 'transparent',
              color: active === i ? '#5B8DB8' : 'var(--muted-foreground)',
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StepColumn side={pathway.neurotypical} color="var(--muted-foreground)" />
        <StepColumn side={pathway.adhd} color="#C4645A" />
      </div>

      <p className="sr-only">
        {pathway.name}. {pathway.neurotypical.label}: {pathway.neurotypical.steps.map((s) => s.node).join(' → ')}.{' '}
        {pathway.adhd.label}: {pathway.adhd.steps.map((s) => s.node).join(' → ')}.
      </p>
    </div>
  );
}
