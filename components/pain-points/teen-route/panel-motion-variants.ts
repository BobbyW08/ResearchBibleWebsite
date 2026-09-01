import type { Variants } from "motion/react";

// One-time whileInView reveal per panel, keyed by its `panelMotion` name —
// matches the mount-in pattern in proof-wall-hero.tsx. Built from a shared
// set of primitives (offset, rotation, scale) rather than a bespoke keyframe
// set per name, so each panel type reads as visually distinct without a
// large from-scratch animation per panel.
export const PANEL_REVEAL_VARIANTS: Record<string, Variants> = {
  "feature-reframe-redaction-tilt": {
    hidden: { opacity: 0, y: 28, rotate: -1.2 },
    visible: { opacity: 1, y: 0, rotate: 0 },
  },
  "explanation-expand-vertical": {
    hidden: { opacity: 0, scaleY: 0.94, y: 18 },
    visible: { opacity: 1, scaleY: 1, y: 0 },
  },
  "comparison-split-two-lanes": {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0 },
  },
  "friction-subtle-shake": {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  },
  "script-strike-and-replace": {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  "action-checklist-commitment": {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  "close-next-step-anchor": {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  },
};

export const DEFAULT_REVEAL: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
