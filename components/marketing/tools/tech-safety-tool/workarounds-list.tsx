import {
  DEVICE_WORKAROUNDS,
  WORKAROUNDS,
  type DeviceId,
  type WorkaroundKey,
} from "@/lib/tools/tech-safety-tool-data";

export function WorkaroundsList({ selected }: { selected: Set<DeviceId> }) {
  const keys = new Set<WorkaroundKey>(DEVICE_WORKAROUNDS.wifi);
  selected.forEach((device) => {
    DEVICE_WORKAROUNDS[device]?.forEach((key) => keys.add(key));
  });
  const list = [...keys];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
      <p className="mb-4 text-sm text-muted-foreground">
        Kids are often faster with technology than their parents. These are the workarounds relevant to
        your selected devices.
      </p>
      <div className="flex flex-col gap-2.5">
        {list.map((key, i) => {
          const wa = WORKAROUNDS[key];
          return (
            <div key={key} className="overflow-hidden rounded-lg border border-red-200">
              <div className="flex items-center justify-between gap-3 bg-red-50 px-3.5 py-2.5 dark:bg-red-950/20">
                <span className="flex-1 text-sm font-semibold text-red-900 dark:text-red-100">
                  {i + 1}. {wa.title}
                </span>
                <span className="shrink-0 whitespace-nowrap rounded-md bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-800 dark:bg-purple-950/40 dark:text-purple-200">
                  {wa.badge}
                </span>
              </div>
              <p className="px-3.5 py-2.5 text-sm text-foreground">
                <b className="font-semibold">Fix:</b> {wa.fix}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
