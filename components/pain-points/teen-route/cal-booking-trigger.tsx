"use client";

import { useEffect, type ReactNode } from "react";
import { CAL_COM_INTRO_CALL_SLUG } from "@/lib/links";

const CAL_NAMESPACE = "intro-call";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cal?: any;
  }
}

// Cal.com's official popup-embed loader, transliterated to TS. New to this
// codebase — every other Cal.com usage site-wide is a plain outbound
// <Link target="_blank">; this popup pattern is scoped to the teen page's
// pinned CTA panel only, per claude-code-handoff-v8.md.
function loadCalEmbed() {
  if (typeof window === "undefined" || window.Cal) return;

  const cal = function (...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cal as any).q = (cal as any).q || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cal as any).q.push(args);
  };
  window.Cal = cal;
  window.Cal.loaded = true;

  const script = document.createElement("script");
  script.src = "https://app.cal.com/embed/embed.js";
  script.async = true;
  document.head.appendChild(script);

  window.Cal("init", CAL_NAMESPACE, { origin: "https://cal.com" });
}

function useCalEmbed() {
  useEffect(() => {
    loadCalEmbed();
  }, []);
}

function CalBookingTrigger({ className, children }: { className?: string; children: ReactNode }) {
  useCalEmbed();

  return (
    <button
      type="button"
      data-cal-link={CAL_COM_INTRO_CALL_SLUG}
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-config='{"layout":"month_view"}'
      className={className}
    >
      {children}
    </button>
  );
}

export default CalBookingTrigger;
