export type GroupName =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L";

export type MatchStage =
  | "group"
  | "小组赛"
  | "32强"
  | "16强"
  | "8强"
  | "4强"
  | "三四名决赛"
  | "决赛";

export interface Match {
  id: string;
  matchNumber: number | null;
  matchday: number | string;
  kickoffUTC: string | null;
  kickoffET: string | null;
  stage: MatchStage;
  group: GroupName | null;
  home: string;
  away: string;
  venue: string | null;
  city: string | null;
  country: string | null;
  venueConfirmed: boolean;
  venueCandidates?: string[];
  homeScore: number | null;
  awayScore: number | null;
  status: string;
}

export interface Team {
  slug: string;
  nameZh: string;
  nameEn: string;
  flag: string | null;
  group: GroupName | null;
  host: boolean;
  debut: boolean;
  fifaRank: number | null;
  bioZh: string | null;
}

export interface Player {
  slug: string;
  name: string;
  teamSlug: string;
  position: string | null;
  number: number | null;
  analysis: string;
}

export interface GroupStanding {
  team: string;
  played: number | null;
  won: number | null;
  drawn: number | null;
  lost: number | null;
  gf: number | null;
  ga: number | null;
  points: number | null;
}

export interface Group {
  group: GroupName;
  teams: string[];
  standings: GroupStanding[];
}
