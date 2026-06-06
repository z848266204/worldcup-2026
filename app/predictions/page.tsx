import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Goal, Newspaper, ShieldCheck, Trophy } from "lucide-react";
import { MatchPoll } from "@/components/match-poll";
import { PageShell } from "@/components/page-shell";
import { getArticles } from "@/lib/articles";
import { getMatches, getTeams } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "2026 世界杯预测 - 夺冠、晋级与比分预测",
    description: "2026 世界杯预测板块入口，后续承载夺冠预测、晋级形势和单场比分预测。",
    path: "/predictions",
  });
}

export default function PredictionsPage() {
  const predictionArticles = getArticles().filter((article) =>
    article.tags.some((tag) => tag === "夺冠预测" || tag === "小组前瞻"),
  );
  const scheduledMatches = getMatches()
    .filter((match) => match.status === "scheduled")
    .sort((a, b) => (a.kickoffUTC ?? "").localeCompare(b.kickoffUTC ?? ""))
    .slice(0, 6);
  const teams = getTeams();

  return (
    <PageShell
      title="预测板块"
      description="关注夺冠热门、晋级形势和关键比赛趋势。"
    >
      <section className="stadium-card rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--stadium-blue)] text-[color:var(--trophy-gold)]">
            <Newspaper className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-[color:var(--ink)]">小编预测</h2>
            <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
              赛前判断、热门球队和小组形势的文字分析入口。
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {predictionArticles.map((article) => (
            <article
              key={article.slug}
              className="rounded-2xl border border-[color:var(--line-soft)] bg-[color:var(--surface-soft)] p-4 transition hover:-translate-y-0.5 hover:border-[color:var(--trophy-gold-soft)]"
            >
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[color:var(--pitch-green-deep)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="mt-4 text-lg font-black leading-7 text-[color:var(--ink)]">
                {article.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[color:var(--muted)]">
                {article.summary}
              </p>
              <Link
                href={`/articles/${article.slug}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[color:var(--stadium-blue)] hover:text-[color:var(--pitch-green-deep)]"
              >
                阅读预测
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <MatchPoll matches={scheduledMatches} teams={teams} />

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
