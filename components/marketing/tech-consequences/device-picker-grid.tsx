"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ALL_DEVICES, DEVICE_PICKER, type DeviceId } from "@/lib/tech-consequences-data";
import { PrintButton } from "./print-button";

export function DevicePickerGrid({
  selected,
  onToggle,
  onSelectAll,
  onClearAll,
}: {
  selected: Set<DeviceId>;
  onToggle: (device: DeviceId) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}) {
  return (
    <div className="print:hidden">
      <div className="mb-2.5 flex flex-wrap gap-2.5">
        <Button type="button" variant="outline" onClick={onSelectAll}>
          Select All
        </Button>
        <Button type="button" variant="outline" onClick={onClearAll}>
          Clear All
        </Button>
        <PrintButton />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {ALL_DEVICES.map((id) => {
          const meta = DEVICE_PICKER.find((d) => d.id === id)!;
          const isSelected = selected.has(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(id)}
              className={cn(
                "select-none rounded-xl border-2 bg-card px-3 py-4 text-center transition-all",
                isSelected
                  ? "border-primary bg-accent shadow-md"
                  : "border-border hover:border-secondary hover:shadow-sm",
              )}
            >
              <span className="mb-2 block text-2xl">{meta.icon}</span>
              <span className="text-xs font-semibold leading-tight text-foreground">{meta.label}</span>
              <span
                className={cn(
                  "mx-auto mt-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground transition-opacity",
                  isSelected ? "opacity-100" : "opacity-0",
                )}
              >
                ✓
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
