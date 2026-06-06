import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { getGroups, getTeams } from "@/lib/data";
import { getTeamLabel, makeTeamMap } from "@/lib/format";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "2026 世界杯球队 - 48队名单与小组分布",
    description: "按小组查看 2026 世界杯 48 支参赛球队，进入球队详情了解分组和揭幕周赛程。",
    path: "/teams",
  });
}

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
          <article
            key={group.group}
            className="stadium-card rounded-2xl p-4 transition hover:-translate-y-1 hover:border-[color:var(--trophy-gold-soft)]"
          >
            <h2 className="inline-flex rounded-full bg-[color:var(--stadium-blue)] px-3 py-1 text-sm font-black text-[color:var(--trophy-gold)]">
              {group.group} 组
            </h2>
            <div className="mt-4 grid gap-2">
              {group.teams.map((slug) => {
                const team = teamMap.get(slug);
                const hasBio = Boolean(team?.bioZh?.trim());

                return (
                  <Link
                    key={slug}
                    href={`/teams/${slug}`}
                    className={`rounded-xl border px-3 py-3 transition hover:-translate-y-0.5 ${
                      hasBio
                        ? "border-[color:var(--trophy-gold-soft)] bg-[linear-gradient(135deg,#0b1f35,#0f4a34)] shadow-lg shadow-black/15 hover:border-[color:var(--trophy-gold)]"
                        : "border-[color:var(--line-soft)] bg-white/80 hover:border-[color:var(--trophy-gold-soft)] hover:bg-[color:var(--surface-soft)]"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span
                        className={`block text-sm font-black ${
                          hasBio ? "text-white" : "text-[color:var(--ink)]"
                        }`}
                      >
                        {getTeamLabel(teamMap, slug)}
                      </span>
                      {hasBio ? (
                        <span className="rounded-full bg-[color:var(--trophy-gold)] px-2 py-0.5 text-[10px] font-black text-[color:var(--stadium-blue)]">
                          详解
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={`mt-1 block text-xs font-medium ${
                        hasBio ? "text-white/68" : "text-[color:var(--muted)]"
                      }`}
                    >
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
