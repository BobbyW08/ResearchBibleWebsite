import { Heart } from "lucide-react";

type SupportCalloutProps = {
  heading: string;
  text?: string;
  crisis?: boolean;
};

function SupportCallout({ heading, text, crisis }: SupportCalloutProps) {
  return (
    <div className="rounded-lg border border-amber-300/60 bg-amber-50 px-6 py-5 dark:border-amber-800/60 dark:bg-amber-950/30">
      <div className="mb-2 flex items-center gap-2">
        <Heart className="h-4 w-4 text-amber-700 dark:text-amber-500" />
        <span className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-500">
          {heading}
        </span>
      </div>
      {text && (
        <p className="text-sm leading-relaxed text-foreground">{text}</p>
      )}
      {crisis && (
        <ul className="mt-3 flex flex-col gap-1 text-sm text-foreground">
          <li>
            988 Suicide &amp; Crisis Lifeline: Call or text <strong className="font-semibold">988</strong>
          </li>
          <li>
            Crisis Text Line: Text <strong className="font-semibold">HOME</strong> to{" "}
            <strong className="font-semibold">741741</strong>
          </li>
          <li>
            Local social services: Dial <strong className="font-semibold">211</strong>
          </li>
        </ul>
      )}
    </div>
  );
}

export default SupportCallout;
