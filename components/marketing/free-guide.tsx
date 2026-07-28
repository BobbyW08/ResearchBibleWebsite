"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

function FreeGuide() {
  return (
    <section id="free-guide">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col items-center gap-5 rounded-lg border border-border bg-card px-6 py-12 text-center sm:px-12"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-secondary">
            <Sparkles className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
            Start free, no strings attached
          </h2>
          <p className="max-w-xl text-base font-normal text-muted-foreground">
            Every guide opens with a free chapter. Read it, try one thing this
            week, and see if it fits before you commit to anything else.
          </p>
          <Link
            href="/docs/adhd"
            className={buttonVariants({ size: "lg" })}
          >
            Read the first chapter free
          </Link>
          <p className="text-sm text-muted-foreground">
            No credit card. No account needed to start.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default FreeGuide;
