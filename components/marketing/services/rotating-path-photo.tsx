"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

import p1 from "@/assets/paths/absent-wall-gcwGf1YURvE-unsplash.jpg";
import p2 from "@/assets/paths/adam-borkowski-68BZvFkox90-unsplash.jpg";
import p3 from "@/assets/paths/adam-borkowski-CAdqh5k-XUY-unsplash.jpg";
import p4 from "@/assets/paths/adam-borkowski-r8KVTuFTv0Q-unsplash.jpg";
import p5 from "@/assets/paths/adrien-tutin-x8xJpClTvR0-unsplash.jpg";
import p6 from "@/assets/paths/alice-donovan-rouse-pZ61ZA8QgcY-unsplash.jpg";
import p7 from "@/assets/paths/caleb-smith-p9JHJ2DAl5c-unsplash.jpg";
import p8 from "@/assets/paths/daniel-j-schwarz-EswLMnbV7GU-unsplash.jpg";
import p9 from "@/assets/paths/engin-yapici-eV0tHL4Xtas-unsplash.jpg";
import p10 from "@/assets/paths/jack-skinner-HKQVX9_JupM-unsplash.jpg";
import p11 from "@/assets/paths/jens-lelie-u0vgcIOQG08-unsplash.jpg";
import p12 from "@/assets/paths/johannes-plenio-P1Iz3unD6Po-unsplash.jpg";
import p13 from "@/assets/paths/karsten-wurth-HiE1bIIoRqQ-unsplash.jpg";
import p14 from "@/assets/paths/lili-popper-lu15z1m_KfM-unsplash.jpg";
import p15 from "@/assets/paths/lisha-riabinina-FGmHQlJsMOg-unsplash.jpg";
import p16 from "@/assets/paths/maksim-shutov-H8vhhepiiaU-unsplash.jpg";
import p17 from "@/assets/paths/patrick-fore-74TufExdP3Y-unsplash.jpg";
import p18 from "@/assets/paths/peter-robbins-3X8bZVDhI3Q-unsplash.jpg";
import p19 from "@/assets/paths/pexels-olavi-anttila-264846761-12717499.jpg";
import p20 from "@/assets/paths/yevhenii-dubrovskyi-5px2ZOqysn4-unsplash.jpg";

const PATH_PHOTOS = [
  p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
  p11, p12, p13, p14, p15, p16, p17, p18, p19, p20,
];

const ROTATE_INTERVAL_MS = 3000;

type RotatingPathPhotoProps = {
  alt: string;
  className?: string;
};

// Rotates through the "Paths" photo set on a fixed timer, independent of
// scroll position — used in place of a static photo wherever "the path" is
// visualized (currently the "We Build [photo] Your Path" services hero
// headline — see wedged-hero-headline.tsx).
function RotatingPathPhoto({ alt, className }: RotatingPathPhotoProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % PATH_PHOTOS.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={cn("relative inline-block overflow-hidden", className)}>
      <AnimatePresence initial={false}>
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image src={PATH_PHOTOS[index]} alt={alt} fill sizes="96px" className="object-cover" />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default RotatingPathPhoto;
