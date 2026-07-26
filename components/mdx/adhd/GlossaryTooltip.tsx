'use client';

import { useState, useRef, useEffect } from 'react';

export interface GlossaryTooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

export function GlossaryTooltip({ term, definition, children }: GlossaryTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline' }}>
      <span
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{
          borderBottom: '1px dotted #C4B896',
          color: '#C4B896',
          cursor: 'help',
        }}>
        {children}
      </span>

      {open && (
        <span style={{
          position: 'absolute',
          bottom: 'calc(100% + 10px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 240,
          background: '#1E3A5A',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '12px 14px',
          fontSize: 12,
          color: 'var(--muted-foreground)',
          lineHeight: 1.6,
          zIndex: 50,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          display: 'block',
          pointerEvents: 'none',
        }}>
          <span style={{ fontWeight: 700, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>
            {term}
          </span>
          {definition}
          {/* Caret */}
          <span style={{
            position: 'absolute',
            bottom: -5,
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: 8, height: 8,
            background: '#1E3A5A',
            borderRight: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
          }} />
        </span>
      )}
    </span>
  );
}
