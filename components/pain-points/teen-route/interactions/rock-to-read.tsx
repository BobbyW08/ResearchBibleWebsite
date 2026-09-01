"use client";

import type { ReactNode } from "react";
import { useAnimate, useReducedMotion } from "motion/react";

// Tactile click feedback for panels whose full content is already visible
// in the tile — no more to reveal, so growth doesn't apply. A quick,
// small rotation-based wiggle confirms the tap registered without changing
// the panel's size or position. Reduced motion swaps the rotation for a
// brief opacity pulse. Per claude/pain-point-newspaper-layout-v9.md Part 2B.
function RockToRead({ children, className }: { children: ReactNode; className?: string }) {
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();

  function rock() {
    if (reduceMotion) {
      void animate(scope.current, { opacity: [1, 0.85, 1] }, { duration: 0.3, ease: "easeInOut" });
    } else {
      void animate(
        scope.current,
        { rotate: [0, -1.5, 1.5, -1, 0] },
        { duration: 0.35, ease: "easeInOut" },
      );
    }
  }

  return (
    <div
      ref={scope}
      role="button"
      tabIndex={0}
      onClick={rock}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          rock();
        }
      }}
      className={className ?? "flex h-full w-full flex-1 flex-col"}
    >
      {children}
    </div>
  );
}

export default RockToRead;
