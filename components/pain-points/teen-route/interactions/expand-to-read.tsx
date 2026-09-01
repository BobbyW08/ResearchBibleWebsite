"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

// "Grow" interaction for panels whose full copy doesn't fit their grid tile.
// Collapsed state is a clamped preview (rendered by the caller — usually a
// heading plus a `line-clamp-*` paragraph) with a visible "Read more"
// affordance; clicking (or Enter/Space while focused) pops open a large,
// inset — not full-bleed — centered card that scales in from the clicked
// tile's position, per claude/pain-point-newspaper-layout-v9.md Part 2A.
// Close via the × control, clicking the scrim, or Escape.
//
// Deliberately no `AnimatePresence`/`exit` on the overlay: testing showed
// that with this component tree, the exit animation's completion never
// fires — Motion animates the overlay's opacity down to 0 correctly, but
// AnimatePresence never removes it from the DOM, leaving an invisible,
// `fixed inset-0` `pointer-events: auto` layer stacking up on every open.
// The open animation (a scale/opacity pop, computed from the trigger's own
// bounding rect for a "grows from where you clicked" feel) isn't affected —
// only unmount-on-exit is — so entrance keeps its animation and close is a
// plain, immediate unmount instead.
function ExpandToRead({
  preview,
  full,
  label,
}: {
  preview: ReactNode;
  full: ReactNode;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const reduceMotion = useReducedMotion();
  const triggerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function openFromTrigger() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect && typeof window !== "undefined") {
      setOrigin({
        x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
        y: ((rect.top + rect.height / 2) / window.innerHeight) * 100,
      });
    }
    setOpen(true);
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        onClick={openFromTrigger}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFromTrigger();
          }
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex h-full w-full flex-1 flex-col items-start text-left"
      >
        {preview}
      </div>

      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-black/70 p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
          onClick={close}
        >
          <motion.div
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto bg-brand-offwhite p-6 text-brand-black shadow-2xl sm:p-10"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-black/5 text-brand-black transition-colors hover:bg-brand-black/10"
            >
              <X className="h-4 w-4" />
            </button>
            {full}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export default ExpandToRead;
