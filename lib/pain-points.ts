import {
  Flame,
  Smartphone,
  Ear,
  CloudLightning,
  Moon,
  Pencil,
  Hand,
  Clock,
  Angry,
  HeartCrack,
  Globe,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type AgeBand = "2-5" | "6-9" | "10-12" | "13+";
export const AGE_BANDS: AgeBand[] = ["2-5", "6-9", "10-12", "13+"];
export type AgeScenarios = Partial<Record<AgeBand, string>>;

export type ContentBlock =
  | { kind: "p"; html: string }
  | { kind: "stat"; html: string }
  | { kind: "list"; items: string[] };

export type ListItem = { title: string; body: string };
export type LinkRef = { label: string; href: string };

type BaseEntry = {
  slug: string;
  icon: LucideIcon;
  tag: string;
  title: string;
  cardTeaser: string;
  headline: string;
  intro: string;
};

export type PainPointTopic = BaseEntry & {
  kind: "pain-point";
  featured?: boolean;
  ageScenarios: AgeScenarios;
  defaultAge: AgeBand;
  whatHappening: ContentBlock[];
  backfires: ListItem[];
  tries: ListItem[];
  support: string;
  crisis?: boolean;
  deepDive?: LinkRef;
  related: LinkRef[];
};

export type AwarenessModule = BaseEntry & {
  kind: "module";
  sections: { heading: string; body: ContentBlock[] }[];
  crisis?: boolean;
  related: LinkRef[];
};

export type HelpEntry = PainPointTopic | AwarenessModule;

const p = (html: string): ContentBlock => ({ kind: "p", html });
const stat = (html: string): ContentBlock => ({ kind: "stat", html });
const list = (items: string[]): ContentBlock => ({ kind: "list", items });

export const painPoints: PainPointTopic[] = [
  {
    kind: "pain-point",
    slug: "meltdowns",
    icon: Flame,
    tag: "Meltdowns & tantrums",
    title: "My kid melts down over everything",
    cardTeaser: "Why tiny triggers cause huge reactions — and what to do in the moment.",
    headline: "Why your kid loses it over small things (and what to do when it happens)",
    intro:
      "The sock has a wrinkle. The juice is in the wrong cup. You said \"no\" to five more minutes. And now your child is on the floor, screaming, completely unreachable. You're standing there wondering how this happened — and what on earth you're supposed to do.",
    featured: true,
    defaultAge: "6-9",
    ageScenarios: {
      "2-5": "Your 3-year-old collapses into a full meltdown because you gave them the wrong cup. It looks absurd, but their prefrontal cortex is still basically a toddler too — they have almost no capacity to manage this kind of frustration yet.",
      "6-9": "Your 7-year-old is completely fine one moment, then screaming because you turned the TV off. They're on the floor, not hearing you, not reachable by reason. They would stop if they could.",
      "10-12": "Your 10-year-old loses it over a homework comment you made. The words coming back at you don't match the size of the situation. Their brain is developing fast but the regulatory systems haven't caught up.",
      "13+": "Your 14-year-old goes from zero to full shutdown over something in a text thread. Teenagers' brains are actually more emotionally reactive than kids' — the emotional system is fully online while the brakes aren't.",
    },
    whatHappening: [
      p("When a child melts down, their brain's threat-detection system has taken over. The part of the brain responsible for logic, language, and learning — the <strong>prefrontal cortex</strong> — essentially goes offline when the body shifts into survival mode. Stress hormones flood their system. Their heart rate spikes. The world narrows to the threat in front of them."),
      p("Here's the critical piece: your child genuinely cannot hear your reasoning right now. They can't calm down on command. They can't process consequences. The meltdown isn't a choice or a manipulation — it's a nervous system that has been overwhelmed and is doing exactly what it was designed to do. The trigger might look small to you. Inside their brain, something registered as an emergency."),
      p("Children's brains are still developing the capacity to regulate strong emotions, which is why their threshold for <strong>dysregulation</strong> is lower than yours — and why the same child who was fine five minutes ago can be completely undone by a wrinkle in a sock."),
    ],
    backfires: [
      { title: "Explaining, reasoning, or bargaining in the moment.", body: "Logic requires the thinking brain — and the thinking brain is currently offline. No matter how clear your explanation is, it isn't reaching the part that processes it. The more you talk, the more your child feels misunderstood, which often escalates things further." },
      { title: "Matching their intensity.", body: "When you raise your voice, your child's nervous system reads \"more danger.\" A loud, firm parent during a meltdown doesn't send the message \"get it together\" — it sends the message \"this environment is unsafe.\" Your stress is contagious. So is your calm." },
      { title: "Jumping to consequences in the moment.", body: "Consequences delivered during a meltdown don't reach the part of the brain that learns from them. Your child cannot connect \"I'm losing my mind right now\" with \"this will affect my screen time tomorrow.\" It just adds more stimulation to an already overwhelmed system." },
    ],
    tries: [
      { title: "Regulate yourself before you enter the room.", body: "Before you walk toward the meltdown, pause. Take three slow breaths. Drop your shoulders. Relax your jaw. Lower your voice before you say a single word. This is not a soft move — it's the most powerful thing you can do. Your regulated nervous system sends genuine safety signals to your child's threat system. Their brain starts to settle because yours already has." },
      { title: "Use fewer words, not more.", body: "At the peak of a meltdown, \"I'm here. You're safe.\" is enough. Stay nearby, stay quiet, stay calm. Don't ask what's wrong. Don't explain why they're wrong. Don't comfort with a lot of words. Your steady presence is doing the work." },
      { title: "Wait until full baseline before problem-solving.", body: "Once your child has calmed down — sometimes 30 minutes, sometimes longer — that's when learning becomes possible again. Sit together. \"What was hard about that? What would help next time?\" This conversation, done from a place of genuine curiosity (not a lecture in disguise), is where real change happens." },
    ],
    support: "Look for help if meltdowns are happening multiple times per day, lasting more than 30–45 minutes, and showing no signs of decreasing over time. Also seek support if your child's behavior during meltdowns is dangerous — aggression that can't be kept safe, or self-harm — or if your child isn't returning to their normal self between episodes. A therapist or behavioral specialist can help identify whether ADHD, anxiety, sensory sensitivities, or other factors are driving the pattern.",
    deepDive: { label: "De-Escalation and Crisis Planning", href: "/docs/de-escalation-crisis-planning" },
    related: [
      { label: "My kid hits, bites, or throws things", href: "/help/aggression" },
      { label: "Morning chaos — routines", href: "/help/routines" },
    ],
  },
  {
    kind: "pain-point",
    slug: "screens",
    icon: Smartphone,
    tag: "Screens & devices",
    title: "What do I do about screens?",
    cardTeaser: "Why limits backfire and what actually works.",
    headline: "What do I do about screens?",
    intro:
      "You set the limit. You enforced it. You took the device away — and what came back was a reaction that felt wildly out of proportion. Meltdown. Rage. Panic. And now you're wondering: is this normal? Is something actually wrong? And why does nothing you try seem to stick?",
    defaultAge: "6-9",
    ageScenarios: {
      "2-5": "Your 4-year-old loses it completely when the show ends — crying, throwing themselves down. Screen time has become something their brain expects and demands, not something that's just enjoyable.",
      "6-9": "Your 8-year-old has started sneaking the iPad and lying about it. They knew the rule. The pull to get back online is stronger than their fear of consequences.",
      "10-12": "Your 11-year-old's whole social world lives in a group chat. Cutting off their phone doesn't feel like a limit — it feels like being cut off from everyone.",
      "13+": "Your 15-year-old can't get through dinner without checking their phone. When you ask about it, they explode. Their mood, social status, and self-image all run through what happens on that screen.",
    },
    whatHappening: [
      p("Screen compulsivity isn't a willpower problem, and it isn't a parenting failure. It's the predictable result of systems that were engineered to keep kids coming back. Gaming platforms and social media are designed by teams of engineers specifically to make stopping hard — using the same reward mechanics as slot machines."),
      p("Here's the deeper issue: with enough repetition, screen behavior stops being a choice and becomes a habit — automatically triggered by cues in the environment. The sight of the device, a notification sound, a moment of boredom. The behavior fires before your child has consciously decided anything. That's why \"just try harder\" doesn't work. You can't willpower your way out of a habit. Habits require changing the environment, not changing character."),
      p("There's also a motivation piece. When kids start gaming or posting for fun, they often shift over time to gaming or posting for performance — how many wins, how many likes. That shift moves them from <strong>intrinsic motivation</strong> (\"I enjoy this\") to contingent motivation (\"I need the number to go up to feel okay\"). At that point, the screen isn't just entertaining — it's regulating their mood."),
    ],
    backfires: [
      { title: "Taking the device away without an alternative.", body: "If you remove the screen without building a compelling substitute, you create a motivation vacuum. The child's brain needs something to reward it. Without an alternative, it returns to the most reliably rewarding thing available — which is usually the thing you just removed." },
      { title: "Starting with the conclusion.", body: "Sitting your child down to say \"You're spending too much time on this, so we're making changes\" puts them on the defensive before any understanding has been built. They don't feel heard — they feel managed. The conversation closes before it opens." },
      { title: "Punishing kids for telling you when they go over.", body: "If exceeding the limit gets the device confiscated, your child learns one thing: don't tell you next time. Your visibility into what's actually happening drops to zero — which is the opposite of what keeps them safe." },
    ],
    tries: [
      { title: "Move devices out of bedrooms tonight.", body: "This is the highest-leverage single change most families can make. Charge phones in a shared family space. When the device isn't present, the environmental cue can't fire the habit. Frame it as a family-wide change, not a punishment for your child." },
      { title: "Start with a curiosity conversation.", body: "Before you change anything else, ask: \"Help me understand what makes this so compelling. What does it give you that other things don't?\" Then actually listen. The answer tells you what function the screen is serving — social connection, escape, competence — and that tells you what kind of alternative might actually work." },
      { title: "Build the alternative first, reduce screens second.", body: "Identify one activity your child shows any interest in and enroll them — a group class, team sport, creative pursuit, anything that puts them around peers. Run it for four to six weeks alongside normal screen time before touching limits. Alternatives only work if they have time to become genuinely rewarding." },
    ],
    support: "Seek professional support if your child shows real distress — not just frustration — when devices are unavailable: severe irritability, inability to focus on anything, significant anxiety or depression between sessions. Also seek support if screen use has become the primary way your child is managing emotional pain, or if their self-worth seems to rise and fall with metrics like likes, views, or wins. At that point, the behavior is serving a psychological function that needs more than a parenting adjustment.",
    deepDive: { label: "Screen Time and Gaming — When It Becomes Compulsive", href: "/docs/screen-gaming-compulsive-use" },
    related: [
      { label: "My kid won't listen", href: "/help/wontlisten" },
      { label: "My kid is anxious or worried", href: "/help/anxiety" },
    ],
  },
  {
    kind: "pain-point",
    slug: "wontlisten",
    icon: Ear,
    tag: "Defiance & compliance",
    title: "My kid won't listen",
    cardTeaser: "Understanding why — and responses that actually change the pattern.",
    headline: "My kid won't listen",
    intro:
      "You've asked three times. Your voice is rising. They're still doing the exact thing you asked them not to do — or nowhere near the thing you asked them to do. And you're starting to wonder if they simply don't care what you say, or if there's something fundamentally off.",
    featured: true,
    defaultAge: "6-9",
    ageScenarios: {
      "2-5": "You ask your 4-year-old to put shoes on. Nothing. Again. Nothing. Louder. Now it's a meltdown. The ask became a power struggle without you meaning for it to.",
      "6-9": "Your 7-year-old pretends not to hear you until your voice gets sharp. Quiet requests disappear. You've accidentally trained them to respond to your yell.",
      "10-12": "Your 10-year-old responds to every request with \"why do I have to?\" Every instruction becomes a negotiation and you're exhausted by 8 PM.",
      "13+": "Your 14-year-old isn't defiant exactly — they're just absent. Not doing what you ask, not arguing. Just not doing it. Passive non-compliance is harder to address than open defiance.",
    },
    whatHappening: [
      p("All behavior serves a purpose. When your child \"won't listen,\" their brain is almost always doing one of four things: trying to get out of something that feels hard or unpleasant (escape), trying to get your attention — even if it looks like a negative interaction (attention), trying to access something they want (tangible), or responding to a sensory need."),
      p("Understanding which one is happening changes everything about how you respond. A child who melts down when you announce homework time is usually motivated by escape — the task feels hard or overwhelming, and the meltdown reliably makes the demand go away. A child who acts up the moment you're on a phone call is usually motivated by attention — even your irritated attention is more satisfying than being ignored."),
      p("This isn't manipulation in the strategic, adult sense. It's your child's brain running the program that's worked before. Most of the time, they're not even aware they're doing it. When you understand the function, the response becomes obvious."),
    ],
    backfires: [
      { title: "Repeating the instruction over and over.", body: "Multiple warnings with no follow-through teach your child that your words don't have weight. They learn to wait out the first three or four asks because consequences only appear when you reach a certain volume. You end up training them to respond to your yell, not your ask." },
      { title: "Long explanations during the conflict.", body: "When your child is already in a state of resistance, a lengthy explanation of why they should listen tends to escalate, not resolve. Their brain is already activated, and more words feel like more pressure. Save the reasoning for a calm moment later." },
      { title: "Backing down after escalation.", body: "If your child throws a fit and you remove the demand, you've just demonstrated that escalation works. The next time you make a request, their nervous system already knows the playbook. Consistency matters more than perfect execution." },
    ],
    tries: [
      { title: "Do the HALT check before you respond.", body: "HALT: Hungry, Angry, Lonely, Tired. Before you interpret the behavior as defiance, run through the list. Many \"won't listen\" moments are a depleted nervous system trying to communicate a basic need. A snack and five minutes of connection can dissolve what looks like willful resistance." },
      { title: "Give one clear instruction and follow through every time.", body: "Not \"I'm going to count to three and then...\" — just a calm, direct expectation and a consequence that follows reliably if it isn't met. Consequences work through consistency, not severity. One expectation, followed through calmly every time, is more effective than a dozen rules enforced unpredictably." },
      { title: "Offer a choice within the limit.", body: "\"Do you want to start with math or reading?\" gives your child genuine agency without negotiating the actual expectation. Kids who feel some control over how they do a thing are dramatically more likely to do it. The choice belongs to them; the expectation stays with you." },
    ],
    support: "If your child's level of defiance is significantly out of step with peers their age, happening across all settings (home, school, others' homes), or accompanied by persistent aggression, it's worth a professional evaluation. Conditions like ADHD, anxiety, and oppositional defiant disorder (ODD) can make compliance genuinely harder than it looks from the outside — and they respond differently than typical behavior. A pediatrician or behavioral therapist can help you figure out what's actually driving the pattern.",
    deepDive: { label: "Understanding Your Child's Behavior", href: "/docs/understanding-child-behavior" },
    related: [
      { label: "My kid melts down over everything", href: "/help/meltdowns" },
      { label: "The homework war", href: "/help/homework" },
    ],
  },
  {
    kind: "pain-point",
    slug: "anxiety",
    icon: CloudLightning,
    tag: "Anxiety & school refusal",
    title: "My kid is anxious and won't go to school",
    cardTeaser: "The avoidance cycle and how to break it without a battle.",
    headline: "My kid is always anxious or worried — and won't go to school",
    intro:
      "Sunday nights are dread. Monday mornings are tears, stomachaches, or shutdowns. You've tried everything — calm reassurance, firm insistence, bribing, letting them stay home. Nothing works, or it works once and then stops. You're exhausted, worried, and starting to wonder if there's something seriously wrong.",
    defaultAge: "6-9",
    ageScenarios: {
      "2-5": "Your 4-year-old cries every morning at school drop-off. It's been weeks. The teacher says they're fine within minutes, but that doesn't make separation easier for either of you.",
      "6-9": "Your 7-year-old has stomachaches every Sunday night. They're not sick — their body is manifesting the dread of Monday. School feels like a threat their body is already preparing for.",
      "10-12": "Your 11-year-old has started refusing to go to school. It began with occasional avoidance. Now it's most days. They're not being defiant — they're genuinely scared of something there.",
      "13+": "Your 15-year-old has quietly stopped doing things. No longer hanging out with friends, skipping activities they used to love, spending most of their time alone. The worry has expanded into everything.",
    },
    whatHappening: [
      p("Anxiety works through a cycle of avoidance — and every act of avoidance makes anxiety stronger. Here's the mechanism: your child feels distress about school. They avoid it. The distress immediately goes down. Relief arrives. That relief is powerful, and their brain files it away: avoiding this made me feel better. Next time, avoidance comes faster, feels more necessary, and the fear grows — because their brain now has more evidence that the thing is genuinely dangerous."),
      p("This is not a willpower problem. The <strong>avoidance cycle</strong> runs below the level of conscious choice, especially in children whose <strong>prefrontal cortex</strong> — the brain's reasoning center — is still developing. When your child says \"I can't go,\" they're not being dramatic. They're reporting the experience of a nervous system that has genuinely learned that school equals threat."),
      p("School refusal is almost always driven by one of four things: anxiety about something at school (separation, social evaluation, academic failure), access to something comfortable at home, attention from you during the struggle, or relief from escaping an overwhelming situation. Understanding which one is driving your child changes what you do next."),
    ],
    backfires: [
      { title: "Repeated reassurance.", body: "\"You'll be fine. I promise nothing bad will happen.\" Feels helpful, but each time you reassure, you're reinforcing the message that the uncertainty was worth worrying about. Research shows reassurance relieves anxiety for about 90 seconds and then makes the underlying intolerance of uncertainty worse. The more you reassure, the more they need it." },
      { title: "Letting them stay home.", body: "When your child is visibly distressed and you allow them to stay home, you both get immediate relief. But their brain has just received confirmation that school was dangerous enough to escape. The next morning will be harder." },
      { title: "Making the worry the center of the conversation.", body: "Asking what they're afraid of, discussing all the reasons it might not happen, spending extended time on the topic — this teaches the anxious brain that the worry is worth paying attention to. You're unintentionally keeping the spotlight on the threat." },
    ],
    tries: [
      { title: "Validate the feeling without accommodating the avoidance.", body: "There's a meaningful difference between \"I can see you're scared, and I'm here\" (validating) and \"Okay, you can stay home today\" (accommodating). Your child's fear is real and deserves acknowledgment. The behavior the fear is driving doesn't have to be accommodated. Both things are true at the same time." },
      { title: "Make school attendance non-negotiable, but adjust the exposure.", body: "A graduated approach works better than all-or-nothing. Can your child make it to the door? To the first class? To lunch? Set a bar that's hard but doable, hold it calmly, and expand it over time. Progress at school, even imperfect progress, directly breaks the avoidance cycle." },
      { title: "Reduce your response to reassurance-seeking.", body: "When your child asks \"But what if something bad happens?\" shift from answering the question to acknowledging the feeling: \"I can see you're worried. I know you can handle it.\" Brief, warm, and then redirect. Don't engage with the what-ifs. That's a different conversation than the one they need right now." },
    ],
    support: "Get professional support if your child has missed more than a handful of school days due to anxiety, if symptoms have been present for more than two weeks, if physical complaints (stomachaches, headaches) are persistent, or if their daily life is significantly limited by worry. Cognitive Behavioral Therapy (CBT) is the gold standard for childhood anxiety and has strong research support. If your child refuses therapy, parent-only programs like SPACE can be just as effective — you work with a therapist to change your responses, and your child's anxiety improves.",
    deepDive: { label: "Understanding Anxiety and Depression in Children", href: "/docs/anxiety-depression-children" },
    related: [
      { label: "My kid won't listen", href: "/help/wontlisten" },
      { label: "Children's mental health in the U.S.", href: "/help/mentalhealth" },
    ],
  },
  {
    kind: "pain-point",
    slug: "bedtime",
    icon: Moon,
    tag: "Sleep & bedtime",
    title: "Bedtime battles",
    cardTeaser: "What's really happening at night and how routines actually fix it.",
    headline: "Bedtime battles — why your kid won't sleep (and what actually helps)",
    intro:
      "Bedtime is supposed to be peaceful. In your house, it's a negotiation marathon: five more minutes, one more hug, a glass of water, a question that could definitely wait until morning. An hour later, you're somehow still in the room, your evening is gone, and they're still awake.",
    defaultAge: "6-9",
    ageScenarios: {
      "2-5": "It takes 90 minutes to get your 3-year-old down. You've done the routine. You've done the second routine. They need water, another hug, something very important to tell you about a bug they saw.",
      "6-9": "Your 8-year-old is in bed at 8:30 but awake until 10. They're not playing — they genuinely can't fall asleep. Their brain isn't receiving a clear signal that it's time to wind down.",
      "10-12": "Your 11-year-old has a 9 PM bedtime but is on their phone until 11. By morning they're impossible to wake. The device in the room is working directly against the sleep signal.",
      "13+": "Your 16-year-old can't fall asleep before midnight no matter what. This isn't defiance — it's delayed sleep phase, which is biologically more common in adolescents.",
    },
    whatHappening: [
      p("Your child's brain produces <strong>melatonin</strong> — the hormone that signals \"time to sleep\" — in response to consistent cues: the same sequence of events, at the same time, in the same environment, night after night. When those cues are inconsistent or absent, the brain doesn't get a clear signal, and sleep onset gets delayed."),
      p("Think of a bedtime routine as a biological alarm for your child's nervous system. The warm bath, the story, the darkness — these aren't just nice rituals. They're telling the brain \"wind down is happening, sleep is coming.\" After a few weeks of consistency, the brain starts producing melatonin in anticipation of the routine, before the routine even finishes. Your child actually gets sleepier earlier because their body has learned what's coming."),
      p("Without that signal — when bedtime floats around, when screens run up to lights-out, when one night looks nothing like the last — the brain stays alert. It's still waiting to know what's happening. That alert state is exactly the opposite of sleep-ready."),
    ],
    backfires: [
      { title: "Screens right before bed.", body: "The blue light from devices suppresses melatonin production and activates the alert system. The content itself — fast-paced, social, stimulating — is the opposite of wind-down. Many parents report dramatic sleep improvements from a single change: screens off 30–45 minutes before bed." },
      { title: "Letting bedtime float on weekends.", body: "A 90-minute later bedtime on Saturday shifts your child's internal clock — and Monday morning feels like jet lag. The body's circadian rhythm learns from your average timing, not your stated bedtime. Consistency across the whole week matters more than perfect execution on any single night." },
      { title: "Negotiating in the moment.", body: "\"Five more minutes\" feels like a reasonable compromise, but it teaches your child that the bedtime routine is negotiable — and if it was negotiable tonight, it's worth trying again tomorrow. Over time, the routine loses its predictive value because it keeps moving." },
    ],
    tries: [
      { title: "Start the wind-down 30 minutes earlier than you think you need to.", body: "Most parents underestimate how long it takes for a child's nervous system to shift from \"active and engaged\" to \"ready for sleep.\" Screen-free, low-stimulation time — bath, books, quiet conversation — does the neurological work of preparing the brain for sleep. You're not wasting time. You're building the biological signal." },
      { title: "Lock in a consistent sequence and protect it.", body: "Three to five steps in the same order, at the same time, every night. Bath, pajamas, two books, lights out. Or whatever works for your family — the specifics matter less than the consistency. Write it down if it helps. The routine becomes the cue." },
      { title: "Offer choices within the structure.", body: "\"Which two books tonight?\" or \"Do you want the nightlight on or off?\" keeps the routine in place while giving your child genuine agency. Kids who feel some control within the routine cooperate more, because the routine stops feeling like something done to them." },
    ],
    support: "If you've been consistent with a bedtime routine for three or more weeks and sleep onset still takes more than 45 minutes, or if your child wakes multiple times per night, it's worth talking to your pediatrician. Sleep disorders — including delayed sleep phase syndrome (common in teens), sleep apnea, and restless leg syndrome — are medical conditions that routines alone won't fix. Children with ADHD and autism also have higher rates of sleep difficulties and may need additional support beyond behavioral approaches.",
    deepDive: { label: "Healthy Bodies Calm Homes — Sleep, Food, and Movement", href: "/docs/healthy-bodies-calm-homes" },
    related: [
      { label: "Morning chaos — routines", href: "/help/routines" },
      { label: "My kid melts down over everything", href: "/help/meltdowns" },
    ],
  },
  {
    kind: "pain-point",
    slug: "homework",
    icon: Pencil,
    tag: "Homework & school",
    title: "The homework war",
    cardTeaser: "Why it turns into a battle every night — and one change that helps.",
    headline: "The homework war — why it turns into a battle every night",
    intro:
      "You've asked them to start. You've reminded them three times. Now it's a standoff — they're arguing that homework is stupid, you're arguing that it matters, and somehow an hour has passed and nothing is written down. Every evening ends with everyone frustrated, and you're starting to dread 3 PM.",
    defaultAge: "6-9",
    ageScenarios: {
      "2-5": "At this age, formal homework is rare — but if your young child refuses reading practice or simple activities, the same principles apply: decompression first, then low-demand asks.",
      "6-9": "Your 7-year-old was fine at school all day, but the moment you mention homework, the shutdown starts. They've used up their regulation capacity. There's nothing left for hard things.",
      "10-12": "Your 10-year-old sits at the desk for an hour and barely writes a sentence. They're not being lazy — they're stuck. Starting tasks is a genuine challenge, especially for kids with ADHD.",
      "13+": "Your 14-year-old swears they did the homework at school but you get emails from teachers saying it wasn't turned in. The avoidance has moved into deception because the pressure feels too high.",
    },
    whatHappening: [
      p("Homework refusal almost always has one of two drivers. The first is escape: the task feels genuinely hard, overwhelming, or aversive, and resistance has worked before to delay or avoid it. The second — less obvious but extremely common — is that the work itself is actually too hard. Not in a \"they need to try harder\" way, but in a \"this assignment is beyond where their skills currently are\" way."),
      p("When a child consistently refuses homework, it's worth asking what they're trying to escape from. A child with an unidentified reading difficulty isn't being lazy when they won't do reading assignments — they're avoiding something that feels humiliating and hard. A child with ADHD isn't being defiant when they can't start — their brain genuinely struggles to initiate tasks that don't offer immediate reward. <strong>Executive function</strong> challenges are real, not excuses."),
      p("The afternoon timing compounds everything. By 3 or 4 PM, many children's stress systems have been activated all day. Their emotional regulation is at its thinnest. Whatever capacity they had for effortful tasks has mostly been used up at school. When homework starts in that window, you're asking a depleted system to do some of its hardest work."),
    ],
    backfires: [
      { title: "Sitting next to them and managing every step.", body: "When a parent becomes the engine behind homework — prompting, redirecting, re-explaining every problem — the child's role shrinks to compliant (or resistant) passenger. They stop building independent skills, and homework becomes something that happens to them rather than something they do. Dependence deepens, not reduces." },
      { title: "Making homework the biggest event of the evening.", body: "When homework carries enormous emotional weight — when it's the source of the most conflict, the most parental attention, and the most charged conversation — it becomes aversive in its own right, independent of the content. Children avoid things that feel bad." },
      { title: "Starting immediately after school.", body: "After-school meltdowns aren't random. They often reflect a nervous system that has been working hard all day and has run out of capacity. Starting homework immediately after school — without any decompression — starts the session from a deficit." },
    ],
    tries: [
      { title: "Build in a movement break first.", body: "Give your child 30 minutes of physical activity and low-demand time after school before homework begins. Outdoor play, a bike ride, anything that clears the accumulated stress from the day. Parents who implement this consistently report significant drops in after-school resistance — because they're starting homework from a regulated state instead of a depleted one." },
      { title: "Set a time limit, not a completion requirement.", body: "\"We're going to do 20 minutes of homework, and when the timer goes off, we're done\" changes the math for your child's brain. Twenty minutes is survivable. \"Stay here until it's all finished\" is an open-ended aversive that their brain will work hard to avoid. If the work isn't done in the time limit, a note to the teacher is more appropriate than a battle." },
      { title: "Look for what's actually hard.", body: "If your child resists one subject consistently, or can't get started despite seeming willing, ask whether the material itself is the problem. Resistance that looks like defiance is often shame-based avoidance of something that feels genuinely too hard. A conversation with the teacher, or a screening for learning differences, might reveal something that explains the pattern." },
    ],
    support: "Consistent homework refusal — especially in one subject, especially paired with avoidance of similar tasks at school — is worth discussing with your child's teacher and, if needed, pursuing a learning evaluation. Dyslexia, dyscalculia, and ADHD all commonly first surface as homework resistance, because children can often mask difficulty at school but not at home. If the battle has been going on for months with no improvement despite changes at home, an evaluation through the school or a private specialist is the right next step.",
    deepDive: { label: "School Assistance and Learning Differences", href: "/docs/school-assistance-parent-guide" },
    related: [
      { label: "My kid won't listen", href: "/help/wontlisten" },
      { label: "My kid is anxious or worried", href: "/help/anxiety" },
    ],
  },
  {
    kind: "pain-point",
    slug: "aggression",
    icon: Hand,
    tag: "Aggression & hitting",
    title: "My kid hits, bites, or throws things",
    cardTeaser: "What aggressive behavior communicates — and how to respond.",
    headline: "My kid hits, bites, or throws things",
    intro:
      "It's frightening and exhausting. You're managing the injury, keeping siblings safe, trying to stay calm while something in you is panicking. And the question underneath all of it: is this normal? Is something wrong? Am I doing something wrong?",
    defaultAge: "6-9",
    ageScenarios: {
      "2-5": "Your 3-year-old bites their sibling when frustrated or throws toys when things don't go their way. This is extremely common at this age — the regulatory skills literally don't exist yet. They're not bad; they're 3.",
      "6-9": "Your 7-year-old hits when frustrated and can't say why. They look surprised afterward, like they didn't choose it. That's reactive aggression: the brain fired before thinking was involved.",
      "10-12": "Your 11-year-old slams doors, throws things, occasionally gets physical when cornered. The outbursts feel bigger than they used to because their body is bigger but their regulation hasn't caught up.",
      "13+": "Your 15-year-old doesn't throw things, but they're verbally aggressive in ways that feel frightening — threatening, intimidating, explosive. Big-body aggression in teens needs the same response principles, with safety planning added.",
    },
    whatHappening: [
      p("Aggressive behavior in children is always communicating something. It isn't random, and it isn't a character verdict on your child — or on you. There are two distinct types, and they need different responses."),
      p("The first is <strong>reactive aggression</strong>: a hot, explosive response to frustration, threat, or overwhelm. The child's <strong>threat-detection system</strong> fires before the thinking brain can intervene. This is the \"I didn't even decide to hit — I just hit\" kind. It's most common in children with ADHD, anxiety, trauma histories, or high sensory sensitivity. Their threshold for dysregulation is lower, and their ability to pause before responding is still developing."),
      p("The second is <strong>proactive aggression</strong>: more calculated, less emotional. The child has figured out that aggression works — it gets them out of a demand, gets them the toy, gets a reaction. Both matter, but they call for completely different approaches. Most early childhood aggression is reactive — a child with too-big feelings and not enough skills to handle them. The question isn't \"how do I punish this?\" It's \"what is this communicating, and what skill does my child need instead?\""),
    ],
    backfires: [
      { title: "Backing down after aggression.", body: "If your child hits and then the demand disappears — the bath gets cancelled, the homework gets postponed — their brain has received a clear message: hitting works. Every time aggression produces the result they wanted, it becomes more likely to happen again. This is the most important pattern to interrupt, and also the hardest one in the heat of the moment." },
      { title: "Trying to reason at the peak.", body: "During a full aggressive episode, the thinking brain is offline. Explanations, consequences, and lectures don't reach a dysregulated child — they just add more stimulation to an already overwhelmed system. The time for all of that is after full calm, not during." },
      { title: "Focusing only on the peak and missing the warning signs.", body: "Most aggressive episodes move through predictable stages. The earliest stages — increased tension, short sentences, a shift in body posture — are the stages where you can still change the outcome. By the time there's hitting, you've missed several windows. Learning your child's early warning signs is more powerful than any consequence." },
    ],
    tries: [
      { title: "Hold the expectation calmly after the episode.", body: "Once your child has returned to baseline — and everyone is safe — whatever they were trying to escape still applies. Calmly, matter-of-factly, without punishment or lecture: the bath still happens, the homework is still done, the desired item is still not available. This breaks the most fundamental piece of the pattern: aggression stops working as a strategy." },
      { title: "Learn the early warning signs and catch them.", body: "Think about the last three or four aggressive episodes. What happened in the 5–10 minutes before? Increased tension? Repeated questions? Body posture changes? Once you know your child's pattern, you can intervene before the peak — offer a movement break, reduce a demand, change the environment — and the episode often doesn't happen at all." },
      { title: "Teach replacement skills during calm time.", body: "\"Use your words\" isn't specific enough. Practice the specific words: \"I need a break.\" \"This is too hard.\" \"I'm angry.\" Role-play it. Praise it when it happens. Skills taught at baseline stick; skills demanded during dysregulation don't." },
    ],
    support: "Seek support if aggression is happening daily, involves injury to others, isn't decreasing over several weeks despite consistent responses, or if you can't keep everyone safe during episodes. Also seek support if your child seems to have no emotional response to aggression — no remorse, no distress, no awareness that it hurt someone. Both extremes can indicate something worth a professional evaluation. A behavioral therapist or pediatrician is the right starting point.",
    deepDive: { label: "Supporting Aggressive Children", href: "/docs/supporting-aggressive-children" },
    related: [
      { label: "My kid melts down over everything", href: "/help/meltdowns" },
      { label: "My kid won't listen", href: "/help/wontlisten" },
    ],
  },
  {
    kind: "pain-point",
    slug: "routines",
    icon: Clock,
    tag: "Routines & structure",
    title: "Morning chaos — routines",
    cardTeaser: "How structure frees up your child's brain and reduces the nagging.",
    headline: "Morning chaos — why your mornings fall apart (and how routines actually fix it)",
    intro:
      "You've said \"get dressed\" four times. Shoes are missing. Someone is still in bed. The clock is running, your voice is getting sharper, and you're leaving 12 minutes late again. By the time you get in the car, everyone is dysregulated and the day hasn't even started.",
    featured: true,
    defaultAge: "6-9",
    ageScenarios: {
      "2-5": "Morning with a toddler is chaos with shoes. Predictability is even more critical at this age — young children's brains have almost no internal sequence. Everything depends on the external routine.",
      "6-9": "Your 8-year-old knows the routine but still won't follow it without prompting. You're saying \"get dressed\" for the fourth time and they're standing in the kitchen looking at nothing.",
      "10-12": "Your 11-year-old used to manage the morning. Now they're barely functional before school. Something shifted. They need more explicit structure, not more parental nagging.",
      "13+": "Your 15-year-old won't get up. The alarm goes off six times. You're late every morning. At this age, the routine conversation has to shift — you're transferring ownership of the sequence to them, not managing it for them.",
    },
    whatHappening: [
      p("Your child's brain doesn't like surprises. It's constantly trying to predict what comes next — and when the morning routine changes day to day, or when \"get dressed\" can mean now or in fifteen minutes depending on your tone, their brain has no choice but to stay on alert, waiting to figure out what's happening. That alert state consumes the cognitive resources they'd otherwise use for actually moving through the morning."),
      p("When a predictable sequence is in place, something shifts. Their brain can relax slightly — it knows what's coming. The mental energy that was burning on \"what do I do next?\" gets freed up for actually doing the thing. This is why consistent routines reduce the constant prompting: not because your child suddenly became more obedient, but because their brain isn't working as hard to orient to the unpredictable."),
      p("The key word is consistent. An imperfect routine done the same way every day outperforms a perfect routine done three days a week. Brains learn from repetition. After three to four weeks of consistent repetition, the sequence starts to become automatic — and automatic sequences require far less adult enforcement."),
    ],
    backfires: [
      { title: "Being the external brain.", body: "When you prompt each step — \"now get dressed, now find your shoes, now brush your teeth\" — your child never builds the internal sequence. You've become the routine. The moment you're distracted or quiet, nothing happens. The goal is to externalize the routine itself, not your prompting." },
      { title: "Varying the order or timing.", body: "If breakfast sometimes comes before getting dressed and sometimes after, the sequence never becomes automatic. Automaticity requires a stable context. Variation resets the clock every time." },
      { title: "Consequences and battles during the rush.", body: "Trying to address behavior (arguing, threats, lectures) while simultaneously trying to get out the door makes both things worse. The morning is not the time for discipline. It's the time to execute the system." },
    ],
    tries: [
      { title: "Make the chart the boss, not you.", body: "Write or draw 4–5 steps on an index card or whiteboard: wake up, bathroom, dressed, breakfast, backpack. Post it where your child will see it. When they ask \"what do I do now?\" point to the chart. \"What does the chart say?\" removes you from the loop and puts the sequence in charge. This is the single highest-impact change most families can make." },
      { title: "Give five-minute warnings before each transition.", body: "\"In five minutes we're leaving. Shoes on and backpack ready.\" Advance notice gives the brain time to prepare for the shift. Without it, transitions feel like interruptions. With it, they feel expected." },
      { title: "Protect consistency for three weeks before evaluating.", body: "The routine will not feel automatic in week one. It won't feel much easier in week two. By week three to four, with genuine consistency (same order, same time, every day), it starts to shift. Many parents give up at day seven, right before the payoff. Give it the full window." },
    ],
    support: "If you've been consistent for four or more weeks and mornings are still taking more than twice the expected time, or if your child is completely unable to transition out of bed or through sequences despite the routine, it's worth talking to your pediatrician. ADHD, anxiety, and sensory sensitivities all commonly interfere with morning routines in ways that go beyond what structure alone can fix — and there are specific supports for all three.",
    deepDive: { label: "How Structure and Routines Actually Help", href: "/docs/structure-routines-parenting" },
    related: [
      { label: "Bedtime battles", href: "/help/bedtime" },
      { label: "My kid won't listen", href: "/help/wontlisten" },
    ],
  },
  {
    kind: "pain-point",
    slug: "teen",
    icon: Angry,
    tag: "Teen brain & rebellion",
    title: "My teenager hates me",
    cardTeaser: "What's actually happening in the teen brain — and why it's not a failure.",
    headline: "My teenager hates me (or at least acts like it)",
    intro:
      "They roll their eyes at everything you say. They used to tell you things; now you get one-word answers. They're questioning your values, pushing back on your rules, and acting like they've never needed you. You're watching a child you know deeply become a stranger — and wondering if you did something wrong, or if you're losing them.",
    defaultAge: "13+",
    ageScenarios: {
      "2-5": "This page is for parents of teenagers. If your younger child is showing strong-willed behavior, see \"My kid won't listen.\"",
      "6-9": "This page is for parents of teenagers. If your elementary-age child is showing defiance, see \"My kid won't listen.\"",
      "10-12": "Your 12-year-old is in the early stages — the eye-rolls have started, they're embarrassed by you in public, they want more say in everything. This is the very beginning of the process.",
      "13+": "Your 15-year-old seems to have decided you don't know anything useful. They question every rule, minimize every conversation, and act like existing in your house is a minor inconvenience.",
    },
    whatHappening: [
      p("Adolescence has one central developmental task: your teenager has to become a self-governing person. To do that, they have to differentiate from you — build a sense of who they are that isn't defined by your approval or your evaluation. Some conflict, some pulling away, some questioning of your values: this isn't a sign the relationship is failing. It's the process of <strong>individuation</strong>, and it's exactly what's supposed to happen."),
      p("Your teenager's brain is also under active construction. The reward-seeking, sensation-seeking part develops around puberty. The impulse-control, future-planning part — the <strong>prefrontal cortex</strong> — doesn't fully come online until the mid-20s. This mismatch is why your teenager wants adult-level independence while still demonstrating very un-adult-level judgment. It's not stubbornness. It's neurology."),
      p("The harder your teenager pushes for autonomy, the more effective approaches shift. Control that worked in childhood starts backfiring. What actually works now is the combination of two things: maintaining clear behavioral limits (curfews, expectations, monitoring) while releasing psychological control — giving up the drive to control who they are, how they feel, what they think. Those are very different things."),
    ],
    backfires: [
      { title: "Tightening control when they pull away.", body: "When your teenager becomes secretive or resistant, the instinct is to monitor more, restrict more, push harder for answers. But tighter control typically produces more secrecy, not less. Psychological control — guilt, shame, withdrawing love — is consistently associated with higher rates of depression and anxiety in adolescents, not better compliance." },
      { title: "Treating differentiation as rejection.", body: "When your teenager criticizes you, challenges your values, or seems to not need you, it reads as rejection. Many parents respond by pulling back themselves, or by pushing harder for the connection they had before. But your teenager isn't rejecting you — they're practicing being separate from you. Those are completely different things." },
      { title: "Interrogating instead of being alongside.", body: "A string of direct questions (\"How was school? What did you do? Who were you with?\") can feel invasive to a teenager who is actively building a private inner life. What keeps teenagers talking to their parents is usually low-pressure, parallel time — driving together, cooking together, doing something side-by-side with no agenda." },
    ],
    tries: [
      { title: "Separate behavioral limits from psychological control.", body: "You set the curfew. You maintain oversight of where they are. You hold the expectation that they're in school. These are behavioral limits and they're entirely appropriate. But \"what you think is wrong\" and \"how you feel is too sensitive\" and \"who you're becoming concerns me\" — these are psychological control, and they push your teenager further away, not closer." },
      { title: "Use collaborative problem-solving when there's conflict.", body: "Instead of \"here's the rule,\" try \"here's my concern — what are you thinking?\" Your teenager's reasons matter to them, and taking them seriously keeps the conversation going. You don't have to agree to listen. A solution they had input on is far more likely to be honored than one handed down from above." },
      { title: "Find the low-pressure on-ramp.", body: "Teenagers don't usually open up in sit-down conversations. They open up in the car, during a walk, while you're doing something parallel with your hands. Build in one regular side-by-side activity — nothing formal, nothing agenda-driven. Just being together in a way that feels optional. That's often when the real conversations happen." },
    ],
    support: "Teenage pushing-away is normal. But some signs warrant professional attention: significant withdrawal from all relationships (not just you), declining grades that represent a real change, loss of interest in everything they used to enjoy, expressions of hopelessness, or any mention of not wanting to be alive. Teen depression often looks like irritability and flatness, not sadness. If you're uncertain whether what you're seeing is development or distress, a conversation with your pediatrician or a therapist is the right call.",
    deepDive: { label: "Supporting Your Teen's Autonomy and Identity", href: "/docs/teen-autonomy-identity-support" },
    related: [
      { label: "My kid is anxious or worried", href: "/help/anxiety" },
      { label: "What do I do about screens?", href: "/help/screens" },
    ],
  },
  {
    kind: "pain-point",
    slug: "burnout",
    icon: HeartCrack,
    tag: "Parent burnout",
    title: "I'm burnt out",
    cardTeaser: "The biology of parental burnout and what restoration actually looks like.",
    headline: "I'm burnt out — and I don't know how to keep going",
    intro:
      "You're snapping at your kids more than you'd like. You're going through the motions but not really there. The moments that used to feel meaningful aren't landing the way they used to. You feel like a worse version of yourself, and you're starting to wonder if this is just who you are now. It isn't.",
    defaultAge: "6-9",
    ageScenarios: {
      "2-5": "You have a toddler and you're running on no sleep, constant demands, and the exhaustion of being needed every moment of every day. Parent burnout at this stage is extremely common and extremely invisible.",
      "6-9": "Your kids are old enough to be in school, but somehow you're still depleted. The morning routine, the homework battles, the emotional labor — you expected it to get easier. It got different.",
      "10-12": "You're parenting a kid whose emotions are bigger but who doesn't want your help the way they used to. The middle years are emotionally demanding in ways nobody prepares you for.",
      "13+": "You're parenting a teenager who seems to need you less but actually needs you more, in harder ways. The chronic stress of teen parenting — plus everything else — adds up.",
    },
    whatHappening: [
      p("Parental burnout develops when demands consistently exceed your capacity to recover — not in one bad week, but over months or years of chronic stress without enough restoration. It's a predictable biological response, not a character flaw."),
      p("Here's the neurological piece: chronic stress literally shrinks the <strong>prefrontal cortex</strong> — the part of your brain that handles patience, impulse control, and thoughtful decision-making. Under prolonged stress, that part becomes less available, and the reactive brain takes over more often. This is why you're losing your temper over things that didn't used to bother you. It's why you know the better response in the moment but can't access it. Your brain isn't broken — it's depleted."),
      p("There's also a <strong>co-regulation</strong> piece your kids need you to understand. Your nervous system is your child's teacher. When you're regulated — calm, present, steady — your child's nervous system settles in response. When you're chronically activated — running hot, numb, or reactive — your child picks up on that, and their behavior often escalates. Taking care of yourself is not separate from good parenting. It is the foundation of it."),
    ],
    backfires: [
      { title: "Pushing through.", body: "Burnout doesn't resolve by trying harder. The effort of trying to parent well from a depleted state burns the remaining reserves faster. Rest and restoration aren't rewards for surviving — they're the inputs that make survival possible." },
      { title: "Self-criticism.", body: "\"I should be able to handle this\" keeps your threat system activated, which deepens the stress load. Research shows self-criticism actually increases the difficulty of behavior change, not decreases it. Self-compassion — speaking to yourself the way you'd speak to a friend in the same situation — is not lowering your standards. It's what actually allows growth and adjustment." },
      { title: "Isolation and shame.", body: "Burnout gets worse when you keep it to yourself. The shame that makes you want to hide it is often the biggest barrier to recovery. Every parent who looks like they're handling it is working with something you can't see — a partner who takes nights, a nearby parent, therapy, their own private struggles. You're not uniquely failing." },
    ],
    tries: [
      { title: "Identify your earliest warning sign and act on it.", body: "Before you reach the point where you're snapping at everything, there's an earlier signal — maybe your shoulders tense, maybe you start dreading your child's bedtime routine, maybe you notice yourself reaching for your phone to escape. Find that earliest signal and treat it as an alarm: I need to do something now, before I'm in crisis. Small early interventions prevent large later ones." },
      { title: "Start with three things: sleep, movement, connection.", body: "Not a wellness overhaul. Just these three: one night of continuous sleep per week if you can arrange it, 15 minutes of walking or movement three to four times per week, and one honest conversation with an adult who will just listen. These three address the biological and social roots of burnout directly. They're the minimum viable restoration plan." },
      { title: "Let yourself be imperfect without adding shame on top.", body: "You'll have days where none of this happens. The goal is not perfect execution — it's a trend line that's moving toward restoration. A bad day followed by self-criticism is two bad days. A bad day followed by \"that was hard, what do I need right now?\" is one." },
    ],
    support: "Seek professional support if you're experiencing persistent low mood or hopelessness, if you're having thoughts of harming yourself or your child (even briefly), if you're relying on alcohol or substances to get through the day, or if you feel completely isolated with no one to reach out to. Parental burnout frequently co-occurs with depression and anxiety, both of which have effective treatments. Reaching out isn't dramatic — it's practical. You don't have to be at a crisis point to deserve support.",
    crisis: true,
    deepDive: { label: "Parental Self-Care", href: "/docs/parental-self-care" },
    related: [
      { label: "Why modern parenting is so hard", href: "/help/modern" },
      { label: "My kid melts down over everything", href: "/help/meltdowns" },
    ],
  },
];

export const awarenessModules: AwarenessModule[] = [
  {
    kind: "module",
    slug: "modern",
    icon: Globe,
    tag: "Awareness",
    title: "Why modern parenting is so hard",
    cardTeaser: "The structural reasons the role feels harder than a generation ago.",
    headline: "Why modern parenting is so hard (and why it's not because of you)",
    intro:
      "If you feel like you're doing everything right and still drowning — you're not imagining it. Parenting in 2026 is genuinely more demanding than it was a generation ago. The expectations are higher, the costs are steeper, the support systems are thinner, and an entirely new domain of parenting appeared out of nowhere with no cultural playbook to inherit.",
    sections: [
      {
        heading: "The numbers don't lie",
        body: [
          p("In 1965, mothers spent an average of 54 minutes per day on direct childcare. By the early 2000s, that number had more than doubled — to over 100 minutes — even as maternal employment also increased. Fathers went from 16 minutes per day to nearly an hour. This didn't happen because families suddenly had more free time. It happened on top of everything else."),
          stat("The U.S. Surgeon General issued a formal advisory in 2024 on the mental health of parents. Nearly half of parents report overwhelming stress most days — compared to about one in four adults without children."),
          p("That gap isn't explained by personality. It's explained by what the role currently demands."),
        ],
      },
      {
        heading: "What actually changed",
        body: [
          p("<strong>The economics of childhood got more competitive.</strong> Research across 11 countries found that in societies with higher income inequality, parents invest more intensively in their children — more time, more supervision, more pressure. Not because they love their kids more, but because the stakes feel higher. When parents are anxious about their child being left behind, they pour in more — and that's actually a rational calculation, not neurosis."),
          p("<strong>The village disappeared.</strong> Extended family nearby, neighbors who knew your kids, informal community networks that once shared the load of childcare and supervision — most of that has dissolved. The labor market required mobility. Neighborhoods became more transient. The organic web of support that prior generations could count on frayed without replacement. Many parents today are carrying a load that used to be distributed across multiple people — largely alone."),
          p("<strong>Childhood went digital in five years.</strong> Before 2012, childhood was largely analog and play-based. By 2015, roughly 80% of adolescents had smartphones. Social media became the primary space where peer relationships lived. That transformation took about five years. Parenting norms, which typically evolve over generations, had no time to catch up. Today, parents are expected to navigate an entirely new domain — monitoring online content, managing digital peer dynamics, making judgment calls about device use — that no prior generation did. There's no established wisdom to inherit because no one else has been here before."),
          p("<strong>The standard for \"good parenting\" expanded dramatically.</strong> Access to child development research has produced genuinely better outcomes for children on average. It has also produced a new layer of pressure: parents who know they're supposed to co-regulate their child's emotions while managing their own, validate feelings while holding firm limits, stay attuned to developmental needs while also working full time, managing the household, and keeping everyone fed. When the research-based standard becomes a performance standard, it produces burnout, not resilience."),
        ],
      },
      {
        heading: "Who carries the heaviest load",
        body: [
          p("These pressures don't distribute equally. Single parents carry both the financial and childcare burden alone. Parents of children with higher needs — ADHD, autism, anxiety, trauma histories — face a baseline demand burden that's genuinely higher than the average parenting experience. Mothers, even in two-parent households, still carry an average of nearly 15 more hours per week of unpaid domestic labor than fathers when both work full-time. Parents doing cycle-breaking work — consciously parenting differently than they were raised — do metacognitive labor in every triggered moment that other parents don't."),
          p("Understanding which of these situations is yours isn't about comparison. It's about finding strategies that actually fit your life, rather than generic advice built around a family that doesn't look like yours."),
        ],
      },
      {
        heading: "What this means",
        body: [
          p("Understanding that modern parenting stress is structural — not a personal failure — is genuinely useful, not just philosophically but practically. Research on cognitive reframing shows that shifting from \"I can't handle this\" to \"I'm responding reasonably to real constraints\" reduces shame and increases sense of agency. Shame immobilizes. Clarity makes next steps possible."),
          p("If you're struggling, you're in good company — and the struggle reflects the real demands of the role, not a deficiency in you. That's the starting point. From here, there are things that actually help."),
        ],
      },
    ],
    related: [
      { label: "I'm burnt out — and I don't know how to keep going", href: "/help/burnout" },
      { label: "The state of children's mental health in the United States", href: "/help/mentalhealth" },
      { label: "Where can you use support today?", href: "/help" },
    ],
  },
  {
    kind: "module",
    slug: "mentalhealth",
    icon: TrendingUp,
    tag: "Context",
    title: "Children's mental health in the U.S.",
    cardTeaser: "What the data says — and what it means for your family right now.",
    headline: "The state of children's mental health in the United States",
    intro:
      "Something shifted in children's mental health around 2012, and it has continued to worsen since. If your child is struggling with anxiety, depression, school refusal, or emotional dysregulation — you're not dealing with a parenting failure or a uniquely troubled kid. You're watching your child navigate one of the most challenging environments for mental health that children in this country have ever faced.",
    sections: [
      {
        heading: "What the data shows",
        body: [
          stat("Between 2007 and 2021, rates of depression among adolescents in the U.S. roughly doubled. Emergency department visits for self-harm among girls ages 10–14 nearly tripled over the same period."),
          p("That inflection point around 2012 coincides almost exactly with when smartphones became ubiquitous and social media became the primary space for adolescent peer interaction."),
          p("<strong>The adolescent mental health crisis has been declared a national emergency</strong> by multiple major medical organizations. In 2021, the American Academy of Pediatrics, the American Academy of Child and Adolescent Psychiatry, and the Children's Hospital Association issued a joint declaration. In 2023, the U.S. Surgeon General issued a second advisory specifically about adolescent social media use."),
          stat("Approximately 1 in 7 children in the United States has a diagnosed mental health condition. Anxiety disorders alone affect roughly 9% of children ages 3–17."),
          p("<strong>The mental health workforce cannot meet the demand.</strong> Wait times for child therapists in many parts of the country are measured in months. Pediatricians are increasingly serving as the de facto mental health providers for children, without the training to do so."),
        ],
      },
      {
        heading: "What's driving it",
        body: [
          p("The causes are multiple and interacting. Social media changed the fabric of adolescent social life — creating 24/7 access to social comparison, peer evaluation, and the possibility of public humiliation. Sleep deprivation increased as devices moved into bedrooms. Physical activity declined. In-person unstructured play — which is how children have historically developed emotional regulation and social skills — dropped significantly."),
          p("At the same time, children are growing up in a world that feels more uncertain to them than it did to prior generations. Climate anxiety is measurably elevated in adolescents. Political instability, school safety concerns, and economic precarity in their families all register. Children are more permeable to the ambient stress of the adult world than most adults realize."),
          p("Pandemic effects compounded all of this. Two or more years of disrupted schooling, social isolation, and family stress during developmentally critical periods produced measurable effects on children's social development, anxiety levels, and academic trajectories — effects that are still playing out."),
        ],
      },
      {
        heading: "What this doesn't mean",
        body: [
          p("It doesn't mean your child is broken, or that you missed something critical. Children with mental health struggles are not suffering from weak character or soft parenting. Their brains are responding to real environmental inputs in predictable ways."),
          p("It doesn't mean medication or intensive treatment is necessarily what your child needs. Most children benefit from a combination of informed parenting adjustments, environmental changes, and when indicated, professional support. Not every child who is anxious needs a therapist. Some do."),
          p("It also doesn't mean nothing helps. Research consistently shows that effective interventions exist, that parental behavior matters significantly, and that children's mental health can improve with the right support. This isn't a crisis without exits."),
        ],
      },
      {
        heading: "Signs that warrant professional attention",
        body: [
          p("Seek professional support if your child:"),
          list([
            "Has persistent anxiety or low mood lasting more than two weeks that significantly affects their daily life",
            "Is missing school regularly due to emotional distress",
            "Has withdrawn from friends, activities, and family — more than typical moodiness",
            "Is having trouble sleeping, eating, or concentrating in ways that represent a real change",
            "Has expressed hopelessness, talked about death, or engaged in any self-harm",
          ]),
          p("Your first call is usually your pediatrician, who can screen, refer, and discuss options. School counselors are another access point. If your child refuses therapy, parent-only programs (like SPACE for anxiety) can be effective without requiring the child to participate."),
        ],
      },
    ],
    crisis: true,
    related: [
      { label: "My kid is anxious or worried — and won't go to school", href: "/help/anxiety" },
      { label: "I'm burnt out — and I don't know how to keep going", href: "/help/burnout" },
      { label: "Why modern parenting is so hard", href: "/help/modern" },
    ],
  },
];

export const allHelpEntries: HelpEntry[] = [...painPoints, ...awarenessModules];

export function getHelpEntry(slug: string): HelpEntry | undefined {
  return allHelpEntries.find((entry) => entry.slug === slug);
}

export function getFeaturedPainPoints(): PainPointTopic[] {
  return painPoints.filter((topic) => topic.featured);
}
