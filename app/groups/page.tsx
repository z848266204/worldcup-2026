import { PageShell } from "@/components/page-shell";
import { getGroups, getTeams } from "@/lib/data";
import { getTeamLabel, makeTeamMap } from "@/lib/format";

export default function GroupsPage() {
  const groups = getGroups();
  const teamMap = makeTeamMap(getTeams());

  return (
    <PageShell
      title="小组一览"
      description="A-L 共 12 个小组，每组 4 支球队；积分榜字段来自 data/groups.json。"
    >
      <section className="grid gap-5 lg:grid-cols-2">
        {groups.map((group) => (
          <article key={group.group} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-slate-950">{group.group} 组</h2>
              <p className="text-sm text-slate-500">
                {group.teams.map((team) => getTeamLabel(teamMap, team)).join(" / ")}
              </p>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs text-slate-500">
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
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {group.standings.map((standing) => (
                    <tr key={standing.team}>
                      <th scope="row" className="whitespace-nowrap py-3 pr-4 font-medium text-slate-950">
                        {getTeamLabel(teamMap, standing.team)}
                      </th>
                      <td className="px-2 py-3">{standing.played ?? 0}</td>
                      <td className="px-2 py-3">{standing.won ?? 0}</td>
                      <td className="px-2 py-3">{standing.drawn ?? 0}</td>
                      <td className="px-2 py-3">{standing.lost ?? 0}</td>
                      <td className="px-2 py-3">{standing.gf ?? 0}</td>
                      <td className="px-2 py-3">{standing.ga ?? 0}</td>
                      <td className="px-2 py-3 font-semibold text-slate-950">{standing.points ?? 0}</td>
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
