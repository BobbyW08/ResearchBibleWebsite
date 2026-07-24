"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
}

const COLUMN_CLASS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

/**
 * Responsive image grid with a click-to-expand lightbox.
 * Template — drop any topic's figures/photos into MDX prose via `images`.
 */
export function ImageGallery({ images, columns = 3 }: ImageGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      <div className={`not-prose grid grid-cols-2 gap-3 ${COLUMN_CLASS[columns]}`}>
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(min-width: 640px) 25vw, 50vw"
            />
          </button>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent className="max-w-2xl p-2">
          <DialogTitle className="sr-only">{active?.alt ?? "Image preview"}</DialogTitle>
          {active ? (
            <div className="flex flex-col gap-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image src={active.src} alt={active.alt} fill className="object-contain" />
              </div>
              {active.caption ? (
                <p className="px-2 pb-2 text-sm text-muted-foreground">{active.caption}</p>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
