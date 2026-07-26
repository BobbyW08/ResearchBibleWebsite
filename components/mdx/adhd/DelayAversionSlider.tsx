'use client';

import { useState } from 'react';

const CAPTIONS: [number, number, string][] = [
  [0,  12,  "Right now. Both brains feel the same pull toward the reward."],
  [12, 28,  "A few minutes. Already a noticeably steeper drop for the delay-averse brain."],
  [28, 48,  "Under an hour. For a delay-averse brain, this wait already feels like losing."],
  [48, 68,  "A few hours. The gap has widened dramatically — waiting starts to feel pointless."],
  [68, 85,  "Tomorrow. For a delay-averse brain, tomorrow is nearly as distant as never."],
  [85, 100, "Next week. The typical brain still sees meaningful value. The delay-averse brain registers almost none."],
];

export function DelayAversionSlider() {
  const [time, setTime] = useState(15);

  const typical    = (t: number) => 100 * Math.exp(-0.003 * t);
  const delayAverse = (t: number) => 100 * Math.exp(-0.055 * t);

  const W = 300, H = 160;
  const PAD = { l: 28, r: 12, t: 12, b: 36 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  const toSVGX = (t: number) => PAD.l + (t / 100) * plotW;
  const toSVGY = (v: number) => PAD.t + plotH - (v / 100) * plotH;

  const makePath = (fn: (t: number) => number) => {
    const pts: string[] = [];
    for (let t = 0; t <= 100; t += 2) pts.push(`${toSVGX(t).toFixed(1)},${toSVGY(fn(t)).toFixed(1)}`);
    return `M ${pts.join(' L ')}`;
  };

  const caption = CAPTIONS.find(([lo, hi]) => time >= lo && time < hi)?.[2] ?? CAPTIONS[CAPTIONS.length - 1][2];
  const mx = toSVGX(time);

  return (
    <div className="my-6">
      <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>
        Perceived value of a reward over time
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        {/* Grid */}
        {[25, 50, 75].map(v => (
          <line key={v} x1={PAD.l} y1={toSVGY(v)} x2={PAD.l + plotW} y2={toSVGY(v)}
            stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3,3" />
        ))}
        {/* Axes */}
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + plotH} stroke="var(--border)" strokeWidth={1} />
        <line x1={PAD.l} y1={PAD.t + plotH} x2={PAD.l + plotW} y2={PAD.t + plotH} stroke="var(--border)" strokeWidth={1} />
        {/* Y axis labels */}
        {[0, 50, 100].map(v => (
          <text key={v} x={PAD.l - 4} y={toSVGY(v)} fill="var(--muted-foreground)" fontSize={8}
            textAnchor="end" dominantBaseline="middle">{v}</text>
        ))}
        {/* X axis labels */}
        <text x={PAD.l} y={PAD.t + plotH + 14} fill="var(--muted-foreground)" fontSize={8}>Now</text>
        <text x={PAD.l + plotW} y={PAD.t + plotH + 14} fill="var(--muted-foreground)" fontSize={8} textAnchor="end">Later</text>
        <text x={PAD.l + plotW / 2} y={PAD.t + plotH + 26} fill="var(--muted-foreground)" fontSize={8} textAnchor="middle">Time to reward →</text>
        {/* Legend */}
        <circle cx={PAD.l + 6} cy={PAD.t + 6} r={3} fill="#5B8DB8" />
        <text x={PAD.l + 12} y={PAD.t + 6} fill="#5B8DB8" fontSize={8} dominantBaseline="middle">Typical</text>
        <circle cx={PAD.l + 6} cy={PAD.t + 18} r={3} fill="#C4B896" />
        <text x={PAD.l + 12} y={PAD.t + 18} fill="#C4B896" fontSize={8} dominantBaseline="middle">Delay-averse</text>
        {/* Curves */}
        <path d={makePath(typical)}     fill="none" stroke="#5B8DB8" strokeWidth={2} />
        <path d={makePath(delayAverse)} fill="none" stroke="#C4B896" strokeWidth={2} />
        {/* Marker */}
        <line x1={mx} y1={PAD.t} x2={mx} y2={PAD.t + plotH} stroke="rgba(255,255,255,0.25)" strokeWidth={1} strokeDasharray="4,2" />
        <circle cx={mx} cy={toSVGY(typical(time))}     r={4} fill="#5B8DB8" />
        <circle cx={mx} cy={toSVGY(delayAverse(time))} r={4} fill="#C4B896" />
      </svg>

      <input type="range" min={0} max={100} value={time}
        onChange={e => setTime(Number(e.target.value))}
        className="w-full mt-3" style={{ accentColor: '#C4B896' }} />
      <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--muted-foreground)' }}>
        <span>Now</span><span>← drag →</span><span>Later</span>
      </div>

      <div className="mt-4 rounded-lg px-5 py-4 text-xs leading-relaxed italic"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted-foreground)', minHeight: 56 }}>
        {caption}
      </div>
    </div>
  );
}
