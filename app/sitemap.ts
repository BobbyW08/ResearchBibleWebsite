import type { MetadataRoute } from "next";
import { getAllHelpEntries } from "@/lib/pain-points-reader";
import { getAllResearchBibles } from "@/lib/research-bibles-reader";
import { getPayloadClient } from "@/lib/payload-client";

const SITE_URL = "https://bobby-washburn.com";

const STATIC_ROUTES = [
  "/",
  "/about-bobby",
  "/services",
  "/services/organizations",
  "/common-pain-points",
  "/tech-safety",
  "/docs",
  "/research",
  "/legal",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient().catch(() => null);
  const deepDiveDocs = payload
    ? (
        await payload
          .find({
            collection: "deep-dives",
            where: { _status: { equals: "published" } },
            limit: 200,
            depth: 0,
          })
          .catch(() => ({ docs: [] }))
      ).docs
    : [];

  const [helpEntries, bibles] = await Promise.all([
    getAllHelpEntries(),
    getAllResearchBibles(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));

  const docsEntries: MetadataRoute.Sitemap = (deepDiveDocs as { slug?: string }[])
    .filter((d) => d.slug)
    .map((d) => ({
      url: `${SITE_URL}/docs/${d.slug}`,
    }));

  const helpEntriesSitemap: MetadataRoute.Sitemap = helpEntries.map((entry) => ({
    url: `${SITE_URL}/common-pain-points/${entry.slug}`,
  }));

  const researchEntries: MetadataRoute.Sitemap = bibles
    .filter((bible) => !bible.noindex)
    .map((bible) => ({
      url: `${SITE_URL}/research/${bible.slug}`,
      lastModified: bible.lastUpdated ?? undefined,
    }));

  return [...staticEntries, ...docsEntries, ...helpEntriesSitemap, ...researchEntries];
}
