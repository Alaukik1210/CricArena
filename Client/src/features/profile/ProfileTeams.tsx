import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProfileTeam } from "./profile.types";

interface ProfileTeamsProps {
  teams: ProfileTeam[];
}

export function ProfileTeams({ teams }: ProfileTeamsProps) {
  return (
    <div className="mt-6">
      <h3 className="mb-4 text-2xl font-semibold text-ink">My Team</h3>
      {teams.length > 0 ? (
        teams.map((team) => (
          <Card key={team.id} className="mb-4 shadow-lg transition-shadow hover:shadow-xl">
            <CardContent className="p-4">
              <h4 className="text-lg font-bold text-ink">{team.name}</h4>
              <p className="text-sm text-ink-soft">{team.description}</p>
              <Button className="mt-4 shadow-md">View Team</Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-ink-soft">No teams found.</p>
      )}
    </div>
  );
}
