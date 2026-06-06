import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { getGroups, getTeams } from "@/lib/data";
import { getTeamLabel, makeTeamMap } from "@/lib/format";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "2026 世界杯小组 - A到L组分组与积分榜",
    description: "查看 2026 世界杯 A-L 共 12 个小组的球队名单和积分榜数据。",
    path: "/groups",
  });
}

export default function GroupsPage() {
  const groups = getGroups();
  const teamMap = makeTeamMap(getTeams());

  return (
    <PageShell
      title="小组一览"
      description="A-L 共 12 个小组，每组 4 支球队，积分榜随赛事进程持续更新。"
    >
      <section className="grid gap-5 lg:grid-cols-2">
        {groups.map((group) => (
          <article
            key={group.group}
            className="stadium-card rounded-2xl p-4 transition hover:-translate-y-1 hover:border-[color:var(--trophy-gold-soft)] sm:p-5"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="inline-flex w-fit rounded-full bg-[color:var(--stadium-blue)] px-3 py-1 text-sm font-black text-[color:var(--trophy-gold)]">
                {group.group} 组
              </h2>
              <p className="text-sm font-medium text-[color:var(--muted)]">
                {group.teams.map((team) => getTeamLabel(teamMap, team)).join(" / ")}
              </p>
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-[color:var(--line-soft)]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[color:var(--surface-soft)] text-xs font-bold text-[color:var(--muted)]">
                  <tr>
                    <th scope="col" className="whitespace-nowrap py-2 pr-4 font-medium">
                      球队
                    </th>
                    <th scope="col" className="px-2 py-2 font-medium">场次</th>
                    <th scope="col" className="px-2 py-2 font-medium">胜</th>
                    <th scope="col" className="px-2 py-2 font-medium">平</th>
                    <th scope="col" className="px-2 py-2 font-medium">负</th>
                    <th scope="col" className="px-2 py-2 font-medium">进球</th>
                    <th scope="col" className="px-2 py-2 font-medium">失球</th>
                    <th scope="col" className="px-2 py-2 font-medium">积分</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--line-soft)] bg-white text-[color:var(--muted)]">
                  {group.standings.map((standing) => (
                    <tr key={standing.team} className="transition hover:bg-[color:var(--surface-soft)]">
                      <th scope="row" className="whitespace-nowrap py-3 pr-4 font-bold text-[color:var(--ink)]">
                        {getTeamLabel(teamMap, standing.team)}
                      </th>
                      <td className="px-2 py-3">{standing.played ?? 0}</td>
                      <td className="px-2 py-3">{standing.won ?? 0}</td>
                      <td className="px-2 py-3">{standing.drawn ?? 0}</td>
                      <td className="px-2 py-3">{standing.lost ?? 0}</td>
                      <td className="px-2 py-3">{standing.gf ?? 0}</td>
                      <td className="px-2 py-3">{standing.ga ?? 0}</td>
                      <td className="px-2 py-3 font-black text-[color:var(--stadium-blue)]">{standing.points ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
