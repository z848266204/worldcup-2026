import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { getArticles } from "@/lib/articles";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "2026 世界杯前瞻 - 赛前分析与球队介绍",
    description: "2026 世界杯前瞻文章入口，按发布时间查看赛前分析、球队介绍和原创观察。",
    path: "/articles",
  });
}

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <PageShell
      title="前瞻文章"
      description="Markdown 驱动的文章列表，内容来自 content/articles/*.md。"
    >
      <section className="space-y-4">
        {articles.map((article) => (
          <article key={article.slug} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="space-y-3">
              <p className="text-sm text-slate-500">{article.date}</p>
              <h2 className="text-xl font-bold text-slate-950">
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
              </h2>
              <p className="leading-7 text-slate-600">{article.summary}</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
