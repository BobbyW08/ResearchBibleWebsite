import type { ReactNode } from "react";

// bg-brand-black ground with thick black gutters between panel surfaces —
// the gutter is the grid gap itself showing the black ground through, so
// panel surfaces never need their own border/shadow. Hard rectangular edges:
// no rounded corners, no drop-shadow, per claude-code-handoff-v8.md Part B4.
function PanelGrid({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 bg-brand-black py-3 sm:gap-4 sm:py-4">
      {children}
    </div>
  );
}

export default PanelGrid;
