"use client";

import Link from "next/link";
import { ArrowRight, Award, BookOpen, HeartHandshake, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import PlaceholderPhoto from "@/components/marketing/placeholder-photo";

type Pill = {
  icon: LucideIcon;
  title: string;
  color: string;
};

const pills: Pill[] = [
  {
    icon: BookOpen,
    title: "Evidence-based",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: HeartHandshake,
    title: "Peer Support",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Award,
    title: "CPRS",
    color: "bg-accent/10 text-accent-foreground",
  },
];

function MeetBobby() {
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
              alt="Photo of Bobby Washburn"
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
              Someone who&apos;s been on both sides of this.
            </h2>
            <p className="text-base font-normal text-muted-foreground">
              I grew up as the kid that parents didn&apos;t know what to do
              with. ADHD, depression, substance use — I was in the thick of
              it for years. I found my way through, got educated, and became
              a Certified Peer Recovery Specialist (CPRS) because I knew
              there were families out there who needed someone who actually
              understood what they were living with.
            </p>
            <p className="text-base font-normal text-muted-foreground">
              I don&apos;t hand you a pamphlet. I sit with you and figure out
              what&apos;s actually going on. Whether your kid has a
              diagnosis, you think they might, or you just know something
              isn&apos;t right and nobody seems to get it — that&apos;s
              exactly the kind of situation I work in.
            </p>
            <p className="text-base font-normal text-muted-foreground">
              Years of working directly with families. No clipboard. No
              timer on the session. Just someone in your corner who&apos;s
              been there.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {pills.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${item.color}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-sm font-medium text-secondary transition-all hover:gap-2"
            >
              Read more about Bobby
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default MeetBobby;
