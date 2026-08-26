import Image from "next/image";
import { cn } from "@/lib/utils";

import iconGray from "./BWPSLogoGray.svg";
import iconWhite from "./BWPSLogoWhite.svg";
import iconRed from "./BWPSLogoRed.svg";
import iconGradient from "./BWPSLogoGradient.svg";
import subtitleOffWhite from "./BWPSSubtitleOffWhite.svg";
import subtitleGrey from "./BWPSSubtitleGrey.svg";

// Real BWPS mark files (see homepage-redesign-v5.md Section 2). The four
// "icon" files cycle as the color variant during the Proof Wall hero's
// scroll-linked shrink; the two "subtitle" wordmark files pair with the red
// icon for the persistent header lockup once the hero hands off.
export type LogoVariant = "gray" | "white" | "red" | "gradient";

const ICONS: Record<LogoVariant, typeof iconRed> = {
  gray: iconGray,
  white: iconWhite,
  red: iconRed,
  gradient: iconGradient,
};

type LogoProps = {
  className?: string;
  /** "lg" is the large, load-in mark used by the homepage Proof Wall hero
   * before it shrinks/hands off into the header on scroll (see
   * components/marketing/proof-wall-hero.tsx and header.tsx's logoAnimatesIn
   * prop). Everywhere else uses the default (header) size. */
  size?: "default" | "lg";
  /** Chooses the subtitle wordmark color when `lockup` is on: off-white while
   * still blended with the dark hero field, grey once on the light sticky
   * pill / any other page's header. */
  onDark?: boolean;
  /** Icon color variant, cycled during the hero's scroll transition. Ignored
   * when `lockup` is on — the landed lockup always uses the red icon. */
  variant?: LogoVariant;
  /** Renders the persistent two-part header lockup (red icon + subtitle
   * wordmark) instead of the bare cycling icon mark. Default true — every
   * call site except the Proof Wall hero's big scroll-cycling mark wants
   * this landed state. */
  lockup?: boolean;
};

function Logo({ className, size = "default", onDark = false, variant, lockup = true }: LogoProps) {
  if (!lockup) {
    const icon = ICONS[variant ?? "red"];
    return (
      <span className={cn("inline-flex items-center", className)}>
        <Image
          src={icon}
          alt="Bobby Washburn Parenting Support"
          priority={size === "lg"}
          className={cn("h-auto w-auto", size === "lg" ? "max-h-16 sm:max-h-24 md:max-h-28" : "max-h-8")}
        />
      </span>
    );
  }

  const subtitle = onDark ? subtitleOffWhite : subtitleGrey;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image src={iconRed} alt="" aria-hidden className="h-8 w-auto" />
      <Image
        src={subtitle}
        alt="Bobby Washburn Parenting Support"
        className="h-3.5 w-auto sm:h-4"
      />
    </span>
  );
}

export default Logo;
