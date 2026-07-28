"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Compass, HeartHandshake, LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import PlaceholderPhoto from "@/components/marketing/placeholder-photo";

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
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <PlaceholderPhoto
              alt="Photo of Bobby sitting on the floor playing with a child, both smiling"
              className="aspect-4/3 w-full rounded-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col items-start gap-5"
          >
            <Badge variant="outline" className="h-auto px-3 py-1 text-sm">
              Meet Bobby
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
              Someone who&apos;s been in the trenches with you
            </h2>
            <p className="text-base font-normal text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-base font-normal text-muted-foreground">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {pillars.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-full",
                    item.color,
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
