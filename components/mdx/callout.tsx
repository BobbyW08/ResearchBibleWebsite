import type { ReactNode } from 'react';

export interface CalloutProps {
  title?: ReactNode;
  children: ReactNode;
}

export function Callout({ title, children }: CalloutProps) {
  return (
    <div
      className="my-4 rounded-lg p-4"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {title && (
        <p className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>
          {title}
        </p>
      )}
      <div className="text-base leading-relaxed" style={{ color: '#FFFFFF' }}>
        {children}
      </div>
    </div>
  );
}
