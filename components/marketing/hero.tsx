"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import PlaceholderPhoto from "@/components/marketing/placeholder-photo";

function Hero() {
  return (
    <section>
      <div className="w-full h-full relative">
        <div className="relative w-full pt-0 md:pt-20 pb-6 md:pb-10 before:absolute before:w-full before:h-full before:bg-linear-to-r before:from-primary/30 before:via-background before:to-secondary/20 before:rounded-full before:top-24 before:blur-3xl before:-z-10">
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col max-w-5xl mx-auto gap-8">
              <div className="relative flex flex-col text-center items-center sm:gap-6 gap-4">
                <motion.h1
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="font-heading lg:text-7xl md:text-6xl text-4xl font-medium leading-tight tracking-tight"
                >
                  Parenting support grounded in{" "}
                  <span className="italic text-secondary">research</span>,
                  not guesswork
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
                  className="text-base font-normal max-w-2xl text-muted-foreground"
                >
                  Courses, groups, and 1-on-1 sessions to help you support
                  your child with confidence — every recommendation traces
                  back to the research bible behind it.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                className="flex items-center flex-col sm:flex-row justify-center gap-4"
              >
                <Link
                  href="#guides"
                  className="relative inline-flex items-center bg-primary text-primary-foreground hover:bg-primary/80 text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden"
                >
                  <span className="relative z-10 transition-all duration-500">
                    Find your guide
                  </span>
                  <span className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
                <Link
                  href="#book-a-call"
                  className={buttonVariants({ size: "lg", variant: "outline" })}
                >
                  Book a call
                </Link>
              </motion.div>

              {/* Credibility strip — copy is lorem ipsum until real bio/credentials are provided */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
                className="flex flex-col sm:flex-row items-center gap-4 rounded-lg border border-border bg-card/60 px-6 py-4 mx-auto"
              >
                <PlaceholderPhoto
                  alt="Photo of Bobby, founder, smiling with a parent and child"
                  className="h-16 w-16 shrink-0 rounded-full"
                />
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <p className="font-heading text-base font-medium text-foreground">
                    Bobby [Last Name], Lorem Ipsum Credential
                  </p>
                  <p className="text-sm text-muted-foreground max-w-lg">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit —
                    lorem years working directly with families, sed do
                    eiusmod tempor incididunt ut labore CPRS training.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
