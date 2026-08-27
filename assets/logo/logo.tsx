import Image from "next/image";
import { cn } from "@/lib/utils";

import iconRed from "./BWPSLogoRed.svg";
import subtitleOffWhite from "./BWPSSubtitleOffWhite.svg";
import subtitleGrey from "./BWPSSubtitleGrey.svg";

type LogoProps = {
  className?: string;
  /** Chooses the subtitle wordmark color: off-white while still blended with
   * a dark field, grey once on the light sticky header pill / any other
   * page's header. */
  onDark?: boolean;
};

// Persistent red-icon + subtitle-wordmark lockup, used on every page.
//
// The wordmark SVG is a ~16:1 aspect-ratio slug ("Bobby Washburn Parent
// Support"), so even at a small fixed height it renders 200px+ wide. Paired
// with the icon, that's wider than a phone header has room for alongside the
// nav's hamburger trigger / CTA — the wordmark was rendering underneath the
// mobile menu button. Hidden below `sm` so phone headers show icon-only; the
// wrapping <Link>'s aria-label (see header.tsx / footer.tsx) still carries
// the full name for assistive tech either way.
function Logo({ className, onDark = false }: LogoProps) {
  const subtitle = onDark ? subtitleOffWhite : subtitleGrey;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image src={iconRed} alt="" aria-hidden className="h-7 w-auto sm:h-8" />
      <Image
        src={subtitle}
        alt="Bobby Washburn Parenting Support"
        className="hidden h-3.5 w-auto sm:block sm:h-4"
      />
    </span>
  );
}

export default Logo;
