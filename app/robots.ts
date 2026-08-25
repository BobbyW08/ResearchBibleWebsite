import type { MetadataRoute } from "next";

// See CLAUDE.md's "Content Protection / SEO" section — this enforces a rule
// that was described there but never had an actual robots file backing it
// until now: block AI/bulk-scraping crawlers from /docs/ and /common-pain-points/
// (the long-form parent-facing content), while leaving Googlebot with full
// access for indexing. /research/ is intentionally NOT disallowed here — the
// per-entry `noindex` field in the researchBibles collection controls
// visibility for individual bibles instead (see app/research/[slug]/page.tsx
// generateMetadata).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/docs/", "/common-pain-points/"],
      },
    ],
    sitemap: "https://bobby-washburn.com/sitemap.xml",
  };
}
