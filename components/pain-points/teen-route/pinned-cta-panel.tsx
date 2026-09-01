"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CalendarClock, Download, Mail, Plus } from "lucide-react";
import NewsletterDialog from "@/components/marketing/newsletter-dialog";
import { DeeperLinks } from "@/components/marketing/pain-point-content";
import type { LinkRef } from "@/lib/pain-points";
import CalBookingTrigger from "./cal-booking-trigger";
import JoinGroupWidget from "./join-group-widget";

// Modeled and named separately from the panel-08 `cta`-typed RouteCtaPanel —
// this is the pinned conversion element (Book a Session / Newsletter / Join
// the Group / Go Deeper / PDF), not the page's final content panel. Two
// states of one element: expanded in-flow on load, collapsed pinned badge
// once its sentinel scrolls out of view; toggles freely with scroll
// direction rather than locking permanently (unlike the Services page's
// "Together" section — see claude-code-handoff-v8.md Part B6).
function PinnedCtaPanel({ deepDive, related }: { deepDive?: LinkRef; related: LinkRef[] }) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [pdfState, setPdfState] = useState<"idle" | "coming-soon">("idle");

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setExpanded(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (pdfState !== "coming-soon") return;
    const timeout = setTimeout(() => setPdfState("idle"), 2000);
    return () => clearTimeout(timeout);
  }, [pdfState]);

  const menuContent = (
    <>
      <CalBookingTrigger className="flex w-full items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85">
        <CalendarClock className="h-4 w-4 shrink-0" />
        Book a session
      </CalBookingTrigger>

      <NewsletterDialog triggerClassName="flex w-full items-center gap-2 rounded-md border border-brand-black/15 px-4 py-2.5 text-left text-sm font-semibold text-brand-black transition-colors hover:border-primary/40">
        <Mail className="h-4 w-4 shrink-0" />
        Join the newsletter
      </NewsletterDialog>

      <JoinGroupWidget />

      <button
        type="button"
        onClick={() => setPdfState("coming-soon")}
        className="flex w-full items-center gap-2 rounded-md bg-primary/10 px-4 py-2.5 text-left text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
      >
        <Download className="h-4 w-4 shrink-0" />
        {pdfState === "coming-soon" ? "Coming soon" : "Download your copy (PDF)"}
      </button>

      <DeeperLinks heading="Go deeper" deepDive={deepDive} related={related} />

      {/* Disclaimer intentionally omitted — copy/placement not yet approved.
          See claude-code-handoff-v8.md's "What's intentionally left open." */}
    </>
  );

  return (
    <>
      <div ref={sentinelRef} className="pointer-events-none absolute right-0 top-0 h-px w-px" />

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="absolute right-3 top-3 z-30 hidden w-80 flex-col gap-3 bg-brand-offwhite p-5 shadow-xl sm:right-6 sm:top-6 lg:flex"
          >
            {menuContent}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25 }}
            onHoverStart={() => setBadgeOpen(true)}
            onHoverEnd={() => setBadgeOpen(false)}
            className="fixed right-4 top-24 z-40 hidden lg:block"
          >
            {badgeOpen ? (
              <div className="flex w-80 flex-col gap-3 rounded-l-2xl bg-brand-offwhite p-5 shadow-2xl">
                {menuContent}
              </div>
            ) : (
              <div
                id="pinned-cta-badge"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl"
              >
                <Plus className="h-5 w-5" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PinnedCtaPanel;
