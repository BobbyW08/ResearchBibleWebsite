"use client";

import { useState } from "react";
import { ALL_DEVICES, type DeviceId, type ParentPhone, DEVICE_PANELS } from "@/lib/tools/tech-safety-tool-data";
import { ParentPhonePicker } from "./parent-phone-picker";
import { DevicePickerGrid } from "./device-picker-grid";
import { DevicePanel } from "./device-panel";
import { WifiPanel } from "./wifi-panel";
import { WorkaroundsList } from "./workarounds-list";
import { ChecklistSection } from "./checklist-section";
import { ConsequenceFramework } from "./consequence-framework";

function StepLabel({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="mb-4.5 mt-8 flex items-center gap-3.5 first:mt-0">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-primary-foreground">
        {number}
      </div>
      <div>
        <h2 className="font-heading text-lg font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function SectionBanner({ number, title, subtitle, className }: { number: number; title: string; subtitle: string; className: string }) {
  return (
    <div className={`mt-9 mb-4 flex items-center gap-3.5 rounded-xl px-6 py-4 text-white ${className}`}>
      <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full bg-white/20 font-heading text-sm font-extrabold">
        {number}
      </div>
      <div>
        <h2 className="font-heading text-base font-bold">{title}</h2>
        <p className="text-xs opacity-75">{subtitle}</p>
      </div>
    </div>
  );
}

export function TechSafetyToolGuide() {
  const [parentPhone, setParentPhone] = useState<ParentPhone | null>(null);
  const [selected, setSelected] = useState<Set<DeviceId>>(new Set());

  const toggleDevice = (device: DeviceId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(device)) next.delete(device);
      else next.add(device);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(ALL_DEVICES));
  const clearAll = () => setSelected(new Set());

  const selectedDevices = ALL_DEVICES.filter((id) => selected.has(id));

  return (
    <div>
      <StepLabel number={1} title="Tell us about your setup" description="Your answers customize the instructions below." />

      <div className="flex flex-col gap-6 print:hidden">
        <div>
          <p className="mb-3 font-heading text-sm font-semibold text-muted-foreground">
            Which phone do <em>you</em> use?
          </p>
          <ParentPhonePicker value={parentPhone} onChange={setParentPhone} />
        </div>

        <div>
          <p className="mb-3 font-heading text-sm font-semibold text-muted-foreground">
            Which devices does your child use?{" "}
            <span className="font-normal">(select all that apply)</span>
          </p>
          <DevicePickerGrid
            selected={selected}
            onToggle={toggleDevice}
            onSelectAll={selectAll}
            onClearAll={clearAll}
          />
        </div>
      </div>

      <StepLabel
        number={2}
        title="Your Device Setup Guide"
        description="Full step-by-step for each device. Steps 1–3 get you set up. Steps 4–6 lock it down and apply consequences."
      />

      {selectedDevices.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card px-8 py-12 text-center print:hidden">
          <div className="mb-3 text-4xl">☝️</div>
          <p className="text-base text-muted-foreground">
            Select your phone and your child&apos;s devices above — your personalized guide appears here.
            The Wi-Fi/Router section is always included at the bottom.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {selectedDevices.map((id) => (
          <DevicePanel key={id} panel={DEVICE_PANELS[id]} parentPhone={parentPhone} />
        ))}
        <WifiPanel />
      </div>

      <SectionBanner
        number={3}
        title="Know Their Workarounds"
        subtitle="Tailored to your selected devices — close these gaps before they happen"
        className="bg-violet-700"
      />
      <WorkaroundsList selected={selected} />

      <SectionBanner
        number={4}
        title="Applying It as a Consequence"
        subtitle="The technical setup is only half the picture"
        className="bg-amber-800"
      />
      <ConsequenceFramework />

      <SectionBanner
        number={5}
        title="Your Setup Checklist"
        subtitle="Run through once, check quarterly"
        className="bg-primary"
      />
      <ChecklistSection selected={selected} />
    </div>
  );
}
