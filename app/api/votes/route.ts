import { NextRequest, NextResponse } from "next/server";
import { getMatches } from "@/lib/data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type VoteChoice = "home" | "draw" | "away";

interface VoteCounts {
  home: number;
  draw: number;
  away: number;
}

const voteChoices: VoteChoice[] = ["home", "draw", "away"];

function hasKvConfig(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function isVoteChoice(value: unknown): value is VoteChoice {
  return typeof value === "string" && voteChoices.includes(value as VoteChoice);
}

function isScheduledMatch(matchId: string): boolean {
  return getMatches().some((match) => match.id === matchId && match.status === "scheduled");
}

function normalizeCounts(raw: unknown): VoteCounts {
  const record = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    home: Number(record.home ?? 0) || 0,
    draw: Number(record.draw ?? 0) || 0,
    away: Number(record.away ?? 0) || 0,
  };
}

function toPercentages(counts: VoteCounts): VoteCounts {
  const total = counts.home + counts.draw + counts.away;

  if (total <= 0) {
    return { home: 0, draw: 0, away: 0 };
  }

  const home = Math.round((counts.home / total) * 100);
  const draw = Math.round((counts.draw / total) * 100);
  const away = Math.max(0, 100 - home - draw);

  return { home, draw, away };
}

function fallbackResponse() {
  return NextResponse.json({
    backend: "localStorage",
    counts: null,
    percentages: null,
  });
}

async function readCounts(matchId: string): Promise<VoteCounts | null> {
  if (!hasKvConfig()) {
    return null;
  }

  const { kv } = await import("@vercel/kv");
  const raw = await kv.hgetall(`match-votes:${matchId}`);

  return normalizeCounts(raw);
}

export async function GET(request: NextRequest) {
  const matchId = request.nextUrl.searchParams.get("matchId");

  if (!matchId || !isScheduledMatch(matchId)) {
    return NextResponse.json({ error: "Invalid matchId" }, { status: 400 });
  }

  try {
    const counts = await readCounts(matchId);

    if (!counts) {
      return fallbackResponse();
    }

    return NextResponse.json({
      backend: "kv",
      counts,
      percentages: toPercentages(counts),
    });
  } catch {
    return fallbackResponse();
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    matchId?: unknown;
    choice?: unknown;
  } | null;
  const matchId = typeof body?.matchId === "string" ? body.matchId : "";
  const choice = body?.choice;

  if (!matchId || !isScheduledMatch(matchId) || !isVoteChoice(choice)) {
    return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
  }

  if (!hasKvConfig()) {
    return fallbackResponse();
  }

  try {
    const { kv } = await import("@vercel/kv");
    await kv.hincrby(`match-votes:${matchId}`, choice, 1);
    const counts = normalizeCounts(await kv.hgetall(`match-votes:${matchId}`));

    return NextResponse.json({
      backend: "kv",
      counts,
      percentages: toPercentages(counts),
    });
  } catch {
    return fallbackResponse();
  }
}
