"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { motion } from "motion/react";
import { InstagramIcon, SubstackIcon } from "@/components/marketing/social-icons";

type ConnectTile = {
  icon: ComponentType;
  label: string;
  body: string;
  cta: string;
  href: string;
};

const tiles: ConnectTile[] = [
  {
    icon: SubstackIcon,
    label: "Read the newsletter",
    body: "Parenting insights, real talk, and practical strategies — no jargon, no fluff.",
    cta: "Follow on Substack",
    href: "https://roughlyeducated.substack.com/",
  },
  {
    icon: InstagramIcon,
    label: "Follow on Instagram",
    body: "Short, honest content for parents navigating the hard stuff. Show up when you need a reminder you're not alone.",
    cta: "Follow on Instagram",
    href: "https://www.instagram.com/bobby__washburn/",
  },
  {
    icon: Calendar,
    label: "Reach out to Bobby",
    body: "Not sure where to start? Book a free 30-minute call. No pressure, no pitch — just a conversation.",
    cta: "Book a Call",
    href: "https://cal.com/bobby-washburn/intro-call",
  },
];

function Connect() {
  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-24">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 text-center"
        >
          <Badge variant="outline" className="h-auto px-3 py-1 text-sm">
            Connect
          </Badge>
          <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
            Want to keep going?
          </h2>
          <p className="text-base font-normal text-muted-foreground">
            There&apos;s more where this came from. Follow along, go deeper,
            or just reach out.
          </p>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3"
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
              <Card className="h-full py-10">
                <CardContent className="flex flex-col gap-4 px-8">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-secondary">
                    <tile.icon />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-lg font-medium">
                      {tile.label}
                    </h3>
                    <p className="text-base font-normal text-muted-foreground">
                      {tile.body}
                    </p>
                  </div>
                  <Link
                    href={tile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-secondary transition-all hover:gap-2"
                  >
                    {tile.cta} →
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Connect;
