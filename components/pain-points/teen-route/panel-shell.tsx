"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { DEFAULT_REVEAL, PANEL_REVEAL_VARIANTS } from "./panel-motion-variants";
import type { PanelEmphasis, PanelSize } from "@/lib/pain-points/teen-rebellion-panels";

type PanelShellProps = {
  id: string;
  size: PanelSize;
  emphasis: PanelEmphasis;
  panelMotion?: string;
  /**
   * Structural exemption for `when-to-get-support` (see SupportSignalsPanel):
   * renders immediately with no entrance animation and has no click
   * interaction — it's still placed in the grid like any other panel, just
   * with zero motion.
   */
  noMotion?: boolean;
  children: ReactNode;
  className?: string;
};

// Grid placement per size token (md+ only — below md every panel is a plain
// single-column block in source order, so no span classes apply there).
// `pick-one-thing` (the only "centered" wide panel) adds its own
// `md:col-start-2` on top of this in route-cta-panel.tsx.
const SIZE_CLASS: Record<PanelSize, string> = {
  feature: "md:col-span-2 md:row-span-2",
  tall: "md:col-span-1 md:row-span-2",
  wide: "md:col-span-2 md:row-span-1",
  standard: "md:col-span-1 md:row-span-1",
  banner: "md:col-span-4 md:row-span-1",
};

function PanelShell({ id, size, emphasis, panelMotion, noMotion, children, className }: PanelShellProps) {
  const surfaceClass = cn(
    "flex flex-col px-6 py-8 sm:px-8 sm:py-10",
    emphasis === "caution" ? "bg-amber-50 text-brand-black" : "bg-brand-offwhite text-brand-black",
    SIZE_CLASS[size],
    className,
  );

  if (noMotion) {
    return (
      <div id={id} className={surfaceClass}>
        {children}
      </div>
    );
  }

  const variants = panelMotion ? PANEL_REVEAL_VARIANTS[panelMotion] ?? DEFAULT_REVEAL : DEFAULT_REVEAL;

  return (
    <motion.div
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={surfaceClass}
    >
      {children}
    </motion.div>
  );
}

export default PanelShell;
