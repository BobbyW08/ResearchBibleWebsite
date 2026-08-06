"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

function Hero() {
  return (
    <section>
      <div className="w-full h-full relative">
        <div className="relative w-full pt-0 md:pt-20 pb-6 md:pb-10 before:absolute before:w-full before:h-full before:bg-linear-to-r before:from-primary/30 before:via-background before:to-secondary/20 before:rounded-full before:top-24 before:blur-3xl before:-z-10">
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col max-w-5xl mx-auto gap-8">
              <div className="relative flex flex-col text-center items-center sm:gap-6 gap-4">
                <motion.p
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="text-sm font-medium tracking-wide text-muted-foreground"
                >
                  Peer Support · Lived Experience · CPRS
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="font-heading lg:text-7xl md:text-6xl text-4xl font-medium leading-tight tracking-tight"
                >
                  You&apos;ve tried everything.
                  <br />
                  Something still isn&apos;t working.
                  <br />
                  <span className="italic text-secondary">
                    That&apos;s exactly where I come in.
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
                  className="text-base font-normal max-w-2xl text-muted-foreground"
                >
                  Every parent I work with has felt like they were the only
                  one dealing with this. They weren&apos;t. Neither are you.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                className="flex items-center flex-col sm:flex-row justify-center gap-4"
              >
                <Link
                  href="/help"
                  className="relative inline-flex items-center bg-primary text-primary-foreground hover:bg-primary/80 text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden"
                >
                  <span className="relative z-10 transition-all duration-500">
                    What&apos;s Your Pain Point?
                  </span>
                  <span className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
                <Link
                  href="https://cal.com/bobby-washburn/1on1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ size: "lg", variant: "outline" })}
                >
                  Book a Call with Bobby
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
