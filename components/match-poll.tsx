"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Vote } from "lucide-react";
import { formatKickoffBeijing } from "@/lib/format";
import type { Match, Team } from "@/lib/types";

type VoteChoice = "home" | "draw" | "away";
type VoteBackend = "kv" | "localStorage";

interface VoteCounts {
  home: number;
  draw: number;
  away: number;
}

interface PollResult {
  backend: VoteBackend;
  percentages: VoteCounts;
}

interface MatchPollProps {
  matches: Match[];
  teams: Team[];
}

const storageKey = "worldcup-2026-match-poll-v1";
const choices: VoteChoice[] = ["home", "draw", "away"];

function makeTeamMap(teams: Team[]): Map<string, Team> {
  return new Map(teams.map((team) => [team.slug, team]));
}

function teamName(teamMap: Map<string, Team>, slug: string): string {
  return teamMap.get(slug)?.nameZh ?? slug;
}

function teamLabel(teamMap: Map<string, Team>, slug: string): string {
  const team = teamMap.get(slug);

  if (!team) {
    return slug;
  }

  return `${team.flag ? `${team.flag} ` : ""}${team.nameZh}`;
}

function choiceLabel(match: Match, teamMap: Map<string, Team>, choice: VoteChoice): string {
  if (choice === "draw") {
    return "平局";
  }

  return `${teamName(teamMap, choice === "home" ? match.home : match.away)}胜`;
}

function buttonLabel(choice: VoteChoice): string {
  if (choice === "home") {
    return "主队胜";
  }

  if (choice === "away") {
    return "客队胜";
  }

  return "平";
}

function hashText(value: string): number {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function baselinePercentages(matchId: string): VoteCounts {
  const hash = hashText(matchId);
  const home = 42 + (hash % 15);
  const draw = 20 + (hash % 9);
  const away = Math.max(12, 100 - home - draw);

  return { home, draw, away };
}

function normalizePercentages(percentages: unknown, matchId: string): VoteCounts {
  const record =
    percentages && typeof percentages === "object" ? (percentages as Record<string, unknown>) : {};
  const home = Number(record.home);
  const draw = Number(record.draw);
  const away = Number(record.away);

  if ([home, draw, away].every((value) => Number.isFinite(value)) && home + draw + away > 0) {
    return { home, draw, away };
  }

  return baselinePercentages(matchId);
}

function readStoredVotes(): Record<string, VoteChoice> {
  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : {};

    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => choices.includes(value as VoteChoice)),
    ) as Record<string, VoteChoice>;
  } catch {
    return {};
  }
}

function writeStoredVotes(votes: Record<string, VoteChoice>) {
  window.localStorage.setItem(storageKey, JSON.stringify(votes));
}

export function MatchPoll({ matches, teams }: MatchPollProps) {
  const teamMap = useMemo(() => makeTeamMap(teams), [teams]);
  const [votes, setVotes] = useState<Record<string, VoteChoice>>({});
  const [results, setResults] = useState<Record<string, PollResult>>({});
  const [submittingMatchId, setSubmittingMatchId] = useState<string | null>(null);

  useEffect(() => {
    const storedVotes = readStoredVotes();
    setVotes(storedVotes);

    Object.keys(storedVotes).forEach((matchId) => {
      void fetch(`/api/votes?matchId=${encodeURIComponent(matchId)}`, { cache: "no-store" })
        .then((response) => response.json())
        .then((data) => {
          const backend: VoteBackend = data.backend === "kv" ? "kv" : "localStorage";
          setResults((current) => ({
            ...current,
            [matchId]: {
              backend,
              percentages:
                backend === "kv"
                  ? normalizePercentages(data.percentages, matchId)
                  : baselinePercentages(matchId),
            },
          }));
        })
        .catch(() => {
          setResults((current) => ({
            ...current,
            [matchId]: {
              backend: "localStorage",
              percentages: baselinePercentages(matchId),
            },
          }));
        });
    });
  }, []);

  async function submitVote(match: Match, choice: VoteChoice) {
    if (votes[match.id]) {
      return;
    }

    setSubmittingMatchId(match.id);
    const nextVotes = { ...votes, [match.id]: choice };
    setVotes(nextVotes);
    writeStoredVotes(nextVotes);

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: match.id, choice }),
      });
      const data = await response.json();
      const backend: VoteBackend = data.backend === "kv" ? "kv" : "localStorage";

      setResults((current) => ({
        ...current,
        [match.id]: {
          backend,
          percentages:
            backend === "kv"
              ? normalizePercentages(data.percentages, match.id)
              : baselinePercentages(match.id),
        },
      }));
    } catch {
      setResults((current) => ({
        ...current,
        [match.id]: {
          backend: "localStorage",
          percentages: baselinePercentages(match.id),
        },
      }));
    } finally {
      setSubmittingMatchId(null);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--trophy-gold)] text-[color:var(--stadium-blue)]">
          <Vote className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-2xl font-black text-white">谁能赢</h2>
          <p className="mt-1 text-sm leading-6 text-white/68">
            选择你看好的赛果，提交后查看当前球迷倾向。
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {matches.map((match) => {
          const selectedChoice = votes[match.id];
          const result = results[match.id];
          const percentages = result?.percentages;

          return (
            <article
              key={match.id}
              className="stadium-card rounded-2xl p-5 transition hover:-translate-y-1 hover:border-[color:var(--trophy-gold-soft)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-[color:var(--pitch-green)]/10 px-3 py-1 text-xs font-black text-[color:var(--pitch-green-deep)]">
                  {match.group ? `${match.group} 组` : "小组待定"}
                </span>
                <span className="text-xs font-bold text-[color:var(--muted)]">
                  {formatKickoffBeijing(match.kickoffUTC)}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-black text-[color:var(--ink)]">
                {teamLabel(teamMap, match.home)}
                <span className="mx-2 text-[color:var(--trophy-gold)]">vs</span>
                {teamLabel(teamMap, match.away)}
              </h3>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {choices.map((choice) => {
                  const isSelected = selectedChoice === choice;
                  const isSubmitting = submittingMatchId === match.id;

                  return (
                    <button
                      key={choice}
                      type="button"
                      disabled={Boolean(selectedChoice) || isSubmitting}
                      onClick={() => void submitVote(match, choice)}
                      className={`rounded-xl border px-3 py-3 text-sm font-black transition ${
                        isSelected
                          ? "border-[color:var(--trophy-gold)] bg-[color:var(--stadium-blue)] text-[color:var(--trophy-gold)]"
                          : "border-[color:var(--line-soft)] bg-white text-[color:var(--ink)] hover:-translate-y-0.5 hover:border-[color:var(--trophy-gold-soft)] hover:bg-[color:var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-70"
                      }`}
                    >
                      {isSubmitting && !selectedChoice ? (
                        <Loader2 className="mx-auto h-4 w-4 animate-spin" aria-label="提交中" />
                      ) : (
                        buttonLabel(choice)
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedChoice ? (
                <div className="mt-5 rounded-2xl border border-[color:var(--line-soft)] bg-[color:var(--surface-soft)] p-4">
                  <p className="inline-flex items-center gap-2 text-sm font-black text-[color:var(--stadium-blue)]">
                    <CheckCircle2 className="h-4 w-4 text-[color:var(--pitch-green)]" aria-hidden="true" />
                    你选了 {choiceLabel(match, teamMap, selectedChoice)}
                  </p>

                  {percentages ? (
                    <div className="mt-4 space-y-3">
                      {choices.map((choice) => (
                        <div key={choice}>
                          <div className="flex items-center justify-between text-xs font-bold text-[color:var(--muted)]">
                            <span>{choiceLabel(match, teamMap, choice)}</span>
                            <span>{percentages[choice]}%</span>
                          </div>
                          <div className="mt-1 h-2 overflow-hidden rounded-full bg-white">
                            <div
                              className="h-full rounded-full bg-[linear-gradient(90deg,var(--pitch-green),var(--trophy-gold))]"
                              style={{ width: `${percentages[choice]}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-[color:var(--muted)]">正在读取投票统计...</p>
                  )}

                  <p className="mt-3 text-xs font-medium text-[color:var(--muted)]">
                    {result?.backend === "kv"
                      ? "数据来源：Vercel KV 实时统计"
                      : "数据来源：本机记录与基础参考比例"}
                  </p>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
