import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PlayerStats, ProfileFormData, StatsFieldKey } from "./profile.types";

interface ProfileStatsProps {
  stats: Required<PlayerStats>;
}

/** Read-only stat tiles. */
export function ProfileStats({ stats }: ProfileStatsProps) {
  const tiles = [
    { label: "Matches", value: stats.matches },
    { label: "Runs", value: stats.runs },
    { label: "Wickets", value: stats.wickets },
    { label: "Catches", value: stats.catches },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      {tiles.map((stat) => (
        <Card key={stat.label} className="shadow-lg transition-shadow hover:shadow-xl">
          <CardContent className="p-4">
            <p className="text-sm text-ink-soft">{stat.label}</p>
            <p className="text-xl font-bold text-ink">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const STAT_FIELDS: Array<{ key: StatsFieldKey; placeholder: string }> = [
  { key: "statsMatches", placeholder: "Matches" },
  { key: "statsRuns", placeholder: "Runs" },
  { key: "statsWickets", placeholder: "Wickets" },
  { key: "statsCatches", placeholder: "Catches" },
];

interface ProfileStatsFieldsProps {
  values: Pick<ProfileFormData, StatsFieldKey>;
  onChange: (key: StatsFieldKey, value: string) => void;
}

/** The four numeric inputs of the edit form. Renders grid items for the parent form grid. */
export function ProfileStatsFields({ values, onChange }: ProfileStatsFieldsProps) {
  return (
    <>
      {STAT_FIELDS.map(({ key, placeholder }) => (
        <Input
          key={key}
          type="number"
          placeholder={placeholder}
          value={values[key]}
          onChange={(e) => onChange(key, e.target.value)}
        />
      ))}
    </>
  );
}
