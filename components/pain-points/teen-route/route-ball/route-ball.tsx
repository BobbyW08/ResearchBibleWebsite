"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { useRouteBall } from "./route-ball-provider";
import { abbreviate, DEFAULT_ENTRY, DEFAULT_EXIT, ENTRY_PRESETS, EXIT_PRESETS } from "./presets";
import { TEEN_PANELS } from "@/lib/pain-points/teen-rebellion-panels";

const BALL_SIZE = 18;
const GOLD = "#FFCD0D";

function panelById(id: string) {
  return TEEN_PANELS.find((panel) => panel.id === id);
}

function prefersReducedMotionNow() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function RouteBall() {
  const {
    activePanelId,
    getAnchorPoint,
    hasBeenVisited,
    markVisited,
    guidedMotion,
    setGuidedMotion,
    transitionNonce,
  } = useRouteBall();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const scale = useMotionValue(0);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);

  const prevPanelIdRef = useRef<string | null>(null);
  const nonceRef = useRef(0);

  useEffect(() => {
    nonceRef.current += 1;
    const myNonce = nonceRef.current;
    if (!activePanelId) return;

    const maybeNextPanel = panelById(activePanelId);
    if (!maybeNextPanel || maybeNextPanel.type === "support-signals") return;
    const nextPanel = maybeNextPanel;

    const reduced = guidedMotion === "reduced" || (guidedMotion === "system" && prefersReducedMotionNow());
    const prevId = prevPanelIdRef.current;
    const prevPanel = prevId ? panelById(prevId) : null;

    const maybeEntryPoint = getAnchorPoint(nextPanel.id, "entry", nextPanel.entryAnchor);
    const maybeActivePoint = getAnchorPoint(nextPanel.id, "active", nextPanel.activeAnchor);
    if (!maybeEntryPoint || !maybeActivePoint) return;
    const entryPoint = maybeEntryPoint;
    const activePoint = maybeActivePoint;

    const entryPreset = ENTRY_PRESETS[nextPanel.ballEntry] ?? DEFAULT_ENTRY;
    let exitPreset =
      prevPanel && prevPanel.type !== "support-signals" ? EXIT_PRESETS[prevPanel.ballExit] ?? DEFAULT_EXIT : DEFAULT_EXIT;
    if (hasBeenVisited(nextPanel.id)) exitPreset = abbreviate(exitPreset);

    async function run() {
      if (reduced) {
        x.set(activePoint.x - BALL_SIZE / 2);
        y.set(activePoint.y - BALL_SIZE / 2);
        rotate.set(0);
        scale.set(1);
        readyRef.current = true;
        setReady(true);
        markVisited(nextPanel.id);
        prevPanelIdRef.current = nextPanel.id;
        return;
      }

      const exitPoint =
        prevPanel && prevPanel.type !== "support-signals"
          ? getAnchorPoint(prevPanel.id, "exit", prevPanel.exitAnchor)
          : null;

      const hadOrigin = readyRef.current;
      if (!hadOrigin) {
        // First appearance: fade/scale in directly at the entry anchor.
        x.set(entryPoint.x - BALL_SIZE / 2);
        y.set(entryPoint.y - BALL_SIZE / 2);
        rotate.set(entryPreset.rotateFrom);
        scale.set(entryPreset.scaleFrom);
        readyRef.current = true;
        setReady(true);
      }

      // Leg 1 — exit the previous panel along its own exit preset's arc.
      if (hadOrigin && exitPoint) {
        const midY = Math.min(y.get(), exitPoint.y) + exitPreset.arcHeight;
        await Promise.all([
          animate(x, [x.get(), exitPoint.x], { duration: exitPreset.duration * 0.5, ease: "easeInOut" }),
          animate(y, [y.get(), midY, exitPoint.y], { duration: exitPreset.duration, ease: "easeInOut" }),
          animate(rotate, exitPreset.rotateTo, { duration: exitPreset.duration, ease: "easeInOut" }),
        ]);
      }
      if (nonceRef.current !== myNonce) return;

      // Leg 2 — arrive at the next panel's entry anchor per its entry preset.
      await Promise.all([
        animate(x, entryPoint.x - BALL_SIZE / 2, { duration: entryPreset.duration, ease: entryPreset.ease }),
        animate(y, entryPoint.y - BALL_SIZE / 2, { duration: entryPreset.duration, ease: entryPreset.ease }),
        animate(rotate, 0, { duration: entryPreset.duration, ease: entryPreset.ease }),
        animate(scale, 1, { duration: entryPreset.duration, ease: entryPreset.ease }),
      ]);
      if (nonceRef.current !== myNonce) return;

      // Leg 3 — settle to the active anchor and dwell (≥350ms handled by the
      // caller not re-triggering until the active panel genuinely changes).
      await Promise.all([
        animate(x, activePoint.x - BALL_SIZE / 2, { duration: 0.3, ease: "easeOut" }),
        animate(y, activePoint.y - BALL_SIZE / 2, { duration: 0.3, ease: "easeOut" }),
      ]);

      markVisited(nextPanel.id);
      prevPanelIdRef.current = nextPanel.id;
    }

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePanelId, transitionNonce, guidedMotion]);

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden rounded-full lg:block"
        style={{
          width: BALL_SIZE,
          height: BALL_SIZE,
          backgroundColor: GOLD,
          boxShadow: "0 0 0 3px rgba(255,205,13,0.25)",
          opacity: ready ? 1 : 0,
          x,
          y,
          rotate,
          scale,
        }}
        transition={{ opacity: { duration: 0.2 } }}
      />
      <div className="fixed bottom-4 left-4 z-40 hidden rounded-full border border-white/20 bg-brand-black/80 p-1 text-[11px] text-brand-offwhite backdrop-blur lg:flex">
        {(["system", "on", "reduced"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setGuidedMotion(mode)}
            className={`rounded-full px-2.5 py-1 capitalize transition-colors ${
              guidedMotion === mode ? "bg-brand-offwhite text-brand-black" : "text-brand-offwhite/70 hover:text-brand-offwhite"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </>
  );
}

export default RouteBall;
