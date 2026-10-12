import type { MetadataRoute } from "next";

// Training crawlers harvest content into a foundation model's training set - blocked site-wide.
// Retrieval/answer crawlers (ChatGPT Search, Perplexity, Claude web search) fetch live to answer
// a user's question and cite it back - allowed the same as Googlebot.
// Bot names shift over time; recheck against each provider's published crawler docs periodically.
const TRAINING_CRAWLERS = [
  "GPTBot", // OpenAI — training
  "ClaudeBot", // Anthropic — training
  "anthropic-ai", // Anthropic — legacy training token
  "Google-Extended", // Google — Gemini/Vertex training only, doesn't affect Search or AI Overviews
  "CCBot", // Common Crawl — widely reused as training data
  "Bytespider", // ByteDance — training
  "Applebot-Extended", // Apple Intelligence training (separate from Applebot)
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

// Paths that no crawler should index: admin panel, auth flows, gated pages, and API routes.
const PRIVATE_PATHS = [
  "/admin",
  "/community",
  "/courses",
  "/account",
  "/sign-in",
  "/welcome",
  "/api/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin"],
      },
      ...RETRIEVAL_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/admin"],
      })),
      ...TRAINING_CRAWLERS.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: [...PRIVATE_PATHS, "/docs/", "/common-pain-points/"],
      },
    ],
    sitemap: "https://bobby-washburn.com/sitemap.xml",
  };
}
