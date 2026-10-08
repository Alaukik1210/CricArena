import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaRupeeSign } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { useAppSelector } from "@/redux/store";
import type { TournamentDetail } from "./tournaments.types";

interface UserTeam {
  id: string;
  name: string;
}

export default function RegisterTour() {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [tournamentDetails, setTournamentDetails] = useState<TournamentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<UserTeam[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [creatingTeam, setCreatingTeam] = useState(false);
  const { id } = useParams();
  const user = useAppSelector((store) => store.user.user);
  const userId = user?.id;

  const fetchTeamById = async () => {
    if (!userId) {
      setTeams([]);
      return;
    }
    try {
      const res = await api.get<{ teams?: UserTeam[] }>(`/user/profile/${userId}/teams`);
      setTeams(res.data.teams || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await api.get<{ tournament: TournamentDetail }>(`/owner/tours/${id}`);
        setTournamentDetails(response.data.tournament);
        fetchTeamById();
      } catch (error) {
        console.error("Error fetching tournament details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only when the tournament id changes, as before
  }, [id]);

  const onSubmitHandler = async () => {
    if (!selectedTeam || !tournamentDetails) return;

    try {
      // Find the selected team by name
      const selectedTeamObj = teams.find((team) => team.name === selectedTeam);
      if (!selectedTeamObj) {
        alert("Selected team not found.");
        return;
      }

      const teamId = selectedTeamObj.id; // Get the team ID

      // Send the POST request with tournamentId and teamId
      await api.post("/owner/tours/register", {
        tournamentId: id,
        teamId: teamId,
      });

      alert("Team registered successfully!");

      // Update joined teams locally
      const updatedTeams = tournamentDetails.teams.map((team) =>
        team.id === teamId ? { ...team, joined: true } : team
      );
      setTournamentDetails({ ...tournamentDetails, teams: updatedTeams });

      setSelectedTeam("");
    } catch (error) {
      console.error("Error registering team:", error);
      alert("Failed to register the team. Please try again.");
    }
  };

  const createTeamHandler = async () => {
    if (!newTeamName || !newTeamDescription || !userId) {
      alert("Please fill team name and description.");
      return;
    }

    try {
      setCreatingTeam(true);
      await api.post("/user/team/create", {
        name: newTeamName,
        description: newTeamDescription,
        memberIds: [userId],
      });
      setNewTeamName("");
      setNewTeamDescription("");
      await fetchTeamById();
      alert("Team created successfully");
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team.");
    } finally {
      setCreatingTeam(false);
    }
  };

  if (loading) {
    return <div className="ml-96 mt-80 h-40 w-80 items-center pl-96 text-center text-ink">Loading tournament details...</div>;
  }

  if (!tournamentDetails) {
    return <p className="mt-20 text-center text-ink">Tournament not found.</p>;
  }

  return (
    <div className="mx-auto mt-40 max-w-5xl px-4 py-8 text-ink">
      <Card>
        <CardHeader>
          <h2 className="text-3xl font-bold text-pending">
            {tournamentDetails.title}
          </h2>
          <p className="text-sm text-ink-soft">{tournamentDetails.description}</p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2 text-ink-soft">
              <FaMapMarkerAlt className="text-pending" />
              <span>{tournamentDetails.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <FaCalendarAlt className="text-pending" />
              <span>
                {tournamentDetails.tourStartsDate} - {tournamentDetails.tourEndDate}
              </span>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <FaUsers className="text-pending" />
              <span>{tournamentDetails.spots} spots</span>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <FaRupeeSign className="text-pending" />
              <span>₹{tournamentDetails.entryFee}</span>
            </div>
          </div>

          <p className="mb-6 text-ink-soft">{tournamentDetails.description}</p>

          {/* Register Team Section */}
          <div className="mb-8">
            <h3 className="mb-4 text-2xl font-semibold text-pending">
              Register Your Team
            </h3>
            {teams.length === 0 && (
              <div className="mb-4 rounded border border-pending bg-surface p-4">
                <p className="mb-3 text-sm text-ink-soft">No team found. Create your first team to register in this tournament.</p>
                <div className="mb-2 flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Team name"
                  />
                  <Input
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    placeholder="Team description"
                    className="flex-1"
                  />
                </div>
                <Button onClick={createTeamHandler} disabled={creatingTeam}>
                  {creatingTeam ? "Creating Team..." : "Create Team"}
                </Button>
              </div>
            )}
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="h-10 w-full rounded border border-rule bg-surface px-3 text-sm text-ink"
              >
                <option value="">Select a team</option>
                {teams.map((team, index) => (
                  <option key={index} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
              <Button onClick={onSubmitHandler} disabled={!selectedTeam}>
                Register
              </Button>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-2 text-ink-soft">
            <FaCalendarAlt className="text-pending" />
            <span>
              Last registration date is {tournamentDetails.lastRegistrationDate}
            </span>
          </div>

          {/* Teams Joined Section */}
          <div>
            <h3 className="mb-4 text-2xl font-semibold text-pending">
              Teams Joined
            </h3>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {tournamentDetails.teams.map((team, idx) => (
                <li
                  key={idx}
                  className={`rounded border bg-surface p-4 ${
                    team.joined ? "border-go" : "border-pending"
                  }`}
                >
                  <p className="font-medium text-ink">{team.name}</p>
                  <p
                    className={`text-sm ${
                      team.joined ? "text-go" : "text-pending"
                    }`}
                  >
                    {team.joined ? "Registered" : "Pending"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
