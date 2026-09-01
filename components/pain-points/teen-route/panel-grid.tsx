import type { ReactNode } from "react";

// bg-brand-black ground with a thick black gutter between panel surfaces —
// the gutter is the grid gap itself showing the black ground through, so
// panel surfaces never need their own border/shadow. Hard rectangular
// edges everywhere: no rounded corners, no drop-shadow.
//
// A real CSS Grid mosaic on md+ (4 columns; each panel's own col/row span
// comes from its PanelSize token via PANEL_SIZE_CLASS in panel-shell.tsx).
// Auto-placement stays in default (sparse) flow, not `dense` — dense would
// backfill early gaps with later panels and could pull the closing CTA (08)
// or the safety panel (07) out of their intended trailing position. A couple
// of small gaps reading as solid black rectangles are an accepted side
// effect of the sparse mosaic, not a bug — see claude/pain-point-newspaper-layout-v9.md
// Part 1. Below md, everything collapses to a single column in source order.
function PanelGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 bg-brand-black p-1.5 md:grid-cols-4">{children}</div>
  );
}

export default PanelGrid;
