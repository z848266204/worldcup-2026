import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ScheduleView } from "@/components/schedule-view";
import { SportsEventsJsonLd } from "@/components/sports-events-json-ld";
import { getMatches, getTeams } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "2026 世界杯赛程 - 北京时间、小组赛程与比赛场馆",
    description: "按日期或小组查看 2026 世界杯赛程，包含北京时间、当地比赛日、场馆城市和比分状态。",
    path: "/schedule",
  });
}

export default function SchedulePage() {
  const matches = getMatches();
  const teams = getTeams();

  return (
    <PageShell
      title="完整赛程"
      description="按日期或小组查看揭幕周赛程，时间以北京时间为主，并保留当地比赛日提示。"
    >
      <SportsEventsJsonLd matches={matches} />
      <ScheduleView matches={matches} teams={teams} />
    </PageShell>
  );
}
