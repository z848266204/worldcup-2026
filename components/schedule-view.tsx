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
    <article
      id={match.id}
      className="stadium-card group rounded-2xl p-4 transition hover:-translate-y-1 hover:border-[color:var(--trophy-gold-soft)] sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-full bg-[color:var(--stadium-blue)] px-2.5 py-1 text-white">
              {match.matchNumber ? `第 ${match.matchNumber} 场` : "场次待定"}
            </span>
            <span className="rounded-full bg-[color:var(--pitch-green)]/10 px-2.5 py-1 text-[color:var(--pitch-green-deep)]">
              {match.group ? `${match.group} 组` : "小组待定"}
            </span>
            <span className="rounded-full bg-[color:var(--trophy-gold)]/15 px-2.5 py-1 text-[color:var(--stadium-blue)]">
              {formatStage(match.stage)}
            </span>
          </div>
          <h2 className="text-lg font-black text-[color:var(--ink)] sm:text-xl">
            {getTeamLabel(teams, match.home)}
            <span className="mx-2 text-[color:var(--trophy-gold)]">vs</span>
            {getTeamLabel(teams, match.away)}
          </h2>
        </div>
        <div className="rounded-xl border border-[color:var(--line-soft)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm font-black text-[color:var(--stadium-blue)]">
          {formatScore(match)}
        </div>
      </div>

      <dl className="mt-5 grid gap-3 text-sm text-[color:var(--muted)] sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="font-bold text-[color:var(--ink)]">北京时间</dt>
          <dd>{formatKickoffBeijing(match.kickoffUTC)}</dd>
        </div>
        <div>
          <dt className="font-bold text-[color:var(--ink)]">当地比赛日</dt>
          <dd>比赛日 {formatMatchday(match.matchday)}</dd>
        </div>
        <div>
          <dt className="font-bold text-[color:var(--ink)]">场馆</dt>
          <dd>{venue ?? "待定"}</dd>
        </div>
        <div>
          <dt className="font-bold text-[color:var(--ink)]">城市</dt>
          <dd>{location || "待定"}</dd>
        </div>
      </dl>

      {!match.venueConfirmed && match.venueCandidates && match.venueCandidates.length > 0 ? (
        <div className="mt-4 rounded-xl border border-[color:var(--trophy-gold-soft)] bg-[color:var(--trophy-gold)]/12 px-3 py-2 text-sm font-medium text-[color:var(--stadium-blue)]">
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
      <div className="inline-flex rounded-2xl border border-white/10 bg-white/10 p-1 shadow-lg backdrop-blur">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              mode === item.id
                ? "bg-[color:var(--trophy-gold)] text-[color:var(--stadium-blue)] shadow"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {sections.map((section) => (
        <div key={section.title} className="space-y-3">
          <h2 className="text-xl font-black text-white">{section.title}</h2>
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
