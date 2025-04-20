import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaRupeeSign } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function RegisterTour() {
  const [teamName, setTeamName] = useState("");
  const [tournamentDetails, setTournamentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  // Fetch tournament details from the backend
  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/owner/tours/${id}`);
        setTournamentDetails(response.data.tournament); // Accessing the tournament details
      } catch (error) {
        console.error("Error fetching tournament details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentDetails();
  }, [id]);

  const onSubmitHandler = async () => {
    if (!teamName) return;

    try {
      const response = await axios.post(`http://localhost:8080/api/v1/owner/tours/${id}/register`, {
        teamName,
      });
      console.log("Registration successful:", response.data);
      alert("Team registered successfully!");
      setTeamName(""); // Clear the input field after successful registration
    } catch (error) {
      console.error("Error registering team:", error);
      alert("Failed to register the team. Please try again.");
    }
  };

  if (loading) {
    return <p className="text-white text-center mt-20">Loading tournament details...</p>;
  }

  if (!tournamentDetails) {
    return <p className="text-white text-center mt-20">Tournament not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 mt-40 py-8 text-white">
      {/* Tournament Details */}
      <Card className="bg-goldx border border-gray-700">
        <CardHeader>
          <h2 className="text-3xl font-bold text-[#FFD070]">
            {tournamentDetails.title}
          </h2>
          <p className="text-sm text-gray-400">{tournamentDetails.description}</p>
        </CardHeader>
        <CardContent>
          {/* Tournament Info */}
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
            <div className="flex gap-2">
              <Input
                placeholder="Enter Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="bg-black text-white border-gray-600 placeholder:text-gray-400"
              />
              <Button
                onClick={onSubmitHandler}
                disabled={!teamName}
                className={`${
                  teamName
                    ? "bg-[#FFD070] text-black hover:bg-[#FFC857]"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                Register
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
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