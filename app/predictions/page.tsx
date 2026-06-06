import type { Metadata } from "next";
import { Goal, ShieldCheck, Trophy } from "lucide-react";
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
        {[
          { title: "夺冠预测", icon: Trophy },
          { title: "晋级预测", icon: ShieldCheck },
          { title: "单场比分预测", icon: Goal },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="stadium-card rounded-2xl p-5 transition hover:-translate-y-1 hover:border-[color:var(--trophy-gold-soft)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--stadium-blue)] text-[color:var(--trophy-gold)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-lg font-black text-[color:var(--ink)]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                结合赛程、分组和球队状态，持续更新赛事解读。
              </p>
            </article>
          );
        })}
      </section>
    </PageShell>
  );
}
