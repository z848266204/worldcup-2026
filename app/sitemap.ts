import type { MetadataRoute } from "next";
import { getTeams } from "@/lib/data";
import { absoluteUrl, staticSitemapPaths } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticUrls: MetadataRoute.Sitemap = staticSitemapPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));
  const teamUrls: MetadataRoute.Sitemap = getTeams().map((team) => ({
    url: absoluteUrl(`/teams/${team.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticUrls, ...teamUrls];
}
