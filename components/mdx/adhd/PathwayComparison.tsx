export interface ComparisonSide {
  title: string;
  subtitle: string;
  rightFor: string;
  provides: string;
  examples: string[];
  doesNotProvide: string;
  askFor: string;
}

export interface PathwayComparisonProps {
  left: ComparisonSide;
  right: ComparisonSide;
}

function ComparisonColumn({ side }: { side: ComparisonSide }) {
  return (
    <div className="rounded-lg p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="mb-3">
        <div className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
          {side.title}
        </div>
        <div className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{side.subtitle}</div>
      </div>

      <div className="rounded-md px-3 py-2 mb-3 text-[11px] font-semibold" style={{ background: '#5B8DB818', color: '#5B8DB8' }}>
        {side.provides}
      </div>

      <p className="text-[11px] leading-relaxed mb-3" style={{ color: 'var(--foreground)' }}>
        {side.rightFor}
      </p>

      <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>
        Examples
      </div>
      <ul className="mb-3">
        {side.examples.map((ex, i) => (
          <li
            key={i}
            className="text-[11px] leading-relaxed mb-1.5 pl-3"
            style={{ color: 'var(--muted-foreground)', borderLeft: '2px solid var(--border)' }}
          >
            {ex}
          </li>
        ))}
      </ul>

      <div className="text-[10px] leading-relaxed mb-3" style={{ color: 'var(--muted-foreground)' }}>
        <span className="font-semibold">Does not provide: </span>
        {side.doesNotProvide}
      </div>

      <div className="rounded-md px-3 py-2 text-[11px] leading-relaxed" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
        <span className="font-semibold" style={{ color: '#C4B896' }}>Ask for: </span>
        {side.askFor}
      </div>
    </div>
  );
}

export function PathwayComparison({ left, right }: PathwayComparisonProps) {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <ComparisonColumn side={left} />
      <ComparisonColumn side={right} />
    </div>
  );
}
