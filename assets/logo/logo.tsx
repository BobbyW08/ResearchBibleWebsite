import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** "lg" is the large, load-in wordmark used by the homepage Proof Wall hero
   * before it shrinks into the header on scroll (see components/marketing/hero.tsx
   * and header.tsx's logoAnimatesIn prop). Everywhere else uses the default size. */
  size?: "default" | "lg";
  /** Renders against the near-black hero field instead of the page background. */
  onDark?: boolean;
};

function Logo({ className, size = "default", onDark = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "rounded-full bg-primary",
          size === "lg" ? "h-3.5 w-3.5 sm:h-5 sm:w-5" : "h-2 w-2",
        )}
      />
      <span
        className={cn(
          "font-heading font-medium tracking-tight",
          onDark ? "text-brand-offwhite" : "text-foreground",
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
