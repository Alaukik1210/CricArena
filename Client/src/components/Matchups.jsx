import { useEffect, useState } from "react";
import { FaArrowRight, FaMapMarkerAlt, FaClock, FaUsers, FaRupeeSign } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Matchups() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/owner/tours/getTours");
        const tournaments = response.data.tournaments || [];

        // Sort tournaments by createdAt in descending order and take the top 3
        const sortedTournaments = tournaments
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        setMatches(sortedTournaments);
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTournaments();
  }, []);

  return (
    <div className="bg-black text-white p-10 m-20">
      {/* Heading */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-5xl font-bold text-[#FFD070]">JOIN THE FUN</h2>
          <p className="text-gray-400 mt-2">Top 3 Latest Tournaments</p>
        </div>
        <button
          onClick={() => navigate('/tournaments')}
          className="flex items-center text-lg font-semibold text-[#FFD070] hover:opacity-80 transition-all duration-300"
        >
          Explore all <FaArrowRight className="ml-2" />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl overflow-hidden border border-zinc-700/50 p-6"
            >
              <div className="flex justify-between mb-6">
                <div className="h-6 w-48 bg-zinc-700 rounded-lg animate-pulse"></div>
                <div className="h-6 w-20 bg-zinc-700 rounded-full animate-pulse"></div>
              </div>

              <div className="h-16 w-full bg-zinc-700 rounded-lg animate-pulse mb-6"></div>

              <div className="space-y-3 mb-6">
                {[1, 2, 3, 4].map((line) => (
                  <div key={line} className="flex items-center">
                    <div className="h-4 w-4 bg-zinc-700 rounded-full animate-pulse mr-2"></div>
                    <div className="h-4 w-48 bg-zinc-700 rounded-lg animate-pulse"></div>
                  </div>
                ))}
              </div>

              <div className="h-12 w-full bg-zinc-700 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        // Loaded Data
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match) => (
            <div
              key={match.id}
              className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl overflow-hidden group hover:shadow-xl hover:shadow-[#FFD070]/10 transition-all duration-300 border border-zinc-700/50"
            >
              <div className="absolute top-4 right-4 bg-[#FFD070]/10 text-[#FFD070] px-3 py-1 rounded-full text-sm font-semibold">
                {match.type}
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#FFD070] mb-2">{match.title}</h3>
                  <p className="text-gray-300 text-sm">{match.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-400">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#FFD070]" />
                    <span className="text-sm">{match.venue}</span>
                  </div>

                  <div className="flex items-center text-gray-400">
                    <FaClock className="w-4 h-4 mr-2 text-[#FFD070]" />
                    <span className="text-sm">
                      {new Date(match.tourStartsDate).toLocaleDateString()} -{" "}
                      {new Date(match.tourEndDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-400">
                    <FaUsers className="w-4 h-4 mr-2 text-[#FFD070]" />
                    <span className="text-sm">{match.spots} spots</span>
                  </div>

                  <div className="flex items-center text-gray-400">
                    <FaRupeeSign className="w-4 h-4 mr-2 text-[#FFD070]" />
                    <span className="text-sm">{match.entryFee === 0 ? "free" : `₹${match.entryFee}`}</span>
                  </div>
                </div>

                <button className="w-full py-3 px-4 bg-[#FFD070] text-black font-semibold rounded-lg hover:bg-[#FFD070]/90 transition-colors duration-300 flex items-center justify-center group">
                  Register Now
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}