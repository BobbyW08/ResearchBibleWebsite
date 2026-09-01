// Named entry/exit variants as a lookup table, per claude-code-handoff-v8.md
// Part B5. Each preset is built from the same small set of primitives
// (rotation, scale, arc height, easing) rather than a bespoke animation per
// name, but the combination gives each named transition a visually distinct
// character.

export type EaseName = "backOut" | "circOut" | "easeOut" | "easeInOut";

export type EntryPreset = {
  rotateFrom: number;
  scaleFrom: number;
  ease: EaseName;
  duration: number;
};

export type ExitPreset = {
  arcHeight: number;
  rotateTo: number;
  duration: number;
  ease: EaseName;
};

export const ENTRY_PRESETS: Record<string, EntryPreset> = {
  "arrive-corner-ready": { rotateFrom: -35, scaleFrom: 0.4, ease: "backOut", duration: 0.45 },
  "arrive-border-notch-ready": { rotateFrom: 0, scaleFrom: 0.6, ease: "circOut", duration: 0.4 },
  "arrive-underline-headline-ready": { rotateFrom: 14, scaleFrom: 0.7, ease: "easeOut", duration: 0.4 },
  "arrive-margin-rail-ready": { rotateFrom: -10, scaleFrom: 0.55, ease: "circOut", duration: 0.4 },
};

export const EXIT_PRESETS: Record<string, ExitPreset> = {
  "exit-slide-along-gutter": { arcHeight: 0, rotateTo: 0, duration: 0.5, ease: "easeInOut" },
  "exit-arc-jump-adjacent-panel": { arcHeight: -70, rotateTo: 30, duration: 0.55, ease: "circOut" },
  "exit-roll-down-tilted-panel": { arcHeight: 45, rotateTo: 220, duration: 0.5, ease: "easeInOut" },
  "resolve-final-settle": { arcHeight: 0, rotateTo: 0, duration: 0.7, ease: "backOut" },
};

export const DEFAULT_ENTRY: EntryPreset = ENTRY_PRESETS["arrive-border-notch-ready"];
export const DEFAULT_EXIT: ExitPreset = EXIT_PRESETS["exit-slide-along-gutter"];

// Abbreviated repeat: once a panel has been visited, subsequent transitions
// into it are faster and less showy (per RouteBallProvider's hasBeenVisited).
export function abbreviate(preset: ExitPreset): ExitPreset {
  return { ...preset, duration: Math.max(0.18, preset.duration * 0.45), arcHeight: preset.arcHeight * 0.5 };
}
