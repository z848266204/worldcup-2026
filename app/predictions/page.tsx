import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "2026 世界杯预测 - 夺冠、晋级与比分预测",
    description: "2026 世界杯预测板块入口，后续承载夺冠预测、晋级形势和单场比分预测。",
    path: "/predictions",
  });
}

export default function PredictionsPage() {
  return (
    <PageShell
      title="预测板块"
      description="关注夺冠热门、晋级形势和关键比赛趋势。"
    >
      <section className="grid gap-4 sm:grid-cols-3">
        {["夺冠预测", "晋级预测", "单场比分预测"].map((title) => (
          <article key={title} className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              结合赛程、分组和球队状态，持续更新赛事解读。
            </p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
