"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useRouteBall } from "./route-ball/route-ball-provider";
import { DEFAULT_REVEAL, PANEL_REVEAL_VARIANTS } from "./panel-motion-variants";
import type { PanelEmphasis, PanelLayout } from "@/lib/pain-points/teen-rebellion-panels";

type PanelShellProps = {
  id: string;
  layout: PanelLayout;
  emphasis: PanelEmphasis;
  panelMotion?: string;
  /**
   * Structural exemption for `when-to-get-support` (see SupportSignalsPanel):
   * renders immediately with no entrance animation and never registers with
   * the route-ball system, so it is never a route-ball target.
   */
  noMotion?: boolean;
  children: ReactNode;
  className?: string;
};

const LAYOUT_CLASS: Record<PanelLayout, string> = {
  "hero-wide": "mx-0 flex min-h-[70vh] items-center",
  wide: "mx-3 sm:mx-8 md:mx-16 lg:mx-24",
  "full-width": "mx-0",
};

function PanelShell({ id, layout, emphasis, panelMotion, noMotion, children, className }: PanelShellProps) {
  const { registerPanelRoot, requestHoverActive } = useRouteBall();

  const surfaceClass = cn(
    "px-6 py-10 sm:px-10 sm:py-14",
    emphasis === "caution" ? "bg-amber-50 text-brand-black" : "bg-brand-offwhite text-brand-black",
    className,
  );

  if (noMotion) {
    return (
      <div id={id} className={cn(LAYOUT_CLASS[layout], surfaceClass)}>
        {children}
      </div>
    );
  }

  const variants = panelMotion ? PANEL_REVEAL_VARIANTS[panelMotion] ?? DEFAULT_REVEAL : DEFAULT_REVEAL;

  return (
    <motion.div
      id={id}
      ref={(el: HTMLDivElement | null) => registerPanelRoot(id, el)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onHoverStart={() => requestHoverActive(id)}
      onHoverEnd={() => requestHoverActive(null)}
      className={cn(LAYOUT_CLASS[layout], surfaceClass)}
    >
      {children}
    </motion.div>
  );
}

export default PanelShell;
