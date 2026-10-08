import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaRupeeSign } from "react-icons/fa";
import { api } from "@/lib/api";

interface TournamentInfo {
  title: string;
  subtitle?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  spots?: string | number;
  entryFee?: string | number;
  description?: string;
}

// Hardcoded fallback tournament data
const fallbackTournament: TournamentInfo = {
  title: "CricArena Summer Cup",
  subtitle: "Open for all age groups",
  location: "Sector 21, New Delhi",
  startDate: "2025-07-01",
  endDate: "2025-07-10",
  spots: 16,
  entryFee: 1500,
  description:
    "Join the most exciting summer cricket tournament in the city! Compete with the best teams and win amazing prizes. All matches will be played under floodlights with professional umpires.",
};

export default function TournamentDetails() {
  const { id } = useParams(); // Get tournament ID from URL
  const [tournament, setTournament] = useState<TournamentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tournament details from the backend
    const fetchTournament = async () => {
      try {
        const response = await api.get<TournamentInfo | null>(`/owner/tours/${id}`);
        const data = response.data;
        // If data is valid and has a title, use it; else fallback
        if (data && data.title) {
          setTournament(data);
        } else {
          setTournament(fallbackTournament);
        }
      } catch (error) {
        console.error("Error fetching tournament details:", error);
        setTournament(fallbackTournament);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  if (loading) {
    return <p className="mt-20 text-center text-ink">Loading...</p>;
  }

  if (!tournament) {
    return <p className="mt-20 text-center text-ink">Tournament not found.</p>;
  }

  return (
    <div className="mx-auto mt-28 max-w-5xl px-4 py-8 text-ink">
      <Card>
        <CardHeader>
          <h2 className="text-3xl font-bold text-pending">{tournament.title}</h2>
          <p className="text-sm text-ink-soft">{tournament.subtitle}</p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2 text-ink-soft">
              <FaMapMarkerAlt className="text-pending" />
              <span>{tournament.location}</span>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <FaCalendarAlt className="text-pending" />
              <span>
                {tournament.startDate} - {tournament.endDate}
              </span>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <FaUsers className="text-pending" />
              <span>{tournament.spots}</span>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <FaRupeeSign className="text-pending" />
              <span>{tournament.entryFee}</span>
            </div>
          </div>
          <p className="text-ink-soft">{tournament.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
