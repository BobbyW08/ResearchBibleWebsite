"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Brain, CalendarClock, CheckCircle2, ChevronLeft, ChevronRight, MapPin, UserCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PainPointTopic } from "@/lib/pain-points";
import SupportCallout from "@/components/marketing/pain-point-support-callout";
import { BackfireList, ContentBlocks, DeeperLinks, SectionHead } from "@/components/marketing/pain-point-content";

// Interim visual upgrade for the 9 non-teen pain-point pages — restyles them
// into the sidebar/card layout from the "My Teenager Hates Me" artifact,
// against the site's real design tokens instead of that artifact's
// placeholder colors/fonts, per claude-code-handoff-v8.md Part C. Presentational
// only: content still comes from content/pain-points/*.yaml via getHelpEntry(),
// unchanged. No route ball, no newspaper grid, no panel-based content model
// here — that's future work once Bobby authors new panel content per page.

const SECTIONS = [
  { id: "whats-happening", label: "What's happening", icon: Brain },
  { id: "why-it-backfires", label: "Why this usually makes it worse", icon: AlertTriangle },
  { id: "try-this-week", label: "Try this week", icon: CheckCircle2},
  { id: "when-to-get-support", label: "When to get more support", icon: Users },
] as const;

function TryThisAccordion({ items }: { items: PainPointTopic["tries"] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <details
          key={item.title}
          open={index === 0}
          className="group rounded-xl border border-border bg-background px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-medium text-foreground">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {index + 1}
            </span>
            <span className="flex-1">{item.title}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
          </summary>
          <p className="mt-3 pl-9 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
        </details>
      ))}
    </div>
  );
}

// `icon` (a LucideIcon function component) can't cross the server→client
// boundary — this component is "use client" (it needs IntersectionObserver,
// collapse-toggle, and accordion state), so its prop type omits `icon`
// entirely rather than accepting the full server-side PainPointTopic.
export type SidebarLayoutTopic = Omit<PainPointTopic, "icon">;

function PainPointSidebarLayout({ topic }: { topic: SidebarLayoutTopic }) {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).id;
            if (id) setActiveSection(id);
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    for (const section of SECTIONS) {
      const el = sectionRefs.current[section.id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Sticky header — tag + headline stay pinned while the reader scrolls
          the intro/section content beneath, below the site's own global Header. */}
      <div className="sticky top-20 z-20 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:px-8">
        <Badge variant="outline" className="mb-2 h-auto gap-1.5 px-3 py-1 text-xs">
          <MapPin className="h-3 w-3" />
          {topic.tag}
        </Badge>
        <h1 className="font-title text-xl font-medium tracking-tight sm:text-2xl">{topic.headline}</h1>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">{topic.intro}</p>

        {topic.exampleScenario && (
          <div className="mt-6 max-w-3xl rounded-lg border border-l-[3px] border-border border-l-secondary bg-card px-4 py-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <UserCircle className="h-3.5 w-3.5" />
              What this might look like
            </p>
            <p className="text-sm italic leading-relaxed text-muted-foreground">{topic.exampleScenario}</p>
          </div>
        )}

        <div className="mt-4 grid gap-8 lg:grid-cols-[16rem_1fr]">
          <aside className="lg:sticky lg:top-40 lg:h-fit">
            <div className="flex items-center justify-between lg:mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">On this page</p>
              <button
                type="button"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className="hidden rounded-md p-1 text-muted-foreground hover:bg-muted lg:block"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
            </div>

            {!sidebarCollapsed && (
              <nav className="flex flex-col gap-1">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                      activeSection === section.id
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <section.icon className="h-3.5 w-3.5 shrink-0" />
                    {section.label}
                  </a>
                ))}
              </nav>
            )}

            {!sidebarCollapsed && (
              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-sm font-semibold text-foreground">Ready to talk it through?</p>
                <Link
                  href="https://cal.com/bobby-washburn/intro-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
                >
                  <CalendarClock className="h-4 w-4 shrink-0" />
                  Book a session
                </Link>
                <Link
                  href="/services#weekly-group"
                  className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
                >
                  <Users className="h-4 w-4 shrink-0" />
                  Join a parent group
                </Link>
              </div>
            )}

            {!sidebarCollapsed && (
              <div className="mt-4">
                <DeeperLinks heading="Go deeper" deepDive={topic.deepDive} related={topic.related} />
              </div>
            )}
          </aside>

          <div className="flex flex-col gap-4">
            <section
              id="whats-happening"
              ref={(el) => {
                sectionRefs.current["whats-happening"] = el;
              }}
              className="scroll-mt-40 rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <SectionHead icon={Brain} title="What's happening" />
              <ContentBlocks blocks={topic.whatHappening} />
            </section>

            <section
              id="why-it-backfires"
              ref={(el) => {
                sectionRefs.current["why-it-backfires"] = el;
              }}
              className="scroll-mt-40 rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <SectionHead icon={AlertTriangle} title="Why this usually makes it worse" />
              <BackfireList items={topic.backfires} />
            </section>

            <section
              id="try-this-week"
              ref={(el) => {
                sectionRefs.current["try-this-week"] = el;
              }}
              className="scroll-mt-40 rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <SectionHead icon={CheckCircle2} title="Try this week" />
              <TryThisAccordion items={topic.tries} />
            </section>

            <section
              id="when-to-get-support"
              ref={(el) => {
                sectionRefs.current["when-to-get-support"] = el;
              }}
              className="scroll-mt-40"
            >
              <SupportCallout heading="When to get more support" text={topic.support} crisis={topic.crisis} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PainPointSidebarLayout;
