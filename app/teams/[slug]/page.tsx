import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMatches, getTeamBySlug, getTeams } from "@/lib/data";
import {
  formatKickoffBeijing,
  formatMatchday,
  formatScore,
  formatStage,
  getTeamLabel,
  makeTeamMap,
} from "@/lib/format";
import { createPageMetadata } from "@/lib/seo";

interface TeamPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeamBySlug(slug);

  if (!team) {
    return createPageMetadata({
      title: "2026 世界杯球队 - 未找到",
      description: "该球队详情页暂未找到对应数据。",
      path: `/teams/${slug}`,
    });
  }

  return createPageMetadata({
    title: `${team.nameZh}世界杯2026 - 分组、赛程、球员阵容`,
    description: `${team.nameZh}（${team.nameEn}）2026 世界杯球队页，查看所属小组、揭幕周赛程和球队简介。`,
    path: `/teams/${team.slug}`,
  });
}

export function generateStaticParams() {
  return getTeams().map((team) => ({ slug: team.slug }));
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  const teams = getTeams();
  const teamMap = makeTeamMap(teams);
  const matches = getMatches()
    .filter((match) => match.home === slug || match.away === slug)
    .sort((a, b) => (a.kickoffUTC ?? "").localeCompare(b.kickoffUTC ?? ""));

  if (!team) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_16%_10%,rgba(245,183,0,0.24),transparent_26%),linear-gradient(135deg,#071612_0%,#0f2b46_52%,#0d4f36_100%)] p-6 shadow-2xl sm:p-8">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(120deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="gold-ring flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 text-6xl shadow-2xl sm:h-28 sm:w-28 sm:text-7xl" aria-hidden="true">
              {team.flag ?? "🏳️"}
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--trophy-gold)]">
                Team Profile
              </p>
              <h1 className="mt-2 text-4xl font-black leading-tight text-white sm:text-5xl">
                {team.nameZh}
              </h1>
              <p className="mt-2 text-base font-medium text-white/72">{team.nameEn}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[color:var(--trophy-gold)] px-3 py-1 text-sm font-black text-[color:var(--stadium-blue)]">
              {team.group ? `${team.group} 组` : "分组更新中"}
            </span>
            {team.debut ? (
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-bold text-white">
                世界杯新军
              </span>
            ) : null}
            {team.host ? (
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-bold text-white">
                东道主
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <article className="stadium-card rounded-2xl p-5">
          <h2 className="text-xl font-black text-[color:var(--ink)]">球队资料</h2>
          <dl className="mt-5 grid gap-4 text-sm text-[color:var(--muted)] sm:grid-cols-2">
            <div>
              <dt className="font-bold text-[color:var(--ink)]">所属小组</dt>
              <dd>{team.group ?? "分组信息更新中"}</dd>
            </div>
            <div>
              <dt className="font-bold text-[color:var(--ink)]">世界杯新军</dt>
              <dd>{team.debut ? "是" : "否"}</dd>
            </div>
            <div>
              <dt className="font-bold text-[color:var(--ink)]">东道主</dt>
              <dd>{team.host ? "是" : "否"}</dd>
            </div>
            <div>
              <dt className="font-bold text-[color:var(--ink)]">FIFA 排名</dt>
              <dd>{team.fifaRank ?? "排名信息更新中"}</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-2xl border border-[color:var(--line-soft)] bg-[color:var(--surface-soft)] p-4">
            <h3 className="font-black text-[color:var(--ink)]">球队简介</h3>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              {team.bioZh ?? "球队简介正在整理中。"}
            </p>
          </div>
        </article>

        <section className="stadium-card rounded-2xl p-5">
          <h2 className="text-xl font-black text-[color:var(--ink)]">揭幕周比赛</h2>
          <div className="mt-4 space-y-3">
            {matches.length > 0 ? (
              matches.map((match) => {
                const opponent = match.home === slug ? match.away : match.home;

                return (
                  <article key={match.id} className="rounded-md border border-slate-100 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-black text-[color:var(--ink)]">
                          vs {getTeamLabel(teamMap, opponent)}
                        </p>
                        <p className="mt-1 text-xs font-medium text-[color:var(--muted)]">
                          {match.group ? `${match.group} 组` : "小组待定"} · {formatStage(match.stage)}
                        </p>
                      </div>
                      <span className="rounded-full bg-[color:var(--surface-soft)] px-3 py-1 text-sm font-black text-[color:var(--stadium-blue)]">
                        {formatScore(match)}
                      </span>
                    </div>
                    <dl className="mt-3 grid gap-2 text-sm text-[color:var(--muted)] sm:grid-cols-2">
                      <div>
                        <dt className="font-bold text-[color:var(--ink)]">北京时间</dt>
                        <dd>{formatKickoffBeijing(match.kickoffUTC)}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-[color:var(--ink)]">当地比赛日</dt>
                        <dd>比赛日 {formatMatchday(match.matchday)}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-[color:var(--ink)]">场馆</dt>
                        <dd>{match.venueConfirmed ? match.venue ?? "待定" : "待定"}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-[color:var(--ink)]">城市</dt>
                        <dd>{[match.city, match.country].filter(Boolean).join("，") || "待定"}</dd>
                      </div>
                    </dl>
                    {!match.venueConfirmed && match.venueCandidates?.length ? (
                      <p className="mt-3 rounded-xl bg-[color:var(--trophy-gold)]/12 px-3 py-2 text-sm font-medium text-[color:var(--stadium-blue)]">
                        候选场馆：{match.venueCandidates.join(" / ")}
                      </p>
                    ) : null}
                  </article>
                );
              })
            ) : (
              <p className="text-sm text-[color:var(--muted)]">揭幕周赛程正在整理中。</p>
            )}
          </div>
        </section>
      </section>

      <Link
        href="/teams"
        className="text-sm font-bold text-[color:var(--trophy-gold)] hover:text-white"
      >
        返回球队列表
      </Link>
    </main>
  );
}
