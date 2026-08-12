import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { getAllHelpEntries } from "@/lib/pain-points-reader";
import { getAllResearchBibles } from "@/lib/research-bibles-reader";

const SITE_URL = "https://bobby-washburn.com";

const STATIC_ROUTES = ["/", "/about", "/help", "/docs", "/research"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [docsParams, helpEntries, bibles] = await Promise.all([
    source.generateParams(),
    getAllHelpEntries(),
    getAllResearchBibles(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));

  const docsEntries: MetadataRoute.Sitemap = docsParams
    .filter((param) => param.slug.length > 0)
    .map((param) => ({
      url: `${SITE_URL}/docs/${param.slug.join("/")}`,
    }));

  const helpEntriesSitemap: MetadataRoute.Sitemap = helpEntries.map((entry) => ({
    url: `${SITE_URL}/help/${entry.slug}`,
  }));

  const researchEntries: MetadataRoute.Sitemap = bibles
    .filter((bible) => !bible.noindex)
    .map((bible) => ({
      url: `${SITE_URL}/research/${bible.slug}`,
      lastModified: bible.lastUpdated ?? undefined,
    }));

  return [...staticEntries, ...docsEntries, ...helpEntriesSitemap, ...researchEntries];
}
