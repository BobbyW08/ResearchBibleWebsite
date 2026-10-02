import type { MetadataRoute } from "next";

// See CLAUDE.md's "Content Protection / SEO" section. AI crawlers are split
// by what they're actually used for, not blocked as a single "AI bots" bucket:
//
// - Training crawlers harvest content into a foundation model's training
//   set — blocked site-wide. This is the "don't let AI steal it" half.
// - Retrieval/answer crawlers (ChatGPT Search, Perplexity, Claude's web
//   search) fetch a page live to answer one user's specific question and
//   cite it back, the same function a search engine serves — allowed the
//   same as Googlebot. This is the "let AI find and cite it" half.
//
// Per-page visibility (e.g. a research bible that should stay out of every
// engine's results while still being crawled — see the researchBibles
// `noindex` field) is controlled via each page's own `robots` metadata, not
// here — robots.txt only decides whether a bot may fetch a page at all.
//
// Bot names shift over time; recheck against each provider's published
// crawler docs periodically rather than assuming this list stays current.
const TRAINING_CRAWLERS = [
  "GPTBot", // OpenAI — training
  "ClaudeBot", // Anthropic — training
  "anthropic-ai", // Anthropic — legacy training token
  "Google-Extended", // Google — Gemini/Vertex training only, doesn't affect Search or AI Overviews
  "CCBot", // Common Crawl — widely reused as training data
  "Bytespider", // ByteDance — training
  "Applebot-Extended", // Apple Intelligence training (separate from Applebot, which serves Siri/Spotlight)
  "Meta-ExternalAgent", // Meta — training
  "Amazonbot", // Amazon — training
  "Diffbot",
];

const RETRIEVAL_CRAWLERS = [
  "OAI-SearchBot", // ChatGPT Search
  "ChatGPT-User", // live fetch during a ChatGPT session
  "Claude-SearchBot", // Anthropic — search retrieval
  "Claude-User", // live fetch during a Claude session
  "PerplexityBot", // Perplexity's answer index
  "Perplexity-User", // live fetch during a Perplexity session
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      ...RETRIEVAL_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
      ...TRAINING_CRAWLERS.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/docs/", "/common-pain-points/"],
      },
    ],
    sitemap: "https://bobby-washburn.com/sitemap.xml",
  };
}
