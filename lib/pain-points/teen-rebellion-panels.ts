// Hardcoded, typed panel content for the teen page's route-ball/newspaper-grid
// rebuild (see claude-code-handoff-v8.md Part B). Not CMS-managed — this page's
// panel copy is authored directly here, distinct from content/pain-points/teen.yaml
// (which still owns only the deepDive/related LinkRef data via getHelpEntry('teen')).
//
// 8 panels, not 9 — the standalone "not-alone" stat panel from the earlier
// 9-panel plan is cut; its one load-bearing stat is folded into the hook panel
// as a reassurance line instead.

export type PanelLayout = "hero-wide" | "wide" | "full-width";
export type PanelEmphasis = "important" | "standard" | "caution";

export type Callout = { label: string; text: string };

// Shared by every panel except `support-signals`, which is structurally
// exempt from motion/route-ball participation — see SupportSignalsPanel below.
type PanelMotionFields = {
  panelMotion: string;
  ballEntry: string;
  ballExit: string;
  entryAnchor: string;
  activeAnchor: string;
  exitAnchor: string;
};

type PanelBase = {
  id: string;
  layout: PanelLayout;
  emphasis: PanelEmphasis;
  deck: string;
};

export type FeaturePanel = PanelBase &
  PanelMotionFields & {
    type: "feature";
    body: string;
    pullQuote?: string;
    source?: string;
  };

export type ExplanationPanel = PanelBase &
  PanelMotionFields & {
    type: "explanation";
    paragraphs: string[];
    callout?: Callout;
  };

export type ComparisonPanel = PanelBase &
  PanelMotionFields & {
    type: "comparison";
    body: string;
    lanes: { title: string; body: string; hold: boolean }[];
    pullQuote?: string;
    callout?: Callout;
  };

export type ScriptQuizPanel = PanelBase &
  PanelMotionFields & {
    type: "script-quiz";
    items: { strike: string; replace: string }[];
    callout?: Callout;
  };

export type ActivityPickerPanel = PanelBase &
  PanelMotionFields & {
    type: "activity-picker";
    items: { title: string; body: string }[];
  };

// No `panelMotion` field, no `ball` fields at all — a compile-time guarantee
// this panel can never be wired into the motion/route-ball systems, not a
// null placeholder. Zero entrance animation, zero route-ball participation,
// no exceptions.
export type SupportSignalsPanel = PanelBase & {
  type: "support-signals";
  lanes: { label: string; body: string; critical?: boolean }[];
};

export type CtaPanel = PanelBase &
  PanelMotionFields & {
    type: "cta";
    body: string;
  };

export type TeenPanel =
  | FeaturePanel
  | ExplanationPanel
  | ComparisonPanel
  | ScriptQuizPanel
  | ActivityPickerPanel
  | SupportSignalsPanel
  | CtaPanel;

export const TEEN_PANELS: TeenPanel[] = [
  {
    id: "teen-hates-me-hook",
    type: "feature",
    layout: "hero-wide",
    emphasis: "important",
    deck: "My teenager hates me (or at least acts like it)",
    body: "They roll their eyes at everything you say. They used to tell you things; now you get one-word answers. They're questioning your values, pushing back on your rules, and acting like they've never needed you. You're watching a child you know deeply become a stranger — and you're wondering if you did something wrong, or if you're losing them. You're not — and you're not as alone in this as it feels: only 48% of parents call the relationship with a teen \"excellent,\" vs. 80% with a toddler. This is what it looks like when it's working.",
    pullQuote: "You're not losing them. This is what it looks like when it's working.",
    source: "Gallup 2024",
    panelMotion: "feature-reframe-redaction-tilt",
    ballEntry: "arrive-corner-ready",
    ballExit: "exit-slide-along-gutter",
    entryAnchor: "top-left",
    activeAnchor: "headline",
    exitAnchor: "bottom-right",
  },
  {
    id: "whats-happening",
    type: "explanation",
    layout: "wide",
    emphasis: "important",
    deck: "What's happening",
    paragraphs: [
      "Adolescence has one central developmental task: your teenager has to become a self-governing person. To do that, they have to differentiate from you — build a sense of who they are that isn't defined by your approval, your preferences, or your evaluation. Some conflict, some pulling away, some questioning of your values: this isn't a sign the relationship is failing. It's a sign the relationship is changing in exactly the way it's supposed to.",
      "Your teenager's brain is also under active construction. The reward-seeking, sensation-seeking part (the limbic system) develops around puberty. The impulse-control, future-planning part (the prefrontal cortex) doesn't fully come online until the mid-20s. This mismatch is why your teenager wants adult-level independence while still demonstrating very un-adult-level judgment. It's not stubbornness. It's neurology.",
    ],
    panelMotion: "explanation-expand-vertical",
    ballEntry: "arrive-border-notch-ready",
    // Flagged for Bobby's sign-off: the delivered doc's value here
    // (exit-backup-then-hop-route-change) assumed this panel was followed by
    // why-it-backfires. It's now followed by the-real-distinction, a calm
    // continuation rather than a reframe, so this uses the gutter-slide exit
    // instead — best-guess, not confirmed.
    ballExit: "exit-slide-along-gutter",
    entryAnchor: "top-left",
    activeAnchor: "center",
    exitAnchor: "bottom-right",
  },
  {
    id: "the-real-distinction",
    type: "comparison",
    layout: "full-width",
    emphasis: "important",
    deck: "The tool — behavioral limits vs. psychological control",
    body: "The harder your teenager pushes for autonomy, the more effective approaches shift. Control that worked in childhood starts backfiring. What actually works now is the combination of two things: maintaining clear behavioral limits (curfews, expectations, monitoring) while releasing psychological control — giving up the drive to control who they are, how they feel, what they think. Those are very different things.",
    lanes: [
      {
        title: "Behavioral limits — hold these.",
        body: "Curfews. Knowing where they are. Expecting them to be in school. House rules. You set these, you maintain them, and they're appropriate at every age.",
        hold: true,
      },
      {
        title: "Psychological control — let these go.",
        body: "Guilt. Shame. Withdrawing warmth until they comply. \"What you think is wrong.\" \"Who you're becoming worries me.\" This is what pushes teens away — not the rules.",
        hold: false,
      },
    ],
    pullQuote: "The problem was never that you have rules. It's when the rules become about who they are, not what they do.",
    callout: {
      label: "Why this matters",
      text: "Psychological control is one of the most consistently replicated findings in adolescent research — it's linked to higher rates of depression and anxiety in teenagers, not better behavior.",
    },
    panelMotion: "comparison-split-two-lanes",
    ballEntry: "arrive-underline-headline-ready",
    ballExit: "exit-arc-jump-adjacent-panel",
    entryAnchor: "headline",
    activeAnchor: "divider",
    exitAnchor: "bottom-right",
  },
  {
    id: "why-it-backfires",
    type: "explanation",
    layout: "wide",
    emphasis: "standard",
    deck: "Why this usually makes it worse",
    paragraphs: [
      "**Tightening control when they pull away.** When your teenager becomes secretive or resistant, the instinct is to monitor more, restrict more, push harder for answers. But tighter control typically produces more secrecy, not less. Psychological control — guilt, shame, withdrawing love — is consistently associated with higher rates of depression and anxiety in adolescents, not better compliance.",
      "**Treating differentiation as rejection.** When your teenager criticizes you, challenges your values, or seems to not need you, it reads as rejection. Many parents respond by pulling back themselves, or by pushing harder for the connection they had before. But your teenager isn't rejecting you — they're practicing being separate from you. Those are completely different things.",
      "**Interrogating instead of being alongside.** A string of direct questions (\"How was school? What did you do? Who were you with?\") can feel invasive to a teenager who is actively building a private inner life. It confirms that time with you is a check-in, not a relationship. What keeps teenagers talking to their parents is usually low-pressure, parallel time — driving together, cooking together, doing something side-by-side with no agenda.",
    ],
    callout: {
      label: "What the research actually found",
      text: "When researchers separated 'parents asking questions' from 'teens choosing to share,' the sharing mattered far more than the asking. Teens who trust the relationship volunteer information. Teens who feel surveilled get better at hiding things.",
    },
    panelMotion: "friction-subtle-shake",
    ballEntry: "arrive-border-notch-ready",
    // Flagged for Bobby's sign-off, same reasoning as whats-happening above:
    // the-real-distinction now precedes this panel instead of following it,
    // so this exits with a calm roll into say-this-instead rather than the
    // doc's original feedback-slow-roll-caution value — best-guess, not confirmed.
    ballExit: "exit-roll-down-tilted-panel",
    entryAnchor: "top-left",
    activeAnchor: "center-left",
    exitAnchor: "bottom-right",
  },
  {
    id: "say-this-instead",
    type: "script-quiz",
    layout: "wide",
    emphasis: "standard",
    deck: "Same concern, different words",
    items: [
      { strike: "Because I said so.", replace: "Here's my concern — what are you thinking?" },
      {
        strike: "How was school? What did you do? Who were you with?",
        replace: "Anything getting hard lately? Anything you need from me?",
      },
      {
        strike: "I don't like who you're becoming.",
        replace: "I don't have to agree with every choice to still be on your side.",
      },
    ],
    callout: {
      label: "Why this works",
      text: "Questions that invite their reasoning keep the conversation open. Direct interrogation — even well-meant — reads as surveillance, and surveillance is exactly what teenagers get better at working around.",
    },
    panelMotion: "script-strike-and-replace",
    ballEntry: "arrive-corner-ready",
    ballExit: "exit-roll-down-tilted-panel",
    entryAnchor: "top-left",
    activeAnchor: "center",
    exitAnchor: "bottom-left",
  },
  {
    id: "try-this-week",
    type: "activity-picker",
    layout: "wide",
    emphasis: "standard",
    deck: "Try this week",
    items: [
      {
        title: "Separate behavioral limits from psychological control.",
        body: "You set the curfew. You maintain oversight of where they are. You hold the expectation that they're in school. These are behavioral limits and they're entirely appropriate. But \"what you think is wrong\" and \"how you feel is too sensitive\" and \"who you're becoming concerns me\" — these are psychological control, and they push your teenager further away, not closer.",
      },
      {
        title: "Use collaborative problem-solving when there's conflict.",
        body: "Instead of \"here's the rule,\" try \"here's my concern — what are you thinking?\" Your teenager's reasons matter to them, and taking them seriously keeps the conversation going. You don't have to agree to listen. And a solution they had input on is far more likely to be honored than one handed down from above.",
      },
      {
        title: "Find the low-pressure on-ramp.",
        body: "Teenagers don't usually open up in sit-down conversations. They open up in the car, during a walk, while you're doing something parallel with your hands. Build in one regular side-by-side activity — nothing formal, nothing agenda-driven. Just being together in a way that feels optional. That's often when the real conversations happen.",
      },
    ],
    panelMotion: "action-checklist-commitment",
    ballEntry: "arrive-border-notch-ready",
    ballExit: "exit-slide-along-gutter",
    entryAnchor: "top-left",
    activeAnchor: "center",
    exitAnchor: "bottom-right",
  },
  {
    id: "when-to-get-support",
    type: "support-signals",
    layout: "full-width",
    emphasis: "caution",
    deck: "Normal pushing away, or something more?",
    lanes: [
      {
        label: "Usually part of adolescence",
        body: "Eye-rolling, short answers, wanting privacy, questioning your rules and values, preferring friends to family time.",
      },
      {
        label: "Pay attention",
        body: "Withdrawal from all relationships (not just you), a real change in grades, losing interest in things they used to enjoy.",
      },
      {
        label: "Get help now",
        body: "Any mention of hopelessness or not wanting to be alive is not a \"wait and see.\" Teen depression often looks like irritability and flatness, not sadness. If you're unsure whether what you're seeing is development or distress, a conversation with your pediatrician or a therapist is the right call.",
        critical: true,
      },
    ],
  },
  {
    id: "pick-one-thing",
    type: "cta",
    layout: "wide",
    emphasis: "standard",
    deck: "Pick one thing. Not all of them.",
    body: "You don't need to overhaul how you parent this week. Pick one behavioral limit to hold steady, one piece of psychological control to let go of, and one low-pressure block of time to add. That's enough to start shifting the pattern.\n\nAnd the long view is on your side: most parent-teen relationships that go through a rocky stretch come back around — closeness with parents typically grows again through the college years and into the mid-20s. This distance is a phase of the relationship, not the end of it.",
    panelMotion: "close-next-step-anchor",
    ballEntry: "arrive-underline-headline-ready",
    ballExit: "resolve-final-settle",
    entryAnchor: "headline",
    activeAnchor: "checkbox",
    exitAnchor: "bottom-right",
  },
];

// The route ball's path — skips `when-to-get-support` entirely, per the
// absolute no-motion rule for that panel. Resolves directly from
// try-this-week's exit to pick-one-thing's entry, no stop, no loop-back.
export const ROUTE_BALL_SEQUENCE: string[] = TEEN_PANELS.filter(
  (panel) => panel.type !== "support-signals",
).map((panel) => panel.id);
