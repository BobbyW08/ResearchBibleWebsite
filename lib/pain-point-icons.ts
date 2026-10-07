import {
  Flame,
  Smartphone,
  Ear,
  CloudLightning,
  Moon,
  Pencil,
  Hand,
  Clock,
  Angry,
  HeartCrack,
  Globe,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

// Keep in sync with the approved icon list in src/payload/collections/PainPoints.ts.
export const PAIN_POINT_ICONS = {
  Flame,
  Smartphone,
  Ear,
  CloudLightning,
  Moon,
  Pencil,
  Hand,
  Clock,
  Angry,
  HeartCrack,
  Globe,
  TrendingUp,
} satisfies Record<string, LucideIcon>;

export type PainPointIconName = keyof typeof PAIN_POINT_ICONS;

export function resolvePainPointIcon(name: string): LucideIcon {
  return PAIN_POINT_ICONS[name as PainPointIconName] ?? Flame;
}
