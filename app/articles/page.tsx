import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
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
      description="世界杯前瞻、球队分析与赛事解读。"
    >
      <section className="space-y-4">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="stadium-card group rounded-2xl p-5 transition hover:-translate-y-1 hover:border-[color:var(--trophy-gold-soft)] sm:p-6"
          >
            <div className="space-y-3">
              <p className="text-sm font-bold text-[color:var(--trophy-gold)]">{article.date}</p>
              <h2 className="text-xl font-black text-[color:var(--ink)] sm:text-2xl">
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
              </h2>
              <p className="leading-7 text-[color:var(--muted)]">{article.summary}</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[color:var(--line-soft)] bg-[color:var(--pitch-green)]/10 px-3 py-1 text-xs font-bold text-[color:var(--pitch-green-deep)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/articles/${article.slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--stadium-blue)] group-hover:text-[color:var(--pitch-green-deep)]"
              >
                阅读全文
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
