import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaRupeeSign,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Tours() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTours() {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/owner/tours/getTours");
        const tournaments = response.data.tournaments || [];
        setMatches(tournaments);
        setFilteredMatches(tournaments);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTours();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = matches.filter((match) =>
      Object.values(match).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
    setFilteredMatches(filtered);
  };

  const handleFilter = (type) => {
    setFilterType(type);

    if (type === "All") {
      setFilteredMatches(matches);
    } else {
      const filtered = matches.filter((match) => match.type === type);
      setFilteredMatches(filtered);
    }
  };

  const handleRegisterClick = (id) => {
    navigate(`/register/${id}`); // Navigate to the tournament details page
  };

  return (
    <div className="bg-black text-white px-4 py-10 md:px-10 lg:px-20 mt-28">
  <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
    <div>
      <h2 className="text-3xl md:text-5xl font-bold text-[#FFD070]">Join The Fun</h2>
      <p className="text-gray-400 mt-2 text-sm md:text-base">
        Upcoming cricket events near you
      </p>
    </div>
    {/* Search Bar */}
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearch}
      placeholder="Search tournaments..."
      className="w-full md:w-auto px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD070]"
    />
  </div>

  {/* Filter Buttons */}
  <div className="flex flex-wrap gap-4 mb-8">
    <button
      onClick={() => handleFilter("All")}
      className={`px-4 py-2 rounded-lg ${
        filterType === "All" ? "bg-[#FFD070] text-black" : "bg-zinc-800 text-white"
      } hover:bg-[#FFD070]/90 transition`}
    >
      All
    </button>
    <button
      onClick={() => handleFilter("Tournament")}
      className={`px-4 py-2 rounded-lg ${
        filterType === "Tournament" ? "bg-[#FFD070] text-black" : "bg-zinc-800 text-white"
      } hover:bg-[#FFD070]/90 transition`}
    >
      Tournament
    </button>
    <button
      onClick={() => handleFilter("League")}
      className={`px-4 py-2 rounded-lg ${
        filterType === "League" ? "bg-[#FFD070] text-black" : "bg-zinc-800 text-white"
      } hover:bg-[#FFD070]/90 transition`}
    >
      League
    </button>
    <button
      onClick={() => handleFilter("Training")}
      className={`px-4 py-2 rounded-lg ${
        filterType === "Training" ? "bg-[#FFD070] text-black" : "bg-zinc-800 text-white"
      } hover:bg-[#FFD070]/90 transition`}
    >
      Training
    </button>
  </div>

  {loading ? (
    // Skeleton Loader
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((item) => (
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
  ) : filteredMatches.length === 0 ? (
    <p className="text-white text-center">No matches found.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredMatches.map((match) => (
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
                <span className="text-sm">₹{match.entryFee}</span>
              </div>
            </div>

            <button
              onClick={() => handleRegisterClick(match.id)}
              className="w-full py-3 px-4 bg-[#FFD070] text-black font-semibold rounded-lg hover:bg-[#FFD070]/90 transition-colors duration-300 flex items-center justify-center group"
            >
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