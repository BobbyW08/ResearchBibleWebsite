"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "So this isn't therapy?",
    answer:
      "Correct — and that's the point. I'm a Certified Peer Recovery Specialist, not a therapist. I don't diagnose, I don't treat, and I don't sit across from you taking notes about your childhood.\n\nWhat I do is different: I've been in the systems you're navigating, and I work with you as a peer who has the training to explain what's actually happening — what the research says about your kid's brain, why the thing you've been told to try isn't working, and what to do on a Tuesday night when it all falls apart.\n\nThink of it as the difference between clinical treatment and someone in your corner who knows the terrain. Plenty of families use both. If what you need is therapy, I'll tell you that directly, and I'll help you find it.",
  },
  {
    question: "Do I need a diagnosis to work with you?",
    answer:
      "No. Most of the families I work with are somewhere in the middle — something's hard, they're not sure exactly why, and they haven't necessarily gotten an official label for it. You don't need a diagnosis to start a conversation.",
  },
  {
    question: "What makes this different from regular parenting advice?",
    answer:
      "I've been on the other side of this. I was the kid parents didn't know what to do with. That lived experience — combined with years of working directly with families and a CPRS credential — means I come to this differently than a therapist or a parenting blogger. I'm not just telling you what the research says. I'm sitting with you in the specific situation you're in.",
  },
  {
    question: "Who is this for?",
    answer:
      "Any parent who's struggling — whether your child has a diagnosis, you think they might, or you just know something isn't working and you can't figure out why. There's no label required to reach out.",
  },
  {
    question: "What does a session look like?",
    answer:
      "It's a conversation. No clipboard, no clinical intake forms, no timer counting down. We talk about what's actually happening at home, figure out what the real pressure points are, and work on what you can do differently. Some families work with me for a few sessions. Some stay connected longer. It depends entirely on what you need.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a free 30-minute call. That's it. We'll talk and figure out together what kind of support makes sense.",
  },
];

function FaqAccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `faq-panel-${index}`;

  return (
    <div className="border-b border-border">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-heading text-base font-medium text-foreground sm:text-lg">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        id={panelId}
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="whitespace-pre-line text-base font-normal text-muted-foreground">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function Faq() {
  return (
    <section id="faq" className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:py-24">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 text-center"
        >
          <Badge variant="outline" className="h-auto px-3 py-1 text-sm">
            FAQ
          </Badge>
          <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
            Questions people ask before they reach out.
          </h2>
        </motion.div>

        <div className="mt-10">
          {faqItems.map((item, index) => (
            <FaqAccordionItem key={item.question} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
