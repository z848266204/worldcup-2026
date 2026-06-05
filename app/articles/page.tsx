import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "2026 世界杯前瞻 - 赛前分析与球队介绍",
    description: "2026 世界杯前瞻文章入口，后续发布赛前分析、球队介绍和球员观察。",
    path: "/articles",
  });
}

export default function ArticlesPage() {
  return (
    <PageShell
      title="前瞻文章"
      description="Markdown 驱动的文章列表入口占位，文章系统留到后续阶段实现。"
    >
      <article className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          <Link href="/articles/placeholder">占位文章</Link>
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          后续真实文章请放入 content/articles/*.md，并带 frontmatter。
        </p>
      </article>
    </PageShell>
  );
}
