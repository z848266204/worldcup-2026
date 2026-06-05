import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageShell } from "@/components/page-shell";
import { getArticleBySlug, getArticleSlugs } from "@/lib/articles";
import { getTeamBySlug } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return createPageMetadata({
      title: "2026 世界杯前瞻文章 - 未找到",
      description: "该文章暂未找到对应 Markdown 文件。",
      path: `/articles/${slug}`,
    });
  }

  return createPageMetadata({
    title: `${article.title} - 2026 世界杯前瞻`,
    description: article.summary,
    path: `/articles/${article.slug}`,
  });
}

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedTeams = article.relatedTeams
    ?.map((teamSlug) => getTeamBySlug(teamSlug))
    .filter((team) => team !== undefined);

  return (
    <PageShell title={article.title} description={article.summary}>
      <article className="rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
        <header className="space-y-4">
          <p className="text-sm text-slate-500">{article.date}</p>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
                {tag}
              </span>
            ))}
          </div>
          {article.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.cover}
              alt={`${article.title} 封面图`}
              className="aspect-video w-full rounded-lg object-cover"
            />
          ) : null}
        </header>

        <div className="mt-8 max-w-none space-y-5 text-slate-700">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h2 className="pt-4 text-2xl font-bold text-slate-950">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="pt-3 text-xl font-semibold text-slate-950">{children}</h3>
              ),
              p: ({ children }) => <p className="leading-8">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc space-y-2 pl-5 leading-7">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal space-y-2 pl-5 leading-7">{children}</ol>
              ),
              a: ({ href, children }) => (
                <a href={href} className="font-medium text-emerald-700 underline underline-offset-4">
                  {children}
                </a>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {relatedTeams && relatedTeams.length > 0 ? (
          <footer className="mt-8 border-t border-slate-200 pt-5">
            <h2 className="text-lg font-bold text-slate-950">相关球队</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedTeams.map((team) => (
                <Link
                  key={team.slug}
                  href={`/teams/${team.slug}`}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  {team.flag ? `${team.flag} ` : ""}
                  {team.nameZh}
                </Link>
              ))}
            </div>
          </footer>
        ) : null}
      </article>
    </PageShell>
  );
}
