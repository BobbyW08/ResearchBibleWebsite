export type PainPoint = {
  slug: string;
  title: string;
  label: string;
  body: string;
};

// Only 3 pain points have real copy so far (from homepage-copy.md). The
// remaining 8 slugs listed in CLAUDE.md's Pain Point Pages table still need
// a template + real copy pass before they can be added here.
export const painPoints: PainPoint[] = [
  {
    slug: "morning-meltdowns",
    title: "Morning Meltdowns",
    label: "Mornings feel impossible",
    body: "Every morning is a battle — getting out of bed, getting dressed, getting out the door. By the time they leave, you're already exhausted.",
  },
  {
    slug: "wont-listen",
    title: "My Kid Won't Listen",
    label: "Nothing I say lands",
    body: "You give a direction. They ignore it, argue it, or melt down. You've tried calm, firm, rewards, consequences. Nothing sticks.",
  },
  {
    slug: "after-school-explosions",
    title: "After-School Explosions",
    label: "They hold it together all day, then fall apart at home",
    body: "School is fine, teachers say. But the moment they walk in the door, everything unravels. You've become the safe place for every emotion they've stored up all day.",
  },
];

export function getPainPoint(slug: string): PainPoint | undefined {
  return painPoints.find((p) => p.slug === slug);
}
