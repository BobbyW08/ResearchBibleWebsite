"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

// Substack embed still needs to be wired in — see CLAUDE.md "Subscribe" row.
function SubscribePrompt() {
  return (
    <section id="subscribe" className="border-t border-border bg-card">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col items-center gap-4"
        >
          <Badge variant="outline" className="h-auto px-3 py-1 text-sm">
            Subscribe
          </Badge>
          <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
            Want the rest of the story?
          </h2>
          <p className="max-w-xl text-base font-normal text-muted-foreground">
            Subscribe to unlock every guide, get new research as it lands, and
            hear what&apos;s actually working for other families.
          </p>
          <div className="mt-2 flex w-full max-w-sm flex-col gap-3 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            Substack embed goes here
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default SubscribePrompt;
