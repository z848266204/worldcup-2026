import Link from "next/link";
import type { Metadata } from "next";
import { OpeningCountdown } from "@/components/opening-countdown";
import { PageShell } from "@/components/page-shell";
import { getMatches, getTeams } from "@/lib/data";
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

  return (
    <PageShell
      title="2026 美加墨世界杯中文资讯站"
      description="聚合 2026 世界杯赛程、小组分组、球队资料、赛事前瞻与中文解读。"
    >
      <OpeningCountdown />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">近期比赛</h2>
          <p className="mt-2 text-sm text-slate-600">
            已整理揭幕周 {matches.length} 场赛程，支持按日期和小组查看。
          </p>
          <Link className="mt-4 inline-block text-sm font-medium text-emerald-700" href="/schedule">
            查看赛程
          </Link>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">夺冠热门</h2>
          <p className="mt-2 text-sm text-slate-600">
            跟踪强队走势、晋级形势与关键比赛看点。
          </p>
          <Link className="mt-4 inline-block text-sm font-medium text-emerald-700" href="/predictions">
            查看预测板块
          </Link>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">球队资料</h2>
          <p className="mt-2 text-sm text-slate-600">
            浏览全部 {teams.length} 支参赛球队的小组、赛程与基础资料。
          </p>
          <Link className="mt-4 inline-block text-sm font-medium text-emerald-700" href="/teams">
            查看球队
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
