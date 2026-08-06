"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import { motion, useInView } from "motion/react";
import SwipeCarousel from "@/components/marketing/swipe-carousel";

type Testimonial = {
  quote: string;
  name: string;
  detail: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "For the most part our morning and nightly routines are a little bit easier. Maintaining healthy boundaries while co-parenting — not becoming emotional during disagreements and letting the little things not get in the way of the bigger picture. Having someone sit down with ME to ask me about my values and what matters to me was a really important step. I still look back on my notes from when I worked with Bobby.",
    name: "Mom, 34",
    detail: "Cranston, RI",
  },
  {
    quote:
      "We could actually talk without some sort of imbalanced power dynamic. All the years of therapy with my kid — no one ever spent as much time with me as with my kiddo. Which helped my kid, because I was feeling seen and supported. Almost annoyingly positive all the time (I kid, it wasn't annoying) — and there didn't feel like an expiration date. You were in it for the long haul.",
    name: "Mom, 41",
    detail: "North Kingstown, RI",
  },
  {
    quote:
      "If we didn't have Bobby I don't know if we would be where we are. Yes, we still have blips — but we now feel like we can move past our blips instead of the blips dragging on. Taking our calls when we felt lost and completely by ourselves, talking us down, having us realize that little steps are wins — and to look at the wins even during the bad times.",
    name: "Dad, 47",
    detail: "Warwick, RI",
  },
  {
    quote:
      "I have a lot more confidence as a parent. I feel more connected and in charge. You were there beyond your schedule — knowing I could reach out in a more crisis mode helped a lot. We still use the diagrams and lists you helped make. We hold family meetings and make sure everyone is heard. This program helped in so many ways. I'm forever grateful.",
    name: "Mom, 38",
    detail: "West Warwick, RI",
  },
  {
    quote:
      "It feels easier to be heard and seen by someone that isn't 'clinical.' Feeling heard by someone who has experienced similar or the same experiences is a welcomed relief. Having that consistent person I could reach out to was a big deal for me.",
    name: "Mom, 29",
    detail: "Providence, RI",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-full flex-col gap-6 rounded-lg border border-dashed border-border p-8">
      <Quote className="h-8 w-8 shrink-0 text-secondary" strokeWidth={1.5} />
      <p className="text-base text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="mt-auto">
        <p className="text-base font-medium">{testimonial.name}</p>
        <p className="text-sm text-muted-foreground">{testimonial.detail}</p>
      </div>
    </div>
  );
}

function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef}>
      <div className="max-w-7xl mx-auto sm:px-16 px-4 pt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
          className="flex flex-col gap-3"
        >
          <Badge className="text-sm h-auto py-1 px-3 border-0 w-fit">
            What parents say
          </Badge>
          <h2 className="font-heading sm:text-5xl text-2xl leading-none font-medium tracking-tight">
            From parents in the thick of it.
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
          className="pt-12"
        >
          <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name + testimonial.detail} testimonial={testimonial} />
            ))}
          </div>

          <SwipeCarousel
            className="md:hidden"
            items={testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name + testimonial.detail} testimonial={testimonial} />
            ))}
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;
