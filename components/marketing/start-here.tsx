"use client";

import Link from "next/link";
import { ArrowUpRight, ShieldCheck, HeartHandshake, Handshake, Building2 } from "lucide-react";
import { motion } from "motion/react";
import FadeInView from "@/components/marketing/fade-in-view";

type StartHereTile = {
  icon: typeof ShieldCheck;
  label: string;
  body: string;
  href: string;
};

const tiles: StartHereTile[] = [
  {
    icon: ShieldCheck,
    label: "Tech Safety Tool",
    body: "Cutting kids off from technology is one of today's most useful tools parents have at our fingertips. Learn how to get control of those screens, device by device.",
    href: "/tech-safety",
  },
  {
    icon: HeartHandshake,
    label: "Common Pain Points",
    body: "I've worked with a lot of families, and so many of us have the same issues. Start learning how to shift those undesired behaviors.",
    href: "/common-pain-points",
  },
  {
    icon: Handshake,
    label: "Services",
    body: "See how we can work together: groups, one-on-one sessions, Live Q&As, and more.",
    href: "/services",
  },
  {
    icon: Building2,
    label: "Organizations",
    body: "Bring peer-support training or workshops to your team or agency.",
    href: "/services/organizations",
  },
];

function StartHere() {
  return (
    <section id="start-here" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
        <FadeInView className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Start Here</p>
          <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
            Where can you use support today?
          </h2>
        </FadeInView>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {tiles.map((tile) => (
            <motion.div
              key={tile.label}
              variants={{
                hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
                show: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <Link
                href={tile.href}
                className="group flex h-full flex-col gap-4 rounded-lg border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <tile.icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-medium text-foreground">{tile.label}</h3>
                  <p className="mt-1.5 text-sm font-normal text-muted-foreground">{tile.body}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default StartHere;
