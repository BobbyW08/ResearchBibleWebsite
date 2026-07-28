"use client";

import { useRef, useState, type ReactNode, type TouchEvent } from "react";
import { cn } from "@/lib/utils";

type SwipeCarouselProps = {
  items: ReactNode[];
  className?: string;
};

const SWIPE_THRESHOLD_PX = 40;

// Touch-driven carousel for small screens — grid layouts take over at md:.
function SwipeCarousel({ items, className }: SwipeCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const goTo = (next: number) => {
    setIndex(Math.max(0, Math.min(items.length - 1, next)));
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = event.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > SWIPE_THRESHOLD_PX) {
      goTo(index - 1);
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD_PX) {
      goTo(index + 1);
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item, i) => (
            <div key={i} className="w-full shrink-0 px-1">
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-6 bg-secondary" : "w-2 bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default SwipeCarousel;
