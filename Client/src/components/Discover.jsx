import axios from "axios";
import { Compass, LocateFixed, Radar, Sparkles, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ProductShell, SectionBlock, MetricCard } from "./ProductShell";
import {
  AVAILABILITY_API_END_POINT,
  DISCOVERY_API_END_POINT,
  PLAY_ROOMS_API_END_POINT,
} from "@/utils/constants";

const DEFAULT_AVAILABILITY = {
  skillLevel: "Intermediate",
  preferredRoles: "Batter, Fielder",
  radiusKm: 10,
  notes: "",
};

const DEFAULT_ROOM = {
  title: "",
  description: "",
  requiredPlayers: 10,
  skillLevel: "Intermediate",
  teamMode: "SINGLE_GROUP",
  matchDate: "",
  contactMode: "WHATSAPP_CONSENT",
};

const formatDistance = (distanceKm) =>
  typeof distanceKm === "number" ? `${distanceKm.toFixed(1)} km away` : "Within your city";

export default function Discover() {
  const { user } = useSelector((store) => store.user);
  const [coords, setCoords] = useState(null);
  const [availability, setAvailability] = useState(DEFAULT_AVAILABILITY);
  const [roomForm, setRoomForm] = useState(DEFAULT_ROOM);
  const [feed, setFeed] = useState({ rooms: [], activePlayers: [] });
  const [feedLoading, setFeedLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [status, setStatus] = useState("");

  const metrics = useMemo(
    () => [
      { label: "Nearby Players", value: `${feed.activePlayers.length}`, detail: "Active in your current radius" },
      { label: "Open Rooms", value: `${feed.rooms.length}`, detail: "Ready for quick joins and approvals" },
      { label: "Your Radius", value: `${availability.radiusKm} km`, detail: "Editable anytime from this screen" },
      { label: "Best Use", value: "Play Faster", detail: "Less chat chaos, more actual cricket" },
    ],
    [availability.radiusKm, feed.activePlayers.length, feed.rooms.length],
  );

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Location is not supported on this device.");
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setCoords(nextCoords);
        setStatus("Using your current location for discovery.");
        setGeoLoading(false);
      },
      () => {
        setStatus("Could not read your location. You can still browse rooms, but distance matching will be weaker.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const loadFeed = async (nextCoords = coords, nextRadius = availability.radiusKm) => {
    try {
      setFeedLoading(true);
      const useGeoFilters = Boolean(nextCoords?.latitude && nextCoords?.longitude);
      const response = await axios.get(`${DISCOVERY_API_END_POINT}/feed`, {
        params: {
          ...(nextCoords ?? {}),
          radiusKm: nextRadius,
          sport: "CRICKET",
          city: useGeoFilters ? undefined : user?.city,
          state: useGeoFilters ? undefined : user?.state,
        },
      });

      const players = (response.data.activePlayers || []).filter(
        (entry) => entry.user?.id !== user?.id,
      );

      setFeed({
        rooms: response.data.rooms || [],
        activePlayers: players,
      });
    } catch (error) {
      console.error("Failed to load discovery feed:", error);
      setStatus("Could not load discovery feed right now.");
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    loadFeed(coords, availability.radiusKm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, availability.radiusKm, user?.city, user?.state]);

  const submitAvailability = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      setStatus("Please login first to become visible to players nearby.");
      return;
    }

    try {
      setSavingAvailability(true);
      await axios.post(AVAILABILITY_API_END_POINT, {
        sport: "CRICKET",
        isActive: true,
        availabilityType: "CASUAL",
        skillLevel: availability.skillLevel,
        preferredRoles: availability.preferredRoles,
        radiusKm: Number(availability.radiusKm),
        latitude: coords?.latitude,
        longitude: coords?.longitude,
        notes: availability.notes,
      });

      setStatus("You are now visible to players and rooms in your selected range.");
      await loadFeed(coords, availability.radiusKm);
    } catch (error) {
      console.error("Failed to save availability:", error);
      setStatus("Could not save your availability.");
    } finally {
      setSavingAvailability(false);
    }
  };

  const createRoom = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      setStatus("Please login first to create a room.");
      return;
    }

    try {
      setCreatingRoom(true);
      await axios.post(PLAY_ROOMS_API_END_POINT, {
        ...roomForm,
        sport: "CRICKET",
        latitude: coords?.latitude,
        longitude: coords?.longitude,
        radiusKm: Number(availability.radiusKm),
        requiredPlayers: Number(roomForm.requiredPlayers),
        city: user?.city,
        state: user?.state,
      });

      setRoomForm(DEFAULT_ROOM);
      setStatus("Room created successfully. Nearby players can now discover it.");
      await loadFeed(coords, availability.radiusKm);
    } catch (error) {
      console.error("Failed to create room:", error);
      setStatus("Could not create the room.");
    } finally {
      setCreatingRoom(false);
    }
  };

  const joinRoom = async (roomId) => {
    if (!user?.id) {
      setStatus("Please login first to join a room.");
      return;
    }

    try {
      await axios.post(`${PLAY_ROOMS_API_END_POINT}/${roomId}/join-requests`, {
        message: "Interested in joining this game.",
      });

      setStatus("Join request sent. You will be visible to the room creator for approval.");
      await loadFeed(coords, availability.radiusKm);
    } catch (error) {
      console.error("Failed to join room:", error);
      setStatus(
        error.response?.data?.message || "Could not send the join request for this room.",
      );
    }
  };

  return (
    <ProductShell
      kicker="Discovery"
      title="Find people who can actually play near you."
      description="Turn on visibility, set your radius, and instantly see active players and open rooms around you. Less coordination, faster games."
      actions={
        <>
          <button type="button" className="cta-primary" onClick={detectLocation} disabled={geoLoading}>
            <LocateFixed className="mr-2 h-4 w-4" />
            {geoLoading ? "Detecting..." : "Use My Location"}
          </button>
          <Link to="/rooms" className="cta-secondary">
            <Radar className="mr-2 h-4 w-4" />
            Manage Rooms
          </Link>
        </>
      }
    >
      <section className="product-grid-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      {status ? (
        <div className="product-panel px-5 py-4 text-sm text-[#f0ddb0] md:px-6">
          {status}
        </div>
      ) : null}

      <div className="product-grid-2">
        <SectionBlock
          kicker="Visibility"
          title="Become visible in your range"
          description="This is the control surface for player visibility. Keep it quick, clear, and easy to edit from mobile."
        >
          <form className="space-y-4" onSubmit={submitAvailability}>
            <div className="product-grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Skill level</label>
                <select
                  className="standard-select"
                  value={availability.skillLevel}
                  onChange={(event) =>
                    setAvailability((prev) => ({ ...prev, skillLevel: event.target.value }))
                  }
                >
                  {["Beginner", "Intermediate", "Advanced", "Competitive"].map((option) => (
                    <option key={option} value={option} className="bg-[#101416]">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Radius in km</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="standard-input"
                  value={availability.radiusKm}
                  onChange={(event) =>
                    setAvailability((prev) => ({ ...prev, radiusKm: event.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white">Preferred roles</label>
              <input
                className="standard-input"
                placeholder="Batter, Bowler, Keeper"
                value={availability.preferredRoles}
                onChange={(event) =>
                  setAvailability((prev) => ({ ...prev, preferredRoles: event.target.value }))
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white">Quick note</label>
              <textarea
                className="standard-textarea"
                placeholder="Weekend evenings work best. Happy to join a friendly 10-over game."
                value={availability.notes}
                onChange={(event) =>
                  setAvailability((prev) => ({ ...prev, notes: event.target.value }))
                }
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="cta-primary" disabled={savingAvailability}>
                <Compass className="mr-2 h-4 w-4" />
                {savingAvailability ? "Saving..." : "Go Visible"}
              </button>
              <button
                type="button"
                className="cta-secondary"
                onClick={() => loadFeed(coords, availability.radiusKm)}
                disabled={feedLoading}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Refresh Feed
              </button>
            </div>
          </form>
        </SectionBlock>

        <SectionBlock
          kicker="Room Creation"
          title="Open a room in one minute"
          description="Create a room nearby and let players in your range discover it fast."
        >
          <form className="space-y-4" onSubmit={createRoom}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-white">Room title</label>
              <input
                className="standard-input"
                placeholder="Friday Night 10-over game"
                value={roomForm.title}
                onChange={(event) =>
                  setRoomForm((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </div>

            <div className="product-grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Required players</label>
                <input
                  type="number"
                  min="2"
                  max="22"
                  className="standard-input"
                  value={roomForm.requiredPlayers}
                  onChange={(event) =>
                    setRoomForm((prev) => ({ ...prev, requiredPlayers: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Match date</label>
                <input
                  type="datetime-local"
                  className="standard-input"
                  value={roomForm.matchDate}
                  onChange={(event) =>
                    setRoomForm((prev) => ({ ...prev, matchDate: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="product-grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Skill level</label>
                <select
                  className="standard-select"
                  value={roomForm.skillLevel}
                  onChange={(event) =>
                    setRoomForm((prev) => ({ ...prev, skillLevel: event.target.value }))
                  }
                >
                  {["Beginner", "Intermediate", "Advanced", "Competitive"].map((option) => (
                    <option key={option} value={option} className="bg-[#101416]">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Contact mode</label>
                <select
                  className="standard-select"
                  value={roomForm.contactMode}
                  onChange={(event) =>
                    setRoomForm((prev) => ({ ...prev, contactMode: event.target.value }))
                  }
                >
                  <option value="IN_APP" className="bg-[#101416]">In app</option>
                  <option value="WHATSAPP_CONSENT" className="bg-[#101416]">WhatsApp after consent</option>
                  <option value="PHONE_CONSENT" className="bg-[#101416]">Phone after consent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white">What should players know?</label>
              <textarea
                className="standard-textarea"
                placeholder="Friendly but serious. Need 2 bowlers and 1 keeper. Match fee split equally."
                value={roomForm.description}
                onChange={(event) =>
                  setRoomForm((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>

            <button type="submit" className="cta-primary" disabled={creatingRoom}>
              <Users className="mr-2 h-4 w-4" />
              {creatingRoom ? "Creating..." : "Create Room"}
            </button>
          </form>
        </SectionBlock>
      </div>

      <div className="product-grid-2">
        <SectionBlock
          kicker="Nearby Players"
          title="People visible in your current range"
          description="Short cards, direct value. You should immediately know whether someone is relevant for your game."
        >
          <div className="product-grid-3">
            {feed.activePlayers.length === 0 ? (
              <div className="product-card muted-copy text-sm">
                No active players in this radius yet. Increase your range or turn on your own visibility first.
              </div>
            ) : (
              feed.activePlayers.map((entry) => (
                <article key={entry.id} className="product-card">
                  <span className="pill-gold">{entry.skillLevel || "Open level"}</span>
                  <h3 className="mt-4 text-xl font-cabinet-bold">{entry.user?.fullname || "Player"}</h3>
                  <p className="muted-copy mt-2 text-sm">{formatDistance(entry.distanceKm)}</p>
                  <p className="muted-copy mt-2 text-sm">
                    Roles: {entry.preferredRoles?.join(", ") || "Flexible"}
                  </p>
                  {entry.notes ? <p className="muted-copy mt-4 text-sm leading-6">{entry.notes}</p> : null}
                </article>
              ))
            )}
          </div>
        </SectionBlock>

        <SectionBlock
          kicker="Open Rooms"
          title="Rooms close enough to matter"
          description="Join requests stay clean and consent-based, so the platform feels useful instead of noisy."
        >
          <div className="product-grid-3">
            {feed.rooms.length === 0 ? (
              <div className="product-card muted-copy text-sm">
                No open rooms nearby yet. Create the first one and seed your local cluster.
              </div>
            ) : (
              feed.rooms.map((room) => (
                <article key={room.id} className="product-card">
                  <span className="pill-accent">{room.currentPlayers}/{room.requiredPlayers} players</span>
                  <h3 className="mt-4 text-xl font-cabinet-bold">{room.title}</h3>
                  <p className="muted-copy mt-2 text-sm">{formatDistance(room.distanceKm)}</p>
                  <p className="muted-copy mt-2 text-sm">
                    {room.skillLevel || "Open"} • {room.teamMode?.replaceAll("_", " ") || "Single Group"}
                  </p>
                  {room.description ? (
                    <p className="muted-copy mt-4 text-sm leading-6">{room.description}</p>
                  ) : null}
                  <button
                    type="button"
                    className="cta-secondary mt-5"
                    onClick={() => joinRoom(room.id)}
                  >
                    Request to Join
                  </button>
                </article>
              ))
            )}
          </div>
        </SectionBlock>
      </div>
    </ProductShell>
  );
}
