import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
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
    <PageShell
      title={`${team.flag ? `${team.flag} ` : ""}${team.nameZh}`}
      description="查看球队基础资料、所属小组和揭幕周赛程。"
    >
      <section className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-4">
            <div className="text-4xl" aria-hidden="true">
              {team.flag ?? "🏳️"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">{team.nameZh}</h2>
              <p className="mt-1 text-sm text-slate-500">{team.nameEn}</p>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-950">所属小组</dt>
              <dd>{team.group ?? "分组信息更新中"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-950">世界杯新军</dt>
              <dd>{team.debut ? "是" : "否"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-950">东道主</dt>
              <dd>{team.host ? "是" : "否"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-950">FIFA 排名</dt>
              <dd>{team.fifaRank ?? "排名信息更新中"}</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-md bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-950">球队简介</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {team.bioZh ?? "球队简介正在整理中。"}
            </p>
          </div>
        </article>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-950">揭幕周比赛</h2>
          <div className="mt-4 space-y-3">
            {matches.length > 0 ? (
              matches.map((match) => {
                const opponent = match.home === slug ? match.away : match.home;

                return (
                  <article key={match.id} className="rounded-md border border-slate-100 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          vs {getTeamLabel(teamMap, opponent)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {match.group ? `${match.group} 组` : "小组待定"} · {formatStage(match.stage)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        {formatScore(match)}
                      </span>
                    </div>
                    <dl className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <div>
                        <dt className="font-medium text-slate-900">北京时间</dt>
                        <dd>{formatKickoffBeijing(match.kickoffUTC)}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-900">当地比赛日</dt>
                        <dd>比赛日 {formatMatchday(match.matchday)}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-900">场馆</dt>
                        <dd>{match.venueConfirmed ? match.venue ?? "待定" : "待定"}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-900">城市</dt>
                        <dd>{[match.city, match.country].filter(Boolean).join("，") || "待定"}</dd>
                      </div>
                    </dl>
                    {!match.venueConfirmed && match.venueCandidates?.length ? (
                      <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        候选场馆：{match.venueCandidates.join(" / ")}
                      </p>
                    ) : null}
                  </article>
                );
              })
            ) : (
              <p className="text-sm text-slate-600">揭幕周赛程正在整理中。</p>
            )}
          </div>
        </section>
      </section>
    </PageShell>
  );
}
