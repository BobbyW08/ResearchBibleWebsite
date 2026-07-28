"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import { motion, useInView } from "motion/react";

function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef}>
      <div className="max-w-7xl mx-auto sm:px-16 px-4 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
          className="flex flex-col gap-3"
        >
          <Badge className="text-sm h-auto py-1 px-3 border-0 w-fit">
            Testimonials
          </Badge>
          <h2 className="font-heading sm:text-5xl text-2xl leading-none font-medium tracking-tight">
            Success Stories
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
          className="pt-12"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6 rounded-lg border border-dashed border-border p-8">
            <Quote className="shrink-0 w-8 h-8 text-secondary" strokeWidth={1.5} />
            <div className="flex flex-col gap-6">
              <p className="sm:text-2xl text-lg text-muted-foreground">
                This space is reserved for a real client testimonial — swap
                this placeholder out before launch.
              </p>
              <div>
                <p className="text-base font-medium">Client name</p>
                <p className="text-sm text-muted-foreground">Parent</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;
