import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
// import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const PlayerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
   const { user } = useSelector((store) => store.user);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/user/profile/${user.user.id}`);
        setProfile(response.data.profile);
      } catch (error) {
        console.error("Error fetching player profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-8 mt-40">
        {/* Skeleton Header */}
        <div className="bg-goldx rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-700"></div>
            <div>
              <div className="h-6 w-32 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="h-10 w-32 bg-gray-700 rounded"></div>
            <div className="h-10 w-32 bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Skeleton Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4].map((_, index) => (
            <Card
              key={index}
              className="bg-goldx border border-gray-700 shadow-lg animate-pulse"
            >
              <CardContent className="p-4">
                <div className="h-4 w-24 bg-gray-700 rounded mb-4"></div>
                <div className="h-6 w-16 bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton Achievements */}
        <div className="mt-6">
          <div className="h-6 w-48 bg-gray-700 rounded mb-4"></div>
          <div className="flex gap-2">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="h-6 w-24 bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Skeleton My Team */}
        <div className="mt-6">
          <div className="h-6 w-48 bg-gray-700 rounded mb-4"></div>
          {[1, 2].map((_, index) => (
            <Card
              key={index}
              className="bg-goldx border border-gray-700 mb-4 shadow-lg animate-pulse"
            >
              <CardContent className="p-4">
                <div className="h-6 w-32 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-48 bg-gray-700 rounded mb-4"></div>
                <div className="h-10 w-32 bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return <p className="text-white text-center mt-20">Profile not found.</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 mt-40">
      {/* Header */}
      <div className="bg-goldx rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <img
            src={profile.profilePhoto || "https://via.placeholder.com/150"}
            alt="Profile"
            className="h-16 w-16 rounded-full object-cover border-2 border-[#FFD070] shadow-md"
          />
          <div>
            <h2 className="text-2xl font-bold text-[#FFD070]">{user.fullname}</h2>
            <p className="text-sm text-gray-400">{profile.bio}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button className="bg-[#FFD070] text-black font-bold hover:bg-[#FFC857] shadow-md">
            + New Match
          </Button>
          <Button
            variant="outline"
            className="border-[#FFD070] text-[#FFD070] hover:bg-[#FFD070] bg-black shadow-md"
          >
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Matches", value: profile.stats.matches },
          { label: "Runs", value: profile.stats.runs },
          { label: "Wickets", value: profile.stats.wickets },
          { label: "Catches", value: profile.stats.catches },
        ].map((stat, index) => (
          <Card
            key={index}
            className="bg-goldx border border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardContent className="p-4">
              <p className="text-gold text-sm">{stat.label}</p>
              <p className="text-xl text-white font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements */}
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-[#FFD070] mb-4">Achievements</h3>
        <div className="flex flex-wrap gap-2">
          {profile.achievements.map((achievement, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-sm border-[#FFD070] text-[#FFD070] shadow-md"
            >
              {achievement}
            </Badge>
          ))}
        </div>
      </div>

      {/* My Team */}
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-[#FFD070] mb-4">My Team</h3>
        {profile.teams.length > 0 ? (
          profile.teams.map((team) => (
            <Card
              key={team.id}
              className="bg-goldx border border-gray-700 mb-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-4">
                <h4 className="text-lg font-bold text-white">{team.name}</h4>
                <p className="text-sm text-gray-400">{team.description}</p>
                <Button className="mt-4 bg-[#FFD070] text-black hover:bg-[#FFC857] shadow-md">
                  View Team
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-400">No teams found.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;