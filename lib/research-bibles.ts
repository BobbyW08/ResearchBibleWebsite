export type ResearchBibleCategory = "stabilize" | "connect" | "structure" | "adapt";

export type ResearchBible = {
  slug: string;
  title: string;
  description: string;
  category: ResearchBibleCategory;
};

export const CATEGORY_INFO: Record<
  ResearchBibleCategory,
  { title: string; description: string }
> = {
  stabilize: {
    title: "Stabilize",
    description:
      "Safety, regulation, and neurodivergent baselines — get the ground steady before anything else.",
  },
  connect: {
    title: "Connect",
    description:
      "Relationship, attachment, and family system — the trust that makes everything else work.",
  },
  structure: {
    title: "Structure",
    description:
      "Routines, systems, and discipline that actually stick in real life.",
  },
  adapt: {
    title: "Adapt",
    description:
      "Adjusting expectations and approach to your child's development, mindset, and context.",
  },
};

export const CATEGORY_ORDER: ResearchBibleCategory[] = [
  "stabilize",
  "connect",
  "structure",
  "adapt",
];

export const researchBibles: ResearchBible[] = [
  // Stabilize
  {
    slug: "adhd",
    title: "ADHD",
    description:
      "What's really going on in your kid's brain, and evidence-based ways to work with it instead of against it.",
    category: "stabilize",
  },
  {
    slug: "anxiety-depression-children",
    title: "Understanding Anxiety and Depression in Children",
    description:
      "A parent's guide to recognizing, understanding, and responding to anxiety and depression in children from ages 3 to 17.",
    category: "stabilize",
  },
  {
    slug: "autism-spectrum-disorder-children",
    title: "Autism Spectrum Disorder in Children",
    description:
      "Understanding autism as a neurological difference, not a parenting failure. What your child's nervous system actually needs.",
    category: "stabilize",
  },
  {
    slug: "understanding-neurodivergence",
    title: "Understanding Neurodivergence",
    description:
      "A parent's guide to understanding neurodivergence, how neurodivergent brains are wired differently, and why standard parenting approaches often need adjustment.",
    category: "stabilize",
  },
  {
    slug: "high-risk-kids-self-harm-suicide-support",
    title: "Supporting Your Child Through Self-Harm and Suicidal Thoughts",
    description:
      "Evidence-based guidance for parents on understanding and responding to self-harm and suicidal ideation in children and adolescents.",
    category: "stabilize",
  },
  {
    slug: "de-escalation-crisis-planning",
    title: "De-Escalation and Crisis Planning",
    description:
      "How to calm behavioral crises and create a plan before the next meltdown happens.",
    category: "stabilize",
  },
  {
    slug: "trauma-informed-parenting-guide",
    title: "Understanding Trauma and Trauma-Informed Parenting",
    description:
      "Learn how trauma affects your child's brain and behavior, and discover practical strategies that actually work — including what NOT to do.",
    category: "stabilize",
  },
  {
    slug: "supporting-aggressive-children",
    title: "Supporting Aggressive Children",
    description:
      "Help your child with aggressive behavior by understanding what triggers it, recognizing the escalation cycle, and using evidence-based strategies to build safety and teach new skills.",
    category: "stabilize",
  },
  {
    slug: "parental-mental-health-substance-use",
    title: "Parental Mental Health and Substance Use",
    description:
      "Understanding how parental mental health and substance use affect parenting, and practical strategies for recovery and connection with your kids.",
    category: "stabilize",
  },
  {
    slug: "healthy-bodies-calm-homes",
    title: "Healthy Bodies Calm Homes — Sleep, Food, and Movement",
    description:
      "How sleep, nutrition, and physical activity shape children's behavior and emotional regulation — and what to do about it.",
    category: "stabilize",
  },
  {
    slug: "managing-public-outings-without-panic",
    title: "Managing Public Outings Without the Panic",
    description:
      "A practical guide to helping kids stay regulated during grocery stores, restaurants, family events, and other community outings.",
    category: "stabilize",
  },
  {
    slug: "screen-gaming-compulsive-use",
    title: "Screen Time and Gaming — When It Becomes Compulsive",
    description:
      "Why kids get stuck in gaming and social media loops — and what actually helps parents break the cycle without destroying trust.",
    category: "stabilize",
  },

  // Connect
  {
    slug: "connection-principles",
    title: "Building Connection with Your Child",
    description:
      "How intentional, everyday moments build the trust and felt security that make everything else in parenting work better.",
    category: "connect",
  },
  {
    slug: "communication-builds-trust",
    title: "Communication That Builds Trust",
    description:
      "How to validate feelings, build emotion vocabulary, listen actively, and repair after conflict — so your child stays open to you.",
    category: "connect",
  },
  {
    slug: "family-dynamics-systems-patterns",
    title: "Family Dynamics and Building Healthier Patterns",
    description:
      "Understand how family patterns form, why they stick around, and practical tools to interrupt cycles that aren't serving your family.",
    category: "connect",
  },
  {
    slug: "co-parenting-after-separation",
    title: "Co-Parenting After Separation or Divorce",
    description:
      "Build a functional parenting partnership across two households and shield your child from adult conflict.",
    category: "connect",
  },
  {
    slug: "friendship-social-coaching",
    title: "Supporting Your Child's Friendships",
    description:
      "Evidence-based strategies for helping your child build meaningful friendships and navigate social challenges.",
    category: "connect",
  },
  {
    slug: "parenting-styles-guide",
    title: "Understanding Your Parenting Style and How It Shapes Your Child",
    description:
      "Learn to recognize your parenting style, understand its effects on your child, and shift intentionally toward warmer, more structured parenting that works for your unique child.",
    category: "connect",
  },
  {
    slug: "parental-self-care",
    title: "Parental Self-Care: Why Your Own Wellbeing Matters to Your Kids",
    description:
      "Learn why parental self-care isn't a luxury — it's essential for effective parenting and your child's development.",
    category: "connect",
  },
  {
    slug: "raising-resilient-kind-kids",
    title: "Raising Resilient and Kind Kids",
    description:
      "Build your child's ability to handle challenge, persist through difficulty, and show genuine kindness — the character strengths that carry kids through life.",
    category: "connect",
  },
  {
    slug: "teen-autonomy-identity-support",
    title: "Supporting Your Teen's Autonomy and Identity",
    description:
      "Why your teenager needs increasing independence, how to support their identity development without losing your influence, and how to gradually release responsibility without chaos.",
    category: "connect",
  },
  {
    slug: "first-coaching-session-goal-setting",
    title: "What Do You Want — Getting the Most From Your First Coaching Session",
    description:
      "What to expect in your first parenting coaching session and how to identify what you actually want to be different.",
    category: "connect",
  },

  // Structure
  {
    slug: "structure-routines-parenting",
    title: "How Structure and Routines Actually Help (and When They Don't)",
    description:
      "Why consistent routines matter for your child's brain, how to build routines that stick, and what to do when they're not working.",
    category: "structure",
  },
  {
    slug: "principles-effective-discipline",
    title: "Principles of Effective Discipline",
    description:
      "Learn how to set clear limits, deliver consequences that teach, and handle backtalk — without yelling or harsh punishment.",
    category: "structure",
  },
  {
    slug: "behavior-reward-consequence-systems",
    title: "Behavior, Rewards, and Consequences That Actually Work",
    description:
      "How to design reward systems and consequences that motivate your child without creating permanent dependence on bribes.",
    category: "structure",
  },
  {
    slug: "chores-family-contribution",
    title: "Building a Family Team Through Chores and Contribution",
    description:
      "Why chores matter, how to build a system that actually sticks, and what to do when your child refuses.",
    category: "structure",
  },
  {
    slug: "teaching-money-skills-children",
    title: "Teaching Your Child About Money",
    description:
      "Why financial conversations matter, how to teach kids money skills at every age, and how to build healthy money habits that last into adulthood.",
    category: "structure",
  },
  {
    slug: "school-assistance-parent-guide",
    title: "School Assistance: Understanding School Refusal, Learning Differences, and Advocacy",
    description:
      "Help your child navigate school challenges — understanding school refusal, learning differences, and how to advocate effectively in the school system.",
    category: "structure",
  },
  {
    slug: "applying-parenting-strategies",
    title: "Applying Parenting Strategies — How to Actually Make Change Stick",
    description:
      "Why changing how you parent is hard, why it gets worse before it gets better, and how to follow through when things feel impossible.",
    category: "structure",
  },

  // Adapt
  {
    slug: "child-development-reality-check",
    title: "Understanding Child Development — Why Your Expectations Might Be Off (And How to Adjust)",
    description:
      "Learn what's actually developmentally possible at each age, why your child isn't being defiant, and what you can teach them instead of punishing.",
    category: "adapt",
  },
  {
    slug: "big-transitions-big-feelings",
    title: "Big Transitions, Big Feelings — Helping Kids Through Life Changes",
    description:
      "A guide for parents navigating major transitions with their children — moves, new siblings, school changes, and divorce.",
    category: "adapt",
  },
  {
    slug: "growth-mindset-parenting",
    title: "Mindset: Growth vs. Fixed — How Your Words Shape Your Child's Resilience",
    description:
      "Learn how praise, failure responses, and the beliefs you model influence whether your child embraces challenges or avoids them — and what to say instead.",
    category: "adapt",
  },
  {
    slug: "digital-parenting-guide",
    title: "Parenting in the Digital Age",
    description:
      "A practical guide to understanding screens, social media, and online safety — without the fear or guilt.",
    category: "adapt",
  },
  {
    slug: "modern-parenting-structural-shift",
    title: "Modern Parenting — Why It Feels So Much Harder Than It Should",
    description:
      "Parenting today is genuinely harder than it was a generation ago — and it's not because you're doing it wrong.",
    category: "adapt",
  },
  {
    slug: "how-motivation-works",
    title: "How Motivation Actually Works",
    description:
      "Understanding why your child won't start tasks and what actually builds lasting motivation.",
    category: "adapt",
  },
  {
    slug: "understanding-child-behavior",
    title: "Understanding Your Child's Behavior",
    description:
      "Learn why your child acts the way they do — and how to read behavior as communication instead of willful defiance.",
    category: "adapt",
  },
];

export function getResearchBiblesByCategory(
  category: ResearchBibleCategory,
): ResearchBible[] {
  return researchBibles.filter((bible) => bible.category === category);
}
