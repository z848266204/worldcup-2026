import { PageShell } from "@/components/page-shell";
import { ScheduleView } from "@/components/schedule-view";
import { getMatches, getTeams } from "@/lib/data";

export default function SchedulePage() {
  const matches = getMatches();
  const teams = getTeams();

  return (
    <PageShell
      title="完整赛程"
      description="按日期或小组查看揭幕周赛程，时间以北京时间为主，并保留当地比赛日提示。"
    >
      <ScheduleView matches={matches} teams={teams} />
    </PageShell>
  );
}
