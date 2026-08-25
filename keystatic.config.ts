import { config, fields, collection, singleton } from "@keystatic/core";

// Keep in sync with lib/pain-point-icons.ts's PAIN_POINT_ICONS map.
const PAIN_POINT_ICON_OPTIONS = [
  { label: "Flame", value: "Flame" },
  { label: "Smartphone", value: "Smartphone" },
  { label: "Ear", value: "Ear" },
  { label: "Cloud lightning", value: "CloudLightning" },
  { label: "Moon", value: "Moon" },
  { label: "Pencil", value: "Pencil" },
  { label: "Hand", value: "Hand" },
  { label: "Clock", value: "Clock" },
  { label: "Angry", value: "Angry" },
  { label: "Heart crack", value: "HeartCrack" },
  { label: "Globe", value: "Globe" },
  { label: "Trending up", value: "TrendingUp" },
] as const;

const AGE_BAND_OPTIONS = [
  { label: "2-5", value: "2-5" },
  { label: "6-9", value: "6-9" },
  { label: "10-12", value: "10-12" },
  { label: "13+", value: "13+" },
] as const;

const contentBlockField = fields.conditional(
  fields.select({
    label: "Block type",
    options: [
      { label: "Paragraph", value: "p" },
      { label: "Stat callout", value: "stat" },
      { label: "Bulleted list", value: "list" },
    ],
    defaultValue: "p",
  }),
  {
    p: fields.text({
      label: "Text",
      multiline: true,
      description: "Basic HTML allowed, e.g. <strong>bold</strong>.",
    }),
    stat: fields.text({
      label: "Stat text",
      multiline: true,
      description: "Basic HTML allowed, e.g. <strong>bold</strong>.",
    }),
    list: fields.array(fields.text({ label: "Item" }), {
      label: "List items",
    }),
  },
);

const linkRefField = fields.object({
  label: fields.text({ label: "Link text", validation: { isRequired: true } }),
  href: fields.url({ label: "URL", validation: { isRequired: true } }),
});

export default config({
  storage: {
    kind: "github",
    repo: { owner: "BobbyW08", name: "ResearchBibleWebsite" },
  },

  collections: {
    testimonials: collection({
      label: "Testimonials",
      slugField: "internalLabel",
      path: "content/testimonials/*",
      format: { data: "yaml" },
      entryLayout: "form",
      columns: ["attribution"],
      schema: {
        internalLabel: fields.slug({
          name: {
            label: "Internal label",
            description:
              'For your reference only, not shown on the site — e.g. "Parent of a teen — RI".',
          },
        }),
        quote: fields.text({
          label: "Quote",
          multiline: true,
          validation: { isRequired: true },
        }),
        attribution: fields.text({
          label: "Attribution",
          validation: { isRequired: true },
        }),
      },
    }),

    painPoints: collection({
      label: "Pain Points",
      slugField: "slugName",
      path: "content/pain-points/*",
      format: { data: "yaml" },
      entryLayout: "form",
      columns: ["title"],
      schema: {
        slugName: fields.slug({
          name: {
            label: "Slug",
            description: "Used in the URL: /help/<slug>. Changing this breaks existing links.",
          },
        }),
        icon: fields.select({
          label: "Icon",
          options: PAIN_POINT_ICON_OPTIONS,
          defaultValue: "Flame",
        }),
        featured: fields.checkbox({
          label: "Featured on homepage",
          defaultValue: false,
        }),
        tag: fields.text({ label: "Tag / eyebrow", validation: { isRequired: true } }),
        title: fields.text({ label: "Title (card + index)", validation: { isRequired: true } }),
        cardTeaser: fields.text({
          label: "Card teaser",
          multiline: true,
          validation: { isRequired: true },
        }),
        headline: fields.text({ label: "Page headline", validation: { isRequired: true } }),
        intro: fields.text({ label: "Intro paragraph", multiline: true, validation: { isRequired: true } }),
        defaultAge: fields.select({
          label: "Default age band shown",
          options: AGE_BAND_OPTIONS,
          defaultValue: "6-9",
        }),
        ageScenario25: fields.text({ label: "Age scenario: 2-5", multiline: true }),
        ageScenario69: fields.text({ label: "Age scenario: 6-9", multiline: true }),
        ageScenario1012: fields.text({ label: "Age scenario: 10-12", multiline: true }),
        ageScenario13plus: fields.text({ label: "Age scenario: 13+", multiline: true }),
        whatHappening: fields.array(contentBlockField, {
          label: "What's happening",
          itemLabel: (props) => props.discriminant,
        }),
        backfires: fields.array(
          fields.object({
            title: fields.text({ label: "Title", validation: { isRequired: true } }),
            body: fields.text({ label: "Body", multiline: true, validation: { isRequired: true } }),
          }),
          { label: "Why this usually makes it worse", itemLabel: (props) => props.fields.title.value || "New item" },
        ),
        tries: fields.array(
          fields.object({
            title: fields.text({ label: "Title", validation: { isRequired: true } }),
            body: fields.text({ label: "Body", multiline: true, validation: { isRequired: true } }),
          }),
          { label: "Try this week", itemLabel: (props) => props.fields.title.value || "New item" },
        ),
        support: fields.text({
          label: "When to get more support",
          multiline: true,
          validation: { isRequired: true },
        }),
        crisis: fields.checkbox({ label: "Show 988 / Crisis Text Line / 211 resources", defaultValue: false }),
        deepDiveLabel: fields.text({ label: "Deep dive link label", validation: { isRequired: true } }),
        deepDiveHref: fields.url({ label: "Deep dive link URL", validation: { isRequired: true } }),
        related: fields.array(linkRefField, {
          label: "Related pain points",
          itemLabel: (props) => props.fields.label.value || "New link",
        }),
      },
    }),

    awarenessModules: collection({
      label: "Awareness Modules",
      slugField: "slugName",
      path: "content/awareness-modules/*",
      format: { data: "yaml" },
      entryLayout: "form",
      columns: ["title"],
      schema: {
        slugName: fields.slug({
          name: {
            label: "Slug",
            description: "Used in the URL: /help/<slug>. Changing this breaks existing links.",
          },
        }),
        icon: fields.select({
          label: "Icon",
          options: PAIN_POINT_ICON_OPTIONS,
          defaultValue: "Globe",
        }),
        tag: fields.text({ label: "Tag / eyebrow", validation: { isRequired: true } }),
        title: fields.text({ label: "Title (card + index)", validation: { isRequired: true } }),
        cardTeaser: fields.text({
          label: "Card teaser",
          multiline: true,
          validation: { isRequired: true },
        }),
        headline: fields.text({ label: "Page headline", validation: { isRequired: true } }),
        intro: fields.text({ label: "Intro paragraph", multiline: true, validation: { isRequired: true } }),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: "Heading", validation: { isRequired: true } }),
            body: fields.array(contentBlockField, {
              label: "Body",
              itemLabel: (props) => props.discriminant,
            }),
          }),
          { label: "Sections", itemLabel: (props) => props.fields.heading.value || "New section" },
        ),
        crisis: fields.checkbox({ label: "Show 988 / Crisis Text Line / 211 resources", defaultValue: false }),
        related: fields.array(linkRefField, {
          label: "Related topics",
          itemLabel: (props) => props.fields.label.value || "New link",
        }),
      },
    }),

    researchBibles: collection({
      label: "Research Bibles",
      slugField: "slugName",
      path: "content/research-bibles/*/",
      format: { contentField: "body" },
      entryLayout: "form",
      columns: ["title"],
      schema: {
        slugName: fields.slug({ name: { label: "Slug" } }),
        title: fields.text({ label: "Title", validation: { isRequired: true } }),
        version: fields.text({ label: "Version (auto-computed by sync, do not hand-edit)" }),
        lastUpdated: fields.date({ label: "Last updated" }),
        tags: fields.array(fields.text({ label: "Tag" }), { label: "Tags" }),
        noindex: fields.checkbox({ label: "Hide from search engines", defaultValue: false }),
        changelog: fields.array(
          fields.object({
            date: fields.date({ label: "Date" }),
            summary: fields.text({ label: "Summary", multiline: true }),
            prUrl: fields.url({ label: "PR URL" }),
          }),
          { label: "Changelog", itemLabel: (props) => props.fields.summary.value || "New entry" },
        ),
        body: fields.mdx({ label: "Body" }),
      },
    }),
  },

  singletons: {
    faq: singleton({
      label: "FAQ",
      path: "content/faq/data",
      format: { data: "yaml" },
      schema: {
        items: fields.array(
          fields.object({
            question: fields.text({
              label: "Question",
              validation: { isRequired: true },
            }),
            answer: fields.text({
              label: "Answer",
              multiline: true,
              description:
                "Plain text. Leave a blank line between paragraphs — rendered as-is, no markdown.",
              validation: { isRequired: true },
            }),
          }),
          {
            label: "Questions",
            itemLabel: (props) => props.fields.question.value || "New question",
            validation: { length: { min: 1 } },
          },
        ),
      },
    }),

    footer: singleton({
      label: "Footer",
      path: "content/footer/data",
      format: { data: "yaml" },
      schema: {
        tagline: fields.text({
          label: "Tagline",
          defaultValue: "Parenting support from someone who's been there.",
        }),
        contactEmail: fields.text({
          label: "Contact email",
          defaultValue: "bobbywashburn0@gmail.com",
        }),
        copyrightText: fields.text({
          label: "Copyright / disclaimer line",
          multiline: true,
          defaultValue:
            "© 2026 Bobby Washburn. Peer support and parenting education — not therapy, diagnosis, or medical advice.",
        }),
      },
    }),

    siteSettings: singleton({
      label: "Site Settings",
      path: "content/site-settings/data",
      format: { data: "yaml" },
      schema: {
        substackSubdomain: fields.text({
          label: "Substack subdomain",
          description:
            'Just the subdomain, e.g. "roughlyeducated" for roughlyeducated.substack.com. Needs Bobby\'s confirmation before it drives the embed.',
          defaultValue: "roughlyeducated",
          validation: { isRequired: true },
        }),
        calComUrl: fields.url({
          label: "Cal.com booking URL",
          defaultValue: "https://cal.com/bobby-washburn/intro-call",
          validation: { isRequired: true },
        }),
      },
    }),

    about: singleton({
      label: "About Page",
      path: "content/about/data",
      format: { data: "yaml" },
      schema: {
        // Per homepage-redesign-v3.md / Bobby_Washburn_Site_Copy_redux_v1.docx:
        // the H1 itself is fixed plain copy ("About Bobby"), not a CMS field —
        // the "You don't need fixing..." headline and the framework strip were
        // dropped in the final redesign, and there's no per-field variant of a
        // one-line page title worth exposing here.
        heroSubhead: fields.text({
          label: "Hero subhead",
          validation: { isRequired: true },
          defaultValue: "Peer support to help you handle this, and whatever's next.",
        }),
        credentialBadge: fields.text({
          label: "Credential badge (near photo)",
          validation: { isRequired: true },
          defaultValue: "CPRS Certified · RI Board #202153",
        }),
        photo: fields.image({
          label: "Photo",
          directory: "public/images/about",
          publicPath: "/images/about/",
          description:
            "Not live yet — the page shows a placeholder box until this is set.",
        }),
        shortAboutParagraphs: fields.array(fields.text({ label: "Paragraph", multiline: true }), {
          label: "Short About Me — paragraphs",
          itemLabel: (props) => props.value.slice(0, 60) || "New paragraph",
        }),
        cprsId: fields.text({ label: "CPRS ID line", validation: { isRequired: true } }),
        currentRole: fields.text({ label: "Current role", multiline: true, validation: { isRequired: true } }),
        training: fields.array(fields.text({ label: "Item" }), { label: "Training list" }),
        prior: fields.text({ label: "Prior (military etc.)", multiline: true, validation: { isRequired: true } }),
        also: fields.text({ label: "Also (publications etc.)", multiline: true }),
      },
    }),
  },
});
