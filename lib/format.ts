import type { Match, Team } from "@/lib/types";

export function formatKickoffBeijing(kickoffUTC: string | null): string {
  if (!kickoffUTC) {
    return "时间待定";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(kickoffUTC));
}

export function formatMatchday(matchday: Match["matchday"]): string {
  if (typeof matchday === "number") {
    return `第 ${matchday} 比赛日`;
  }

  const [, , month, day] = matchday.match(/^(\d{4})-(\d{2})-(\d{2})$/) ?? [];

  if (!month || !day) {
    return String(matchday);
  }

  return `${Number(month)}/${Number(day)}`;
}

export function formatStage(stage: Match["stage"]): string {
  if (stage === "group") {
    return "小组赛";
  }

  return stage;
}

export function formatScore(match: Match): string {
  if (match.homeScore === null || match.awayScore === null) {
    return "未开赛";
  }

  return `${match.homeScore} - ${match.awayScore}`;
}

export function makeTeamMap(teams: Team[]): Map<string, Team> {
  return new Map(teams.map((team) => [team.slug, team]));
}

export function getTeamLabel(teamMap: Map<string, Team>, slug: string): string {
  const team = teamMap.get(slug);

  if (!team) {
    return slug;
  }

  return `${team.flag ? `${team.flag} ` : ""}${team.nameZh}`;
}
