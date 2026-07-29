'use client';

import { useState } from 'react';

export interface TimePoint {
  label: string;
  neurotypical: number;
  adhd: number;
}

export interface DelayAversionSliderProps {
  timePoints: TimePoint[];
  captions: string[];
}

export function DelayAversionSlider({ timePoints, captions }: DelayAversionSliderProps) {
  const [index, setIndex] = useState(0);
  const point = timePoints[index];
  const caption = captions[index];

  const W = 320, H = 170;
  const PAD = { l: 30, r: 12, t: 14, b: 34 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const n = timePoints.length;

  const toSVGX = (i: number) => PAD.l + (i / (n - 1)) * plotW;
  const toSVGY = (v: number) => PAD.t + plotH - (v / 100) * plotH;

  const linePath = (key: 'neurotypical' | 'adhd') =>
    `M ${timePoints.map((p, i) => `${toSVGX(i).toFixed(1)},${toSVGY(p[key]).toFixed(1)}`).join(' L ')}`;

  const mx = toSVGX(index);

  return (
    <div className="my-6">
      <div className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>
        Motivational response as the reward gets farther away
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }} aria-hidden="true">
        {[25, 50, 75].map((v) => (
          <line
            key={v}
            x1={PAD.l}
            y1={toSVGY(v)}
            x2={PAD.l + plotW}
            y2={toSVGY(v)}
            stroke="var(--border)"
            strokeWidth={0.5}
            strokeDasharray="3,3"
          />
        ))}
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + plotH} stroke="var(--border)" strokeWidth={1} />
        <line x1={PAD.l} y1={PAD.t + plotH} x2={PAD.l + plotW} y2={PAD.t + plotH} stroke="var(--border)" strokeWidth={1} />
        {[0, 50, 100].map((v) => (
          <text key={v} x={PAD.l - 4} y={toSVGY(v)} fill="var(--muted-foreground)" fontSize={8} textAnchor="end" dominantBaseline="middle">
            {v}
          </text>
        ))}

        <circle cx={PAD.l + 6} cy={PAD.t + 4} r={3} fill="#5B8DB8" />
        <text x={PAD.l + 12} y={PAD.t + 4} fill="#5B8DB8" fontSize={8} dominantBaseline="middle">
          Neurotypical
        </text>
        <circle cx={PAD.l + 6} cy={PAD.t + 16} r={3} fill="#C4B896" />
        <text x={PAD.l + 12} y={PAD.t + 16} fill="#C4B896" fontSize={8} dominantBaseline="middle">
          ADHD
        </text>

        <path d={linePath('neurotypical')} fill="none" stroke="#5B8DB8" strokeWidth={2} />
        <path d={linePath('adhd')} fill="none" stroke="#C4B896" strokeWidth={2} />

        <line x1={mx} y1={PAD.t} x2={mx} y2={PAD.t + plotH} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4,2" />
        <circle cx={mx} cy={toSVGY(point.neurotypical)} r={4} fill="#5B8DB8" />
        <circle cx={mx} cy={toSVGY(point.adhd)} r={4} fill="#C4B896" />
      </svg>

      <input
        type="range"
        min={0}
        max={n - 1}
        step={1}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        aria-valuemin={0}
        aria-valuemax={n - 1}
        aria-valuenow={index}
        aria-label={`Time to reward: ${point.label}`}
        className="w-full mt-3"
        style={{ accentColor: '#C4B896' }}
      />
      <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
        <span>Right now</span>
        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{point.label}</span>
        <span>Next week</span>
      </div>

      <div
        className="mt-4 rounded-lg px-5 py-4 text-base leading-relaxed italic"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted-foreground)', minHeight: 56 }}
      >
        {caption}
      </div>

      <table className="sr-only">
        <caption>Motivational response by time to reward</caption>
        <thead>
          <tr>
            <th scope="col">Time to reward</th>
            <th scope="col">Neurotypical response</th>
            <th scope="col">ADHD response</th>
          </tr>
        </thead>
        <tbody>
          {timePoints.map((p) => (
            <tr key={p.label}>
              <td>{p.label}</td>
              <td>{p.neurotypical}</td>
              <td>{p.adhd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
