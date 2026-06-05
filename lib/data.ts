import groupsJson from "@/data/groups.json";
import matchesJson from "@/data/matches.json";
import playersJson from "@/data/players.json";
import teamsJson from "@/data/teams.json";
import type { Group, Match, Player, Team } from "@/lib/types";

interface MatchesDataFile {
  matches: Match[];
}

interface TeamsDataFile {
  teams: Team[];
}

interface GroupsDataFile {
  groups: Group[];
}

const matches = (matchesJson as MatchesDataFile).matches;
const teams = (teamsJson as TeamsDataFile).teams;
const players = playersJson as Player[];
const groups = (groupsJson as GroupsDataFile).groups;

export function getMatches(): Match[] {
  return matches;
}

export function getTeams(): Team[] {
  return teams;
}

export function getTeamBySlug(slug: string): Team | undefined {
  return teams.find((team) => team.slug === slug);
}

export function getPlayers(): Player[] {
  return players;
}

export function getPlayerBySlug(slug: string): Player | undefined {
  return players.find((player) => player.slug === slug);
}

export function getGroups(): Group[] {
  return groups;
}

export function getTeamName(slug: string): string {
  return getTeamBySlug(slug)?.nameZh ?? slug;
}
