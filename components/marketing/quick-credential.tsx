"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";
import bobbyPhoto from "@/assets/bobby-quick-credential.jpg";

const CREDENTIAL_BULLETS: string[] = [
  "Certified Peer Recovery Specialist (CPRS), Rhode Island Certification Board, ID 202153",
  "Peer Parent Consultant",
  "U.S. Army veteran, Signals Intelligence Analyst, Sergeant, Afghanistan",
  "Trained in Motivational Interviewing, Trauma-Informed Care, and Youth Mental Health First Aid",
  "Experience working at ABA clinics, juvenile justice alternative placements, and in homes with neurodivergent populations",
];

function QuickCredential() {
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
            <Image
              src={bobbyPhoto}
              alt="Photo of Bobby Washburn"
              className="aspect-4/3 w-full rounded-lg object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col items-start gap-5"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Who you&apos;re working with
            </p>
            <ul className="flex flex-col gap-3">
              {CREDENTIAL_BULLETS.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-base font-normal text-muted-foreground">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/about-bobby"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all hover:gap-2"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default QuickCredential;
