"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PanelData, ParentPhone, Step } from "@/lib/tools/tech-safety-tool-data";
import { Callout } from "./callout";

function StepRow({ step, index }: { step: Step; index: number }) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold text-white",
          step.tone === "setup" ? "bg-secondary" : "bg-amber-700",
        )}
      >
        {index + 1}
      </span>
      <p
        className="flex-1 text-sm leading-relaxed text-foreground [&_b]:font-semibold [&_b]:text-foreground [&_em]:italic"
        dangerouslySetInnerHTML={{ __html: step.html }}
      />
    </div>
  );
}

export function DevicePanel({ panel, parentPhone }: { panel: PanelData; parentPhone: ParentPhone | null }) {
  const [collapsed, setCollapsed] = useState(false);
  const visibleSections = panel.sections.filter(
    (section) => !section.visibleWhen || section.visibleWhen === parentPhone,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm print:break-inside-avoid">
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        className="flex w-full items-center gap-4 px-6 py-4.5 text-left print:pointer-events-none"
        style={{ backgroundColor: panel.headerColor }}
      >
        <span className="shrink-0 text-2xl">{panel.icon}</span>
        <div className="flex-1">
          <h3 className="font-heading text-base font-bold text-white">{panel.label}</h3>
          <p className="mt-0.5 text-xs text-white/70">{panel.subtitle}</p>
        </div>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-white/60 transition-transform print:hidden", collapsed && "-rotate-90")}
        />
      </button>

      {!collapsed && (
        <div className="grid grid-cols-1 gap-6 border-t border-border p-6 md:grid-cols-2">
          {visibleSections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className={cn("flex flex-col gap-3", section.fullWidth && "md:col-span-2")}
            >
              <h4 className="border-b-2 border-border pb-1.5 font-heading text-sm font-bold text-foreground">
                {section.heading}
              </h4>

              {section.introCallouts?.map((callout, i) => <Callout key={i} {...callout} />)}

              {section.steps && section.steps.length > 0 && (
                <div className="flex flex-col gap-2">
                  {section.steps.map((step, i) => (
                    <StepRow key={i} step={step} index={i} />
                  ))}
                </div>
              )}

              {section.screenshots && section.screenshots.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {section.screenshots.map((shot, i) => (
                    <div key={i} className="flex max-w-[170px] flex-1 flex-col items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element -- external Apple CDN asset, not eligible for next/image optimization */}
                      <img
                        src={shot.src}
                        alt={shot.alt}
                        loading="lazy"
                        className="w-full rounded-lg border border-border shadow-md"
                      />
                      <p className="mt-1.5 text-center text-[11px] leading-tight text-muted-foreground">
                        {shot.caption}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {section.table && (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-primary text-primary-foreground">
                        {section.table.headers.map((header) => (
                          <th key={header} className="px-3 py-2 text-left font-heading text-xs font-semibold">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, i) => (
                        <tr key={i} className={i % 2 === 1 ? "bg-muted" : undefined}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-3 py-2 text-foreground">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {section.callouts?.map((callout, i) => <Callout key={i} {...callout} />)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
