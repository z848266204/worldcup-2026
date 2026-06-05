import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { getPlayerBySlug, getPlayers, getTeamName } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

interface PlayerPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);

  if (!player) {
    return createPageMetadata({
      title: "2026 世界杯球员分析 - 未找到",
      description: "该球员分析页暂未找到对应数据。",
      path: `/players/${slug}`,
    });
  }

  return createPageMetadata({
    title: `${player.name}世界杯2026 - 球员分析与球队信息`,
    description: `${player.name}的 2026 世界杯球员分析页，包含所属球队、位置、号码和分析正文。`,
    path: `/players/${player.slug}`,
  });
}

export function generateStaticParams() {
  return getPlayers().map((player) => ({ slug: player.slug }));
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);

  if (!player) {
    notFound();
  }

  return (
    <PageShell
      title={player.name}
      description="单个球员分析页占位，后续由 data/players.json 填入真实分析。"
    >
      <article className="rounded-lg border border-slate-200 bg-white p-5">
        <dl className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-950">所属球队</dt>
            <dd>{getTeamName(player.teamSlug)}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-950">位置</dt>
            <dd>{player.position ?? "待补充"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-950">号码</dt>
            <dd>{player.number ?? "待补充"}</dd>
          </div>
        </dl>
        <p className="mt-5 leading-7 text-slate-700">{player.analysis}</p>
      </article>
    </PageShell>
  );
}
