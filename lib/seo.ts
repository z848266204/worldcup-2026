import type { Metadata } from "next";

export const siteConfig = {
  name: "2026 世界杯中文资讯站",
  description: "面向中文用户的 2026 FIFA 世界杯赛程、小组、球队和前瞻资讯站。",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const staticSitemapPaths = [
  "/",
  "/schedule",
  "/groups",
  "/teams",
  "/predictions",
  "/articles",
];

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "zh_CN",
      url: absoluteUrl(path),
      siteName: siteConfig.name,
    },
  };
}
