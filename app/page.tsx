import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Newspaper, Sparkles, Trophy, Users } from "lucide-react";
import { OpeningCountdown } from "@/components/opening-countdown";
import { getMatches, getTeams } from "@/lib/data";
import { formatKickoffBeijing, getTeamLabel, makeTeamMap } from "@/lib/format";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "2026 世界杯中文资讯站 - 赛程、小组、球队与前瞻",
    description: "查看 2026 FIFA 世界杯中文赛程、小组分组、球队资料和赛前前瞻入口。",
    path: "/",
  });
}

export default function Home() {
  const matches = getMatches();
  const teams = getTeams();
  const teamMap = makeTeamMap(teams);
  const recentMatches = [...matches]
    .sort((a, b) => (a.kickoffUTC ?? "").localeCompare(b.kickoffUTC ?? ""))
    .slice(0, 4);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_18%_20%,rgba(245,183,0,0.26),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(44,192,109,0.22),transparent_28%),linear-gradient(135deg,#071612_0%,#0f2b46_48%,#0f3b28_100%)] px-5 py-10 shadow-2xl sm:px-8 sm:py-14 lg:px-10">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute -bottom-20 -right-10 h-52 w-52 rounded-full border border-[color:var(--trophy-gold-soft)]" />
        <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full border border-white/10" />
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--trophy-gold)]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              World Cup 2026
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
              2026 美加墨世界杯
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              面向中文球迷的世界杯赛程、小组形势、球队资料与赛前解读，陪你从揭幕战一路看到决赛夜。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/schedule"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--trophy-gold)] px-5 py-3 text-sm font-bold text-[color:var(--stadium-blue)] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#ffd66a]"
              >
                查看赛程
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/teams"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-[color:var(--trophy-gold)] hover:text-[color:var(--trophy-gold)]"
              >
                参赛球队
              </Link>
            </div>
          </div>
          <OpeningCountdown />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--trophy-gold)]">
              Upcoming Matches
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">近期比赛</h2>
          </div>
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--trophy-gold)] hover:text-white"
          >
            完整赛程
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {recentMatches.map((match) => (
            <article
              key={match.id}
              className="stadium-card group overflow-hidden rounded-2xl p-5 transition hover:-translate-y-1 hover:border-[color:var(--trophy-gold-soft)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[color:var(--pitch-green)]/10 px-3 py-1 text-xs font-bold text-[color:var(--pitch-green-deep)]">
                  {match.group ? `${match.group} 组` : "小组待定"}
                </span>
                <span className="text-xs font-medium text-[color:var(--muted)]">
                  {match.matchNumber ? `第 ${match.matchNumber} 场` : "场次待定"}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-black text-[color:var(--ink)]">
                {getTeamLabel(teamMap, match.home)}
                <span className="mx-2 text-[color:var(--trophy-gold)]">vs</span>
                {getTeamLabel(teamMap, match.away)}
              </h3>
              <div className="mt-4 flex flex-col gap-2 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[color:var(--pitch-green)]" aria-hidden="true" />
                  {formatKickoffBeijing(match.kickoffUTC)}
                </span>
                <span>{match.city || "城市待定"}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "夺冠热门",
            description: "跟踪强队走势、晋级形势与关键比赛看点。",
            href: "/predictions",
            cta: "查看预测板块",
            icon: Trophy,
          },
          {
            title: "球队资料",
            description: `浏览全部 ${teams.length} 支参赛球队的小组、赛程与基础资料。`,
            href: "/teams",
            cta: "查看球队",
            icon: Users,
          },
          {
            title: "前瞻文章",
            description: "阅读世界杯前瞻、球队分析与赛事解读。",
            href: "/articles",
            cta: "阅读文章",
            icon: Newspaper,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="stadium-card group rounded-2xl p-5 transition hover:-translate-y-1 hover:border-[color:var(--trophy-gold-soft)] hover:shadow-2xl"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--stadium-blue)] text-[color:var(--trophy-gold)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-lg font-black text-[color:var(--ink)]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{item.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[color:var(--pitch-green-deep)] group-hover:text-[color:var(--stadium-blue)]">
                {item.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
