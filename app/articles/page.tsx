import Link from "next/link";
import { PageShell } from "@/components/page-shell";

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
