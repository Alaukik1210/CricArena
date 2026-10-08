import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAppSelector } from "@/redux/store";
import { ProfileStats, ProfileStatsFields } from "./ProfileStats";
import { ProfileTeams } from "./ProfileTeams";
import type { PlayerProfileData, ProfileFormData } from "./profile.types";

const emptyForm: ProfileFormData = {
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
};

interface ProfileFieldsProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
}

/** Text inputs plus the stats inputs, shared by the create and edit forms. */
function ProfileFields({ formData, setFormData }: ProfileFieldsProps) {
  const bind = (key: keyof ProfileFormData) => ({
    value: formData[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((prev) => ({ ...prev, [key]: e.target.value })),
  });

  return (
    <>
      <Input placeholder="Bio" {...bind("bio")} />
      <Input placeholder="Skills*" {...bind("skills")} />
      <Input placeholder="Batting Style*" {...bind("battingStyle")} />
      <Input placeholder="Bowling Style*" {...bind("bowlingStyle")} />
      <Input className="md:col-span-2" placeholder="Profile Photo URL" {...bind("profilePhoto")} />
      <Input className="md:col-span-2" placeholder="Achievements (comma separated)" {...bind("achievements")} />
      <ProfileStatsFields
        values={formData}
        onChange={(key, value) => setFormData((prev) => ({ ...prev, [key]: value }))}
      />
    </>
  );
}

const PlayerProfile = () => {
  const [profile, setProfile] = useState<PlayerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(emptyForm);
  const user = useAppSelector((store) => store.user.user);
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      const targetUserId = id || user?.id;
      if (!targetUserId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<{ profile: PlayerProfileData | null }>(`/user/profile/${targetUserId}`);
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

      const response = await api.post<{ profile: PlayerProfileData }>(`/user/profile/upsert/${targetUserId}`, payload);
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
      <div className="mt-40 min-h-screen bg-ground p-4 text-ink md:p-8">
        {/* Skeleton Header */}
        <div className="flex animate-pulse flex-col items-center justify-between rounded border border-rule bg-surface p-6 shadow-lg md:flex-row">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-surface-sunk"></div>
            <div>
              <div className="mb-2 h-6 w-32 rounded bg-surface-sunk"></div>
              <div className="h-4 w-48 rounded bg-surface-sunk"></div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 md:mt-0">
            <div className="h-10 w-32 rounded bg-surface-sunk"></div>
            <div className="h-10 w-32 rounded bg-surface-sunk"></div>
          </div>
        </div>

        {/* Skeleton Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((_, index) => (
            <Card key={index} className="animate-pulse shadow-lg">
              <CardContent className="p-4">
                <div className="mb-4 h-4 w-24 rounded bg-surface-sunk"></div>
                <div className="h-6 w-16 rounded bg-surface-sunk"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton Achievements */}
        <div className="mt-6">
          <div className="mb-4 h-6 w-48 rounded bg-surface-sunk"></div>
          <div className="flex gap-2">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="h-6 w-24 animate-pulse rounded bg-surface-sunk"></div>
            ))}
          </div>
        </div>

        {/* Skeleton My Team */}
        <div className="mt-6">
          <div className="mb-4 h-6 w-48 rounded bg-surface-sunk"></div>
          {[1, 2].map((_, index) => (
            <Card key={index} className="mb-4 animate-pulse shadow-lg">
              <CardContent className="p-4">
                <div className="mb-2 h-6 w-32 rounded bg-surface-sunk"></div>
                <div className="mb-4 h-4 w-48 rounded bg-surface-sunk"></div>
                <div className="h-10 w-32 rounded bg-surface-sunk"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mt-28 min-h-screen bg-ground p-6 text-ink">
        <div className="mx-auto max-w-3xl rounded border border-rule bg-surface p-6">
          <h2 className="mb-4 text-2xl font-bold text-ink">Complete Your Player Profile</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ProfileFields formData={formData} setFormData={setFormData} />
          </div>
          <Button onClick={saveProfile} disabled={saving} className="mt-6 font-bold">
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>
    );
  }

  const stats = {
    matches: profile.stats?.matches ?? 0,
    runs: profile.stats?.runs ?? 0,
    wickets: profile.stats?.wickets ?? 0,
    catches: profile.stats?.catches ?? 0,
  };

  return (
    <div className="mt-40 min-h-screen bg-ground p-4 text-ink md:p-8">
      {/* Header */}
      <div className="flex flex-col items-center justify-between rounded border border-rule bg-surface p-6 shadow-lg md:flex-row">
        <div className="flex items-center gap-4">
          <img
            src={profile.profilePhoto || "https://via.placeholder.com/150"}
            alt="Profile"
            className="h-16 w-16 rounded-full border-2 border-pending object-cover shadow-md"
          />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-ink">{user?.fullname}</h2>
            <p className="text-sm italic text-ink-soft">{profile.bio}</p>
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">Location:</span> {user?.city}, {user?.state}
            </p>
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">Email:</span> {user?.email}
            </p>
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">Phone:</span> {user?.phoneNumber}
            </p>
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">Batting Style:</span> {profile.battingStyle}
            </p>
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">Bowling Style:</span> {profile.bowlingStyle}
            </p>
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">Skills:</span> {profile.skills}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 pb-44 md:mt-0">
          <Button className="font-bold shadow-md">+ New Match</Button>
          <Button onClick={() => setEditMode((prev) => !prev)} variant="outline" className="shadow-md">
            {editMode ? "Close Editor" : "Edit Profile"}
          </Button>
        </div>
      </div>

      {editMode && (
        <div className="mt-6 grid grid-cols-1 gap-3 rounded border border-rule bg-surface p-4 md:grid-cols-2">
          <ProfileFields formData={formData} setFormData={setFormData} />
          <Button onClick={saveProfile} disabled={saving} className="font-bold md:col-span-2">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}

      <ProfileStats stats={stats} />

      {/* Achievements */}
      <div className="mt-6">
        <h3 className="mb-4 text-2xl font-semibold text-ink">Achievements</h3>
        <div className="flex flex-wrap gap-2">
          {(profile.achievements || []).map((achievement, index) => (
            <Badge key={index} tone="pending" className="text-sm shadow-md">
              {achievement}
            </Badge>
          ))}
        </div>
      </div>

      <ProfileTeams teams={profile.teams || []} />
    </div>
  );
};

export default PlayerProfile;
