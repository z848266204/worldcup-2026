import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
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
  const articleUrls: MetadataRoute.Sitemap = getArticles().map((article) => ({
    url: absoluteUrl(`/articles/${article.slug}`),
    lastModified: article.date ? new Date(article.date) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticUrls, ...teamUrls, ...articleUrls];
}
