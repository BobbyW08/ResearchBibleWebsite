import type { Callout as CalloutData } from "@/lib/tech-consequences-data";

const TONE_STYLES: Record<CalloutData["tone"], string> = {
  amber: "border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-100",
  red: "border-red-300/60 bg-red-50 text-red-900 dark:border-red-800/60 dark:bg-red-950/30 dark:text-red-100",
  green: "border-emerald-300/60 bg-emerald-50 text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-100",
  blue: "border-secondary/30 bg-accent text-foreground",
};

const LABEL_TONE_STYLES: Record<CalloutData["tone"], string> = {
  amber: "text-amber-700 dark:text-amber-400",
  red: "text-red-700 dark:text-red-400",
  green: "text-emerald-700 dark:text-emerald-400",
  blue: "text-secondary",
};

export function Callout({ tone, label, html }: CalloutData) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${TONE_STYLES[tone]}`}>
      <p className={`mb-1 font-heading text-xs font-semibold ${LABEL_TONE_STYLES[tone]}`}>{label}</p>
      <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
