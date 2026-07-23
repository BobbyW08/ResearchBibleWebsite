"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Compass, HeartHandshake, LucideIcon } from "lucide-react";
import { motion } from "motion/react";

type Pillar = {
  icon: LucideIcon;
  title: string;
  color: string;
};

const pillars: Pillar[] = [
  {
    icon: BookOpen,
    title: "Evidence-based",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: HeartHandshake,
    title: "Neurodivergent-affirming",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Compass,
    title: "Practical",
    color: "bg-accent/10 text-accent-foreground",
  },
];

function About() {
  return (
    <section className="lg:py-20 sm:py-16 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground text-center tracking-tight">
            Built for parents and caregivers raising neurodivergent kids —
            grounded in
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4">
            {pillars.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-3 px-6 py-2 rounded-full",
                  item.color,
                )}
              >
                <item.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="text-2xl font-medium italic">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
