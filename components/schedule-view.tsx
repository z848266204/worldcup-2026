"use client";

import { useMemo, useState } from "react";
import {
  formatKickoffBeijing,
  formatMatchday,
  formatScore,
  formatStage,
  getTeamLabel,
  makeTeamMap,
} from "@/lib/format";
import type { GroupName, Match, Team } from "@/lib/types";

type ScheduleMode = "date" | "group";

interface ScheduleViewProps {
  matches: Match[];
  teams: Team[];
}

const modes: Array<{ id: ScheduleMode; label: string }> = [
  { id: "date", label: "按日期" },
  { id: "group", label: "按小组" },
];

const groupOrder: GroupName[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

function compareByKickoff(a: Match, b: Match) {
  return (a.kickoffUTC ?? "").localeCompare(b.kickoffUTC ?? "");
}

function groupByDate(matches: Match[]) {
  return [...matches].sort(compareByKickoff).reduce<Array<{ title: string; matches: Match[] }>>(
    (sections, match) => {
      const title = `比赛日 ${formatMatchday(match.matchday)}`;
      const section = sections.find((item) => item.title === title);

      if (section) {
        section.matches.push(match);
      } else {
        sections.push({ title, matches: [match] });
      }

      return sections;
    },
    [],
  );
}

function groupByGroup(matches: Match[]) {
  return groupOrder
    .map((group) => ({
      title: `${group} 组`,
      matches: matches.filter((match) => match.group === group).sort(compareByKickoff),
    }))
    .filter((section) => section.matches.length > 0);
}

function MatchCard({ match, teams }: { match: Match; teams: Map<string, Team> }) {
  const venue = match.venueConfirmed ? match.venue : "待定";
  const location = [match.city, match.country].filter(Boolean).join("，");

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span>{match.matchNumber ? `第 ${match.matchNumber} 场` : "场次待定"}</span>
            <span>{match.group ? `${match.group} 组` : "小组待定"}</span>
            <span>{formatStage(match.stage)}</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-950">
            {getTeamLabel(teams, match.home)} vs {getTeamLabel(teams, match.away)}
          </h2>
        </div>
        <div className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800">
          {formatScore(match)}
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="font-medium text-slate-900">北京时间</dt>
          <dd>{formatKickoffBeijing(match.kickoffUTC)}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-900">当地比赛日</dt>
          <dd>比赛日 {formatMatchday(match.matchday)}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-900">场馆</dt>
          <dd>{venue ?? "待定"}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-900">城市</dt>
          <dd>{location || "待定"}</dd>
        </div>
      </dl>

      {!match.venueConfirmed && match.venueCandidates && match.venueCandidates.length > 0 ? (
        <div className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
          候选场馆：{match.venueCandidates.join(" / ")}
        </div>
      ) : null}
    </article>
  );
}

export function ScheduleView({ matches, teams }: ScheduleViewProps) {
  const [mode, setMode] = useState<ScheduleMode>("date");
  const teamMap = useMemo(() => makeTeamMap(teams), [teams]);
  const sections = useMemo(
    () => (mode === "date" ? groupByDate(matches) : groupByGroup(matches)),
    [matches, mode],
  );

  return (
    <section className="space-y-6">
      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              mode === item.id ? "bg-emerald-700 text-white" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {sections.map((section) => (
        <div key={section.title} className="space-y-3">
          <h2 className="text-xl font-bold text-slate-950">{section.title}</h2>
          <div className="space-y-3">
            {section.matches.map((match) => (
              <MatchCard key={match.id} match={match} teams={teamMap} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
