import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "content", "articles");

export interface ArticleFrontmatter {
  title: string;
  date: string;
  cover?: string;
  summary: string;
  tags: string[];
  relatedTeams?: string[];
}

export interface ArticleListItem extends ArticleFrontmatter {
  slug: string;
}

export interface Article extends ArticleListItem {
  content: string;
}

function isMarkdownFile(fileName: string): boolean {
  return fileName.endsWith(".md");
}

function getArticleFileNames(): string[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  return fs.readdirSync(articlesDirectory).filter(isMarkdownFile);
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function parseArticle(fileName: string): Article {
  const slug = fileName.replace(/\.md$/, "");
  const fullPath = path.join(articlesDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    cover: typeof data.cover === "string" ? data.cover : undefined,
    summary: String(data.summary ?? ""),
    tags: normalizeStringArray(data.tags),
    relatedTeams: normalizeStringArray(data.relatedTeams),
    content,
  };
}

export function getArticles(): ArticleListItem[] {
  return getArticleFileNames()
    .map(parseArticle)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      date: article.date,
      cover: article.cover,
      summary: article.summary,
      tags: article.tags,
      relatedTeams: article.relatedTeams,
    }));
}

export function getArticleBySlug(slug: string): Article | undefined {
  const fileName = `${slug}.md`;

  if (!getArticleFileNames().includes(fileName)) {
    return undefined;
  }

  return parseArticle(fileName);
}

export function getArticleSlugs(): string[] {
  return getArticleFileNames().map((fileName) => fileName.replace(/\.md$/, ""));
}
