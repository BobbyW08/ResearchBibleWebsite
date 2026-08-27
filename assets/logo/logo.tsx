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
function Logo({ className, onDark = false }: LogoProps) {
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
