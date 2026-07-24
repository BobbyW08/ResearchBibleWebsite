"use client";

import { useState } from "react";
import { PlayIcon } from "lucide-react";

export interface VideoEmbedProps {
  /** Embed URL, e.g. `https://www.youtube.com/embed/VIDEO_ID` or a Vimeo player URL. */
  src: string;
  title: string;
  /** Optional poster image shown before the viewer clicks to load the iframe. */
  poster?: string;
}

/**
 * Responsive 16:9 video embed with a click-to-load facade — the iframe isn't
 * mounted until the viewer interacts, so the page doesn't pay for autoplay
 * scripts/tracking pixels on load.
 * Template — reusable for any topic's embedded video.
 */
export function VideoEmbed({ src, title, poster }: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="not-prose relative aspect-video w-full overflow-hidden rounded-md border border-border bg-muted">
      {loaded ? (
        <iframe
          src={`${src}${src.includes("?") ? "&" : "?"}autoplay=1`}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group flex h-full w-full items-center justify-center"
          style={
            poster
              ? { backgroundImage: `url(${poster})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-foreground/90 text-background transition-transform group-hover:scale-110">
            <PlayIcon className="ml-0.5 size-6" fill="currentColor" />
          </span>
          <span className="sr-only">Play {title}</span>
        </button>
      )}
    </div>
  );
}
