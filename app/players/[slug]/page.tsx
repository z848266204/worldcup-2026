import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { getPlayerBySlug, getPlayers, getTeamName } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

interface PlayerPageProps {
  params: Promise<{ slug: string }>;
}

function isDraftCopy(value: string | null): boolean {
  return !value || value.includes("占位") || value.includes("待补充");
}

function getPublicPlayerName(name: string): string {
  return isDraftCopy(name) ? "球员资料" : name;
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

  const playerName = getPublicPlayerName(player.name);

  return createPageMetadata({
    title: `${playerName}世界杯2026 - 球员分析与球队信息`,
    description: `${playerName}的 2026 世界杯球员分析页，包含所属球队、位置、号码和分析正文。`,
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

  const playerName = getPublicPlayerName(player.name);
  const playerPosition = isDraftCopy(player.position) ? "资料更新中" : player.position;
  const playerAnalysis = isDraftCopy(player.analysis) ? "球员分析正在整理中。" : player.analysis;

  return (
    <PageShell
      title={playerName}
      description="查看球员所属球队、位置、号码和世界杯相关分析。"
    >
      <article className="stadium-card rounded-2xl p-5 sm:p-6">
        <dl className="grid gap-4 text-sm text-[color:var(--muted)] sm:grid-cols-2">
          <div>
            <dt className="font-bold text-[color:var(--ink)]">所属球队</dt>
            <dd>{getTeamName(player.teamSlug)}</dd>
          </div>
          <div>
            <dt className="font-bold text-[color:var(--ink)]">位置</dt>
            <dd>{playerPosition}</dd>
          </div>
          <div>
            <dt className="font-bold text-[color:var(--ink)]">号码</dt>
            <dd>{player.number ?? "资料更新中"}</dd>
          </div>
        </dl>
        <p className="mt-5 rounded-2xl border border-[color:var(--line-soft)] bg-[color:var(--surface-soft)] p-4 leading-7 text-[color:var(--muted)]">
          {playerAnalysis}
        </p>
      </article>
    </PageShell>
  );
}
