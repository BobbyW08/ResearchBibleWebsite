import { ALL_DEVICES, CHECKLISTS, type DeviceId } from "@/lib/tech-consequences-data";

export function ChecklistSection({ selected }: { selected: Set<DeviceId> }) {
  const groups: (DeviceId | "wifi")[] = [...ALL_DEVICES.filter((d) => selected.has(d)), "wifi"];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
      {groups.map((id) => {
        const group = CHECKLISTS[id];
        return (
          <div key={id} className="mb-6 last:mb-0">
            <h4 className="mb-2 border-b-2 border-border pb-1.5 font-heading text-sm font-bold text-foreground">
              {group.label}
            </h4>
            <div className="flex flex-col">
              {group.items.map((item) => (
                <div key={item} className="flex items-start gap-2.5 border-b border-border/60 py-1.5">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-[4px] border-2 border-border" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
