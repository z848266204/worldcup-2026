import { getTeamBySlug } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";
import type { Match } from "@/lib/types";

interface SportsEventsJsonLdProps {
  matches: Match[];
}

function getTeamName(slug: string): string {
  return getTeamBySlug(slug)?.nameZh ?? slug;
}

function getLocation(match: Match) {
  if (!match.venueConfirmed || !match.venue) {
    return undefined;
  }

  return {
    "@type": "Place",
    name: match.venue,
    address: [match.city, match.country].filter(Boolean).join(", "),
  };
}

export function SportsEventsJsonLd({ matches }: SportsEventsJsonLdProps) {
  const jsonLd = matches.map((match) => ({
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${getTeamName(match.home)} vs ${getTeamName(match.away)} - 2026 FIFA World Cup`,
    startDate: match.kickoffUTC,
    eventStatus: "https://schema.org/EventScheduled",
    sport: "Soccer",
    url: `${absoluteUrl("/schedule")}#${match.id}`,
    location: getLocation(match),
    competitor: [
      {
        "@type": "SportsTeam",
        name: getTeamName(match.home),
      },
      {
        "@type": "SportsTeam",
        name: getTeamName(match.away),
      },
    ],
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
