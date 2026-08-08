"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

function FadeInView({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default FadeInView;
