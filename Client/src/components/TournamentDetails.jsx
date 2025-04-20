import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaRupeeSign } from "react-icons/fa";

export default function TournamentDetails() {
  const { id } = useParams(); // Get tournament ID from URL
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tournament details from the backend
    const fetchTournament = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/tournaments/${id}`);
        const data = await response.json();
        setTournament(data);
      } catch (error) {
        console.error("Error fetching tournament details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  if (loading) {
    return <p className="text-white text-center mt-20">Loading...</p>;
  }

  if (!tournament) {
    return <p className="text-white text-center mt-20">Tournament not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 mt-28 py-8 text-white">
      <Card className="bg-[#1E293B] border border-gray-700">
        <CardHeader>
          <h2 className="text-3xl font-bold text-[#FFD070]">{tournament.title}</h2>
          <p className="text-sm text-gray-400">{tournament.subtitle}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-300">
              <FaMapMarkerAlt className="text-[#FFD070]" />
              <span>{tournament.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FaCalendarAlt className="text-[#FFD070]" />
              <span>
                {tournament.startDate} - {tournament.endDate}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FaUsers className="text-[#FFD070]" />
              <span>{tournament.spots}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FaRupeeSign className="text-[#FFD070]" />
              <span>{tournament.entryFee}</span>
            </div>
          </div>
          <p className="text-gray-300">{tournament.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}