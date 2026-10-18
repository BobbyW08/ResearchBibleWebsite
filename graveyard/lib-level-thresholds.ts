// Points required to reach each level. Level 1 is always 0.
// Adjust these values before launch; do not change the shape.
export const LEVEL_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 50,
  3: 150,
  4: 400,
  5: 900,
  6: 1800,
  7: 3200,
};

export function levelFromPoints(points: number): number {
  let level = 1;
  for (const [lvl, threshold] of Object.entries(LEVEL_THRESHOLDS)) {
    if (points >= threshold) level = Number(lvl);
  }
  return level;
}
