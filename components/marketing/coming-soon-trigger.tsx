"use client";

import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ComingSoonTriggerProps = {
  label: string;
  className?: string;
  children: ReactNode;
};

function ComingSoonTrigger({ label, className, children }: ComingSoonTriggerProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            disabled
            aria-disabled="true"
            aria-label={`${label} — coming soon`}
            className={cn(
              "inline-flex cursor-default items-center gap-1.5 opacity-50",
              className,
            )}
          />
        }
      >
        {children}
        <span className="text-[10px] font-medium sm:hidden">Soon</span>
      </TooltipTrigger>
      <TooltipContent>Coming soon</TooltipContent>
    </Tooltip>
  );
}

export default ComingSoonTrigger;
