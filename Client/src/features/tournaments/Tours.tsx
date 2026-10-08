import { useEffect, useState, type ChangeEvent } from "react";
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaRupeeSign,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { TournamentSummary } from "./tournaments.types";

const fallbackMatches: TournamentSummary[] = [
  {
    id: 1,
    title: "Delhi Premier League",
    description: "A competitive league for city’s best cricket teams.",
    venue: "Feroz Shah Kotla, Delhi",
    tourStartsDate: "2025-07-10",
    tourEndDate: "2025-07-20",
    spots: 12,
    entryFee: 2000,
    type: "League",
  },
  {
    id: 2,
    title: "Summer Training Camp",
    description: "Improve your skills with professional coaches.",
    venue: "Chinnaswamy Stadium, Bengaluru",
    tourStartsDate: "2025-07-15",
    tourEndDate: "2025-07-25",
    spots: 30,
    entryFee: 1000,
    type: "Training",
  },
  {
    id: 3,
    title: "Mumbai Monsoon Tournament",
    description: "Rain or shine, cricket goes on!",
    venue: "Wankhede Stadium, Mumbai",
    tourStartsDate: "2025-08-01",
    tourEndDate: "2025-08-10",
    spots: 16,
    entryFee: 2500,
    type: "Tournament",
  },
];

const FILTER_TYPES = ["All", "Tournament", "League", "Training"];

export default function Tours() {
  const [matches, setMatches] = useState<TournamentSummary[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<TournamentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTours() {
      try {
        // Unauthenticated endpoint.
        const response = await api.get<{ tournaments?: TournamentSummary[] }>("/owner/tours/getTours");
        const tournaments = response.data.tournaments || [];
        if (tournaments.length > 0) {
          setMatches(tournaments);
          setFilteredMatches(tournaments);
        } else {
          setMatches(fallbackMatches);
          setFilteredMatches(fallbackMatches);
        }
      } catch (error) {
        console.error("Failed to fetch tours:", error);
        setMatches(fallbackMatches);
        setFilteredMatches(fallbackMatches);
      } finally {
        setLoading(false);
      }
    }

    fetchTours();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = matches.filter((match) =>
      Object.values(match).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
    setFilteredMatches(filtered);
  };

  const handleFilter = (type: string) => {
    setFilterType(type);

    if (type === "All") {
      setFilteredMatches(matches);
    } else {
      const filtered = matches.filter((match) => match.type === type);
      setFilteredMatches(filtered);
    }
  };

  const handleRegisterClick = (id: string | number) => {
    navigate(`/register/${id}`); // Navigate to the tournament registration page
  };

  return (
    <div className="mt-28 bg-ground px-4 py-10 text-ink md:px-10 lg:px-20">
      <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h2 className="font-display text-3xl text-ink md:text-5xl">Join The Fun</h2>
          <p className="mt-2 text-sm text-ink-soft md:text-base">
            Upcoming cricket events near you
          </p>
        </div>
        {/* Search Bar */}
        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search tournaments..."
          className="w-full md:w-auto"
        />
      </div>

      {/* Filter Buttons */}
      <div className="mb-8 flex flex-wrap gap-4">
        {FILTER_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => handleFilter(type)}
            className={`rounded px-4 py-2 transition hover:opacity-90 ${
              filterType === type ? "bg-pending text-surface" : "bg-surface-sunk text-ink"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {loading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="overflow-hidden rounded border border-rule bg-surface p-6">
              <div className="mb-6 flex justify-between">
                <div className="h-6 w-48 animate-pulse rounded bg-surface-sunk"></div>
                <div className="h-6 w-20 animate-pulse rounded-full bg-surface-sunk"></div>
              </div>

              <div className="mb-6 h-16 w-full animate-pulse rounded bg-surface-sunk"></div>

              <div className="mb-6 space-y-3">
                {[1, 2, 3, 4].map((line) => (
                  <div key={line} className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-pulse rounded-full bg-surface-sunk"></div>
                    <div className="h-4 w-48 animate-pulse rounded bg-surface-sunk"></div>
                  </div>
                ))}
              </div>

              <div className="h-12 w-full animate-pulse rounded bg-surface-sunk"></div>
            </div>
          ))}
        </div>
      ) : filteredMatches.length === 0 ? (
        <p className="text-center text-ink">No matches found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="relative overflow-hidden rounded border border-rule bg-surface transition-all duration-300 hover:shadow-md"
            >
              <Badge tone="pending" className="absolute right-4 top-4">
                {match.type}
              </Badge>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="mb-2 text-xl font-bold text-pending">{match.title}</h3>
                  <p className="text-sm text-ink-soft">{match.description}</p>
                </div>

                <div className="mb-6 space-y-3">
                  <div className="flex items-center text-ink-soft">
                    <FaMapMarkerAlt className="mr-2 h-4 w-4 text-pending" />
                    <span className="text-sm">{match.venue}</span>
                  </div>

                  <div className="flex items-center text-ink-soft">
                    <FaClock className="mr-2 h-4 w-4 text-pending" />
                    <span className="text-sm">
                      {new Date(match.tourStartsDate).toLocaleDateString()} -{" "}
                      {new Date(match.tourEndDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center text-ink-soft">
                    <FaUsers className="mr-2 h-4 w-4 text-pending" />
                    <span className="text-sm">{match.spots} spots</span>
                  </div>

                  <div className="flex items-center text-ink-soft">
                    <FaRupeeSign className="mr-2 h-4 w-4 text-pending" />
                    <span className="text-sm">₹{match.entryFee}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRegisterClick(match.id)}
                  className="group flex w-full items-center justify-center rounded bg-pending px-4 py-3 font-semibold text-surface transition-opacity duration-300 hover:opacity-90"
                >
                  Register Now
                  <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
