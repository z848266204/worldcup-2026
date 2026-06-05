import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/seo";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  return createPageMetadata({
    title: "2026 世界杯前瞻文章 - 内容待补充",
    description: "2026 世界杯前瞻文章占位页，后续将接入 Markdown 内容和 frontmatter。",
    path: `/articles/${slug}`,
  });
}

export function generateStaticParams() {
  return [{ slug: "placeholder" }];
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  return (
    <PageShell
      title="占位文章"
      description="单篇文章页占位，后续阶段再接入 Markdown 解析和 frontmatter。"
    >
      <article className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">slug：{slug}</p>
        <p className="mt-4 leading-7 text-slate-700">
          这里会渲染 content/articles/*.md 中的真实前瞻或球队介绍文章。
        </p>
      </article>
    </PageShell>
  );
}
