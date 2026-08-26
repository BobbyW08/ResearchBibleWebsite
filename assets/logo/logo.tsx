import { cn } from "@/lib/utils";

// Text-based stand-in for the real BWPS mark. homepage-redesign-v3.md's Logo
// Behavior section calls for cycling through four provided SVG variants
// (BWPSLogoGray/White/Red/Gradient) during the scroll-linked shrink — those
// SVG files haven't been dropped into assets/logo/ yet, so `variant` drives
// this text mark's color the same way the real SVGs would cycle. Swapping in
// the real files means replacing this component's internals only — every
// call site (`<Logo variant="..." />`) stays the same.
export type LogoVariant = "gray" | "white" | "red" | "gradient";

const VARIANT_DOT_CLASS: Record<LogoVariant, string> = {
  gray: "bg-muted-foreground",
  white: "bg-brand-offwhite",
  red: "bg-primary",
  gradient: "bg-brand-gradient",
};

const VARIANT_TEXT_CLASS: Record<LogoVariant, string> = {
  gray: "text-muted-foreground",
  white: "text-brand-offwhite",
  red: "text-primary",
  gradient: "text-primary",
};

type LogoProps = {
  className?: string;
  /** "lg" is the large, load-in wordmark used by the homepage Proof Wall hero
   * before it shrinks into the header on scroll (see components/marketing/hero.tsx
   * and header.tsx's logoAnimatesIn prop). Everywhere else uses the default size. */
  size?: "default" | "lg";
  /** Renders against the near-black hero field instead of the page background. */
  onDark?: boolean;
  /** Color variant — see LogoVariant above. Defaults to the onDark/light-aware
   * static color used everywhere the logo isn't mid scroll-transition. */
  variant?: LogoVariant;
};

function Logo({ className, size = "default", onDark = false, variant }: LogoProps) {
  const dotClass = variant ? VARIANT_DOT_CLASS[variant] : "bg-primary";
  const textClass = variant ? VARIANT_TEXT_CLASS[variant] : onDark ? "text-brand-offwhite" : "text-foreground";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "rounded-full",
          dotClass,
          size === "lg" ? "h-3.5 w-3.5 sm:h-5 sm:w-5" : "h-2 w-2",
        )}
      />
      <span
        className={cn(
          "font-heading font-medium tracking-tight",
          textClass,
          size === "lg" ? "text-2xl sm:text-4xl md:text-5xl" : "text-base",
        )}
      >
        <span className={size === "lg" ? "" : "md:hidden"}>Bobby Washburn</span>
        <span className={size === "lg" ? "hidden" : "hidden md:inline"}>
          Bobby Washburn Parenting Support
        </span>
      </span>
    </div>
  );
}

export default Logo;
