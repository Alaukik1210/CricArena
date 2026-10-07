import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PROFILE_API_END_POINT } from "@/utils/constants";

const PlayerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    battingStyle: "",
    bowlingStyle: "",
    profilePhoto: "",
    achievements: "",
    statsMatches: 0,
    statsRuns: 0,
    statsWickets: 0,
    statsCatches: 0,
  });
   const { user } = useSelector((store) => store.user);
   const { id } = useParams();
  

  useEffect(() => {
    const fetchProfile = async () => {
      const targetUserId = id || user?.id;
      if (!targetUserId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${PROFILE_API_END_POINT}/${targetUserId}`);
        const incomingProfile = response.data.profile;
        setProfile(incomingProfile);
        setFormData({
          bio: incomingProfile?.bio || "",
          skills: incomingProfile?.skills || "",
          battingStyle: incomingProfile?.battingStyle || "",
          bowlingStyle: incomingProfile?.bowlingStyle || "",
          profilePhoto: incomingProfile?.profilePhoto || "",
          achievements: incomingProfile?.achievements?.join(", ") || "",
          statsMatches: incomingProfile?.stats?.matches || 0,
          statsRuns: incomingProfile?.stats?.runs || 0,
          statsWickets: incomingProfile?.stats?.wickets || 0,
          statsCatches: incomingProfile?.stats?.catches || 0,
        });
      } catch (error) {
        console.error("Error fetching player profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, user?.id]);

  const saveProfile = async () => {
    const targetUserId = id || user?.id;
    if (!targetUserId) {
      alert("User not found. Please login again.");
      return;
    }

    if (!formData.skills || !formData.battingStyle || !formData.bowlingStyle) {
      alert("Please fill skills, batting style, and bowling style.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        bio: formData.bio,
        skills: formData.skills,
        battingStyle: formData.battingStyle,
        bowlingStyle: formData.bowlingStyle,
        profilePhoto: formData.profilePhoto,
        achievements: formData.achievements
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        stats: {
          matches: Number(formData.statsMatches || 0),
          runs: Number(formData.statsRuns || 0),
          wickets: Number(formData.statsWickets || 0),
          catches: Number(formData.statsCatches || 0),
        },
      };

      const response = await axios.post(`${PROFILE_API_END_POINT}/upsert/${targetUserId}`, payload);
      setProfile(response.data.profile);
      setEditMode(false);
      alert("Profile saved successfully");
    } catch (error) {
      console.error("Error saving player profile:", error);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

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
    return (
      <div className="min-h-screen bg-black text-white p-6 mt-28">
        <div className="max-w-3xl mx-auto bg-goldx rounded-xl p-6">
          <h2 className="text-2xl font-bold text-[#FFD070] mb-4">Complete Your Player Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="bg-black p-2 rounded" placeholder="Bio" value={formData.bio} onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))} />
            <input className="bg-black p-2 rounded" placeholder="Skills*" value={formData.skills} onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value }))} />
            <input className="bg-black p-2 rounded" placeholder="Batting Style*" value={formData.battingStyle} onChange={(e) => setFormData((prev) => ({ ...prev, battingStyle: e.target.value }))} />
            <input className="bg-black p-2 rounded" placeholder="Bowling Style*" value={formData.bowlingStyle} onChange={(e) => setFormData((prev) => ({ ...prev, bowlingStyle: e.target.value }))} />
            <input className="bg-black p-2 rounded md:col-span-2" placeholder="Profile Photo URL" value={formData.profilePhoto} onChange={(e) => setFormData((prev) => ({ ...prev, profilePhoto: e.target.value }))} />
            <input className="bg-black p-2 rounded md:col-span-2" placeholder="Achievements (comma separated)" value={formData.achievements} onChange={(e) => setFormData((prev) => ({ ...prev, achievements: e.target.value }))} />
            <input type="number" className="bg-black p-2 rounded" placeholder="Matches" value={formData.statsMatches} onChange={(e) => setFormData((prev) => ({ ...prev, statsMatches: e.target.value }))} />
            <input type="number" className="bg-black p-2 rounded" placeholder="Runs" value={formData.statsRuns} onChange={(e) => setFormData((prev) => ({ ...prev, statsRuns: e.target.value }))} />
            <input type="number" className="bg-black p-2 rounded" placeholder="Wickets" value={formData.statsWickets} onChange={(e) => setFormData((prev) => ({ ...prev, statsWickets: e.target.value }))} />
            <input type="number" className="bg-black p-2 rounded" placeholder="Catches" value={formData.statsCatches} onChange={(e) => setFormData((prev) => ({ ...prev, statsCatches: e.target.value }))} />
          </div>
          <Button onClick={saveProfile} disabled={saving} className="mt-6 bg-[#FFD070] text-black font-bold hover:bg-[#FFC857]">
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>
    );
  }

  const stats = {
    matches: profile?.stats?.matches ?? 0,
    runs: profile?.stats?.runs ?? 0,
    wickets: profile?.stats?.wickets ?? 0,
    catches: profile?.stats?.catches ?? 0,
  };

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
         <div className="space-y-2">
  <h2 className="text-2xl font-bold text-[#FFD070]">{user?.fullname}</h2>
  <p className="text-sm text-gray-400 italic">{profile.bio}</p>
  <p className="text-sm text-gray-300">
    <span className="font-semibold text-[#FFD070]">Location:</span> {user?.city}, {user?.state}
  </p>
  <p className="text-sm text-gray-300">
    <span className="font-semibold text-[#FFD070]">Email:</span> {user.email}
  </p>
  <p className="text-sm text-gray-300">
    <span className="font-semibold text-[#FFD070]">Phone:</span> {user.phoneNumber}
  </p>
  <p className="text-sm text-gray-300">
    <span className="font-semibold text-[#FFD070]">Batting Style:</span> {profile.battingStyle}
  </p>
  <p className="text-sm text-gray-300">
    <span className="font-semibold text-[#FFD070]">Bowling Style:</span> {profile.bowlingStyle}
  </p>
  <p className="text-sm text-gray-300">
    <span className="font-semibold text-[#FFD070]">Skills:</span> {profile.skills}
  </p>
</div>
        </div>
        <div className="flex items-center gap-4 mt-4 pb-44 md:mt-0">
          <Button className="bg-[#FFD070] text-black font-bold hover:bg-[#FFC857] shadow-md">
            + New Match
          </Button>
          <Button
            onClick={() => setEditMode((prev) => !prev)}
            variant="outline"
            className="border-[#FFD070] text-[#FFD070] hover:bg-[#FFD070] bg-black shadow-md"
          >
            {editMode ? "Close Editor" : "Edit Profile"}
          </Button>
        </div>
      </div>

      {editMode && (
        <div className="mt-6 bg-goldx rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="bg-black p-2 rounded" placeholder="Bio" value={formData.bio} onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))} />
          <input className="bg-black p-2 rounded" placeholder="Skills*" value={formData.skills} onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value }))} />
          <input className="bg-black p-2 rounded" placeholder="Batting Style*" value={formData.battingStyle} onChange={(e) => setFormData((prev) => ({ ...prev, battingStyle: e.target.value }))} />
          <input className="bg-black p-2 rounded" placeholder="Bowling Style*" value={formData.bowlingStyle} onChange={(e) => setFormData((prev) => ({ ...prev, bowlingStyle: e.target.value }))} />
          <input className="bg-black p-2 rounded md:col-span-2" placeholder="Profile Photo URL" value={formData.profilePhoto} onChange={(e) => setFormData((prev) => ({ ...prev, profilePhoto: e.target.value }))} />
          <input className="bg-black p-2 rounded md:col-span-2" placeholder="Achievements (comma separated)" value={formData.achievements} onChange={(e) => setFormData((prev) => ({ ...prev, achievements: e.target.value }))} />
          <input type="number" className="bg-black p-2 rounded" placeholder="Matches" value={formData.statsMatches} onChange={(e) => setFormData((prev) => ({ ...prev, statsMatches: e.target.value }))} />
          <input type="number" className="bg-black p-2 rounded" placeholder="Runs" value={formData.statsRuns} onChange={(e) => setFormData((prev) => ({ ...prev, statsRuns: e.target.value }))} />
          <input type="number" className="bg-black p-2 rounded" placeholder="Wickets" value={formData.statsWickets} onChange={(e) => setFormData((prev) => ({ ...prev, statsWickets: e.target.value }))} />
          <input type="number" className="bg-black p-2 rounded" placeholder="Catches" value={formData.statsCatches} onChange={(e) => setFormData((prev) => ({ ...prev, statsCatches: e.target.value }))} />
          <Button onClick={saveProfile} disabled={saving} className="bg-[#FFD070] text-black font-bold hover:bg-[#FFC857] md:col-span-2">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Matches", value: stats.matches },
          { label: "Runs", value: stats.runs },
          { label: "Wickets", value: stats.wickets },
          { label: "Catches", value: stats.catches },
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
          {(profile.achievements || []).map((achievement, index) => (
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
        {(profile.teams || []).length > 0 ? (
          (profile.teams || []).map((team) => (
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