import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { getGroups, getTeams } from "@/lib/data";
import { getTeamLabel, makeTeamMap } from "@/lib/format";

export default function TeamsPage() {
  const teams = getTeams();
  const groups = getGroups();
  const teamMap = makeTeamMap(teams);

  return (
    <PageShell
      title="球队列表"
      description="按小组分块列出 48 支球队，点击球队进入详情页。"
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <article key={group.group} className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-950">{group.group} 组</h2>
            <div className="mt-4 grid gap-2">
              {group.teams.map((slug) => {
                const team = teamMap.get(slug);

                return (
                  <Link
                    key={slug}
                    href={`/teams/${slug}`}
                    className="rounded-md border border-slate-100 px-3 py-3 transition hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <span className="block text-sm font-semibold text-slate-950">
                      {getTeamLabel(teamMap, slug)}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {team?.nameEn ?? slug}
                    </span>
                  </Link>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
