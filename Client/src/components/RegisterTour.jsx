import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaRupeeSign } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function RegisterTour() {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [tournamentDetails, setTournamentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const { id } = useParams();
  const user = useSelector(store => store.user);
  const userId = user.user.id;

  const fetchTeamById = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/user/profile/${userId}/teams`);
      setTeams(res.data.teams || []);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/owner/tours/${id}`);
        setTournamentDetails(response.data.tournament);
        fetchTeamById();
      } catch (error) {
        console.error("Error fetching tournament details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentDetails();
  }, [id]);

  const onSubmitHandler = async () => {
    if (!selectedTeam) return;
  
    try {
      // Find the selected team's ID
      const selectedTeamObj = teams.find((team) => team.name === selectedTeam);
      if (!selectedTeamObj) {
        alert("Selected team not found.");
        return;
      }
  
      const teamId = selectedTeamObj.id; // Get the team ID
  
      // Send the POST request with tournamentId and teamId
      const response = await axios.post(`http://localhost:8080/api/v1/owner/tours/register`, {
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

  if (loading) {
    return <div className="text-white text-center h-40 w-80 mt-80 items-center ml-96 pl-96">Loading tournament details...</div>;
  }

  if (!tournamentDetails) {
    return <p className="text-white text-center mt-20">Tournament not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 mt-40 py-8 text-white">
      <Card className="bg-goldx border border-gray-700">
        <CardHeader>
          <h2 className="text-3xl font-bold text-[#FFD070]">
            {tournamentDetails.title}
          </h2>
          <p className="text-sm text-gray-400">{tournamentDetails.description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-300">
              <FaMapMarkerAlt className="text-[#FFD070]" />
              <span>{tournamentDetails.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FaCalendarAlt className="text-[#FFD070]" />
              <span>
                {tournamentDetails.tourStartsDate} - {tournamentDetails.tourEndDate}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FaUsers className="text-[#FFD070]" />
              <span>{tournamentDetails.spots} spots</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FaRupeeSign className="text-[#FFD070]" />
              <span>₹{tournamentDetails.entryFee}</span>
            </div>
          </div>

          <p className="text-gray-300 mb-6">{tournamentDetails.description}</p>

          {/* Register Team Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-[#FFD070] mb-4">
              Register Your Team
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="bg-black text-white border border-gray-600 p-2 rounded-md"
              >
                <option value="">Select a team</option>
                {teams.map((team, index) => (
                  <option key={index} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={onSubmitHandler}
                disabled={!selectedTeam}
                className={`${
                  selectedTeam
                    ? "bg-[#FFD070] text-black hover:bg-[#FFC857]"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                Register
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-300 mb-6">
            <FaCalendarAlt className="text-[#FFD070]" />
            <span>
              Last registration date is {tournamentDetails.lastRegistrationDate}
            </span>
          </div>

          {/* Teams Joined Section */}
          <div>
            <h3 className="text-2xl font-semibold text-[#FFD070] mb-4">
              Teams Joined
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournamentDetails.teams.map((team, idx) => (
                <li
                  key={idx}
                  className={`rounded-lg p-4 border ${
                    team.joined ? "border-green-500" : "border-yellow-400"
                  } bg-[#1F2937]`}
                >
                  <p className="font-medium text-white">{team.name}</p>
                  <p
                    className={`text-sm ${
                      team.joined ? "text-green-400" : "text-yellow-400"
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
