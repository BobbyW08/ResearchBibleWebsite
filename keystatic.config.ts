import { config, fields, collection, singleton } from "@keystatic/core";

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
        sections: fields.array(
          fields.object({
            title: fields.text({ label: "Section title" }),
            links: fields.array(
              fields.object({
                title: fields.text({ label: "Link text" }),
                linkType: fields.conditional(
                  fields.select({
                    label: "Link type",
                    options: [
                      { label: "Regular URL", value: "url" },
                      { label: "Newsletter signup modal", value: "newsletter" },
                      { label: "Coming soon (disabled)", value: "comingSoon" },
                    ],
                    defaultValue: "url",
                  }),
                  {
                    url: fields.object({
                      href: fields.url({
                        label: "URL",
                        validation: { isRequired: true },
                      }),
                    }),
                    newsletter: fields.empty(),
                    comingSoon: fields.empty(),
                  },
                ),
              }),
              {
                label: "Links",
                itemLabel: (props) => props.fields.title.value || "New link",
              },
            ),
          }),
          {
            label: "Sections",
            itemLabel: (props) => props.fields.title.value || "New section",
          },
        ),
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
  },
});
