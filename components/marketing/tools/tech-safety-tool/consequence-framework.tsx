const PRINCIPLES = [
  {
    title: "Set rules in advance",
    body: "Your child should know before any incident what behaviors lead to tech removal, for how long, and what they need to do to earn it back. Surprise consequences feel arbitrary and breed resentment.",
  },
  {
    title: "Immediate beats delayed",
    body: "With everything set up in advance, you can pause internet or lock a device in under 60 seconds. The sooner the consequence follows, the clearer the connection in your child's mind.",
  },
  {
    title: "Proportional matters",
    body: "“Tonight's Wi-Fi is off” is easier to follow through on than “grounded from tech for a month.” Start small. A consequence you actually enforce is worth ten you announce but don't follow through on.",
  },
  {
    title: "Don't negotiate mid-consequence",
    body: "State it once, stay calm, walk away. Negotiating teaches your child that persistence pays off. The conversation about what happened comes later — after, not during.",
  },
];

const SCRIPTS = [
  {
    label: "Applying the consequence:",
    text: "I'm turning off your internet right now because [specific behavior]. It comes back when [specific condition]. I'm not going to argue about this.",
  },
  {
    label: "When they find a workaround:",
    text: "You found a way around the restriction. That's now a trust issue, not just a screen time issue. The consequence is longer now.",
  },
  {
    label: "When they remove parental controls:",
    text: "You removed yourself from the parental controls. Until they're back in place and we've talked about why, this device stays with me. This isn't a negotiation.",
  },
  {
    label: "When they say you're spying:",
    text: "These aren't spy tools — they're safety guardrails. As you show me you can handle more independence, I give you more. That's how this works.",
  },
];

export function ConsequenceFramework() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((principle) => (
          <div key={principle.title}>
            <h4 className="mb-1.5 font-heading text-sm font-bold text-amber-800 dark:text-amber-400">
              {principle.title}
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
          </div>
        ))}
      </div>
      <h3 className="mb-2.5 font-heading text-base font-bold text-foreground">Scripts</h3>
      <div className="flex flex-col gap-3">
        {SCRIPTS.map((script) => (
          <div key={script.label}>
            <p className="mb-1 text-sm font-semibold text-foreground">{script.label}</p>
            <div className="rounded-r-md border-l-4 border-secondary bg-accent px-3.5 py-2.5 text-sm italic text-foreground">
              &ldquo;{script.text}&rdquo;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
