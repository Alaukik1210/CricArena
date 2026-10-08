import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LocateFixed, Radar } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageShell, Section, Stat } from "@/components/ui/page-shell";
import { ApiError } from "@/lib/api";
import { useAppSelector } from "@/redux/store";
import { AvailabilityForm } from "./AvailabilityForm";
import { CreateRoomForm } from "./CreateRoomForm";
import { RoomTable } from "./RoomTable";
import { createPlayRoom, fetchDiscoveryFeed, requestToJoin, saveAvailability } from "./discovery.api";
import type {
    AvailabilityValues,
    Coords,
    DiscoveryFilters,
    RoomFormValues,
} from "./discovery.types";

const formatDistance = (distanceKm?: number | null) =>
    typeof distanceKm === "number" ? `${distanceKm.toFixed(1)} km away` : "Within your city";

const FEED_ERROR = "Could not load discovery feed right now.";

export default function DiscoverPage() {
    const user = useAppSelector((store) => store.user.user);
    const [coords, setCoords] = useState<Coords | null>(null);
    const [radiusKm, setRadiusKm] = useState("10");
    const [geoLoading, setGeoLoading] = useState(false);
    const [status, setStatus] = useState("");

    const detectLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setStatus("Location is not supported on this device.");
            return;
        }

        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
                setStatus("Using your current location for discovery.");
                setGeoLoading(false);
            },
            () => {
                setStatus("Could not read your location. You can still browse rooms, but distance matching will be weaker.");
                setGeoLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    }, []);

    useEffect(() => {
        detectLocation();
    }, [detectLocation]);

    const filters = useMemo<DiscoveryFilters>(() => {
        const useGeoFilters = Boolean(coords?.latitude && coords?.longitude);
        return {
            ...(coords ?? {}),
            radiusKm: radiusKm === "" ? undefined : Number(radiusKm),
            sport: "CRICKET",
            city: useGeoFilters ? undefined : user?.city,
            state: useGeoFilters ? undefined : user?.state,
        };
    }, [coords, radiusKm, user?.city, user?.state]);

    const feedQuery = useQuery({
        queryKey: ["discovery-feed", filters],
        queryFn: () => fetchDiscoveryFeed(filters),
    });
    const { refetch: refetchFeed } = feedQuery;

    const rooms = feedQuery.data?.rooms ?? [];
    const players = useMemo(
        () => (feedQuery.data?.activePlayers ?? []).filter((entry) => entry.user?.id !== user?.id),
        [feedQuery.data, user?.id],
    );

    const availabilityMutation = useMutation({ mutationFn: saveAvailability });
    const createRoomMutation = useMutation({ mutationFn: createPlayRoom });
    const joinMutation = useMutation({
        mutationFn: (roomId: string) => requestToJoin(roomId, "Interested in joining this game."),
    });

    const submitAvailability = async (values: AvailabilityValues) => {
        if (!user?.id) {
            setStatus("Please login first to become visible to players nearby.");
            return;
        }

        try {
            await availabilityMutation.mutateAsync({
                sport: "CRICKET",
                isActive: true,
                availabilityType: "CASUAL",
                skillLevel: values.skillLevel,
                preferredRoles: values.preferredRoles,
                radiusKm: Number(radiusKm),
                latitude: coords?.latitude,
                longitude: coords?.longitude,
                notes: values.notes,
            });
            setStatus("You are now visible to players and rooms in your selected range.");
            await refetchFeed();
        } catch (error) {
            console.error("Failed to save availability:", error);
            setStatus("Could not save your availability.");
        }
    };

    const submitRoom = async (values: RoomFormValues): Promise<boolean> => {
        if (!user?.id) {
            setStatus("Please login first to create a room.");
            return false;
        }

        try {
            await createRoomMutation.mutateAsync({
                ...values,
                sport: "CRICKET",
                latitude: coords?.latitude,
                longitude: coords?.longitude,
                radiusKm: Number(radiusKm),
                requiredPlayers: Number(values.requiredPlayers),
                city: user.city,
                state: user.state,
            });
        } catch (error) {
            console.error("Failed to create room:", error);
            setStatus("Could not create the room.");
            return false;
        }

        setStatus("Room created successfully. Nearby players can now discover it.");
        await refetchFeed();
        return true;
    };

    const joinRoom = async (roomId: string) => {
        if (!user?.id) {
            setStatus("Please login first to join a room.");
            return;
        }

        try {
            await joinMutation.mutateAsync(roomId);
            setStatus("Join request sent. You will be visible to the room creator for approval.");
            await refetchFeed();
        } catch (error) {
            console.error("Failed to join room:", error);
            // The api client folds the server message into ApiError; status 0 means no response.
            setStatus(
                error instanceof ApiError && error.status > 0
                    ? error.message
                    : "Could not send the join request for this room.",
            );
        }
    };

    const banner = status || (feedQuery.isError ? FEED_ERROR : "");

    return (
        <PageShell
            kicker="Discovery"
            title="Find people who can actually play near you."
            description="Turn on visibility, set your radius, and instantly see active players and open rooms around you. Less coordination, faster games."
            actions={
                <>
                    <Button type="button" onClick={detectLocation} disabled={geoLoading}>
                        <LocateFixed />
                        {geoLoading ? "Detecting..." : "Use My Location"}
                    </Button>
                    <Button asChild variant="outline">
                        <Link to="/rooms">
                            <Radar />
                            Manage Rooms
                        </Link>
                    </Button>
                </>
            }
        >
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
                <Stat label="Nearby Players" value={players.length} detail="Active in your current radius" />
                <Stat label="Open Rooms" value={rooms.length} detail="Ready for quick joins and approvals" />
                <Stat label="Your Radius" value={`${radiusKm} km`} detail="Editable anytime from this screen" />
                <Stat label="Best Use" value="Play Faster" detail="Less chat chaos, more actual cricket" />
            </section>

            {banner ? (
                <div className="rounded border border-rule bg-surface px-5 py-4 text-sm text-pending md:px-6">
                    {banner}
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
                <Section
                    kicker="Visibility"
                    title="Become visible in your range"
                    description="This is the control surface for player visibility. Keep it quick, clear, and easy to edit from mobile."
                >
                    <AvailabilityForm
                        radiusKm={radiusKm}
                        onRadiusChange={setRadiusKm}
                        saving={availabilityMutation.isPending}
                        refreshing={feedQuery.isFetching}
                        onSubmit={submitAvailability}
                        onRefresh={() => void refetchFeed()}
                    />
                </Section>

                <Section
                    kicker="Room Creation"
                    title="Open a room in one minute"
                    description="Create a room nearby and let players in your range discover it fast."
                >
                    <CreateRoomForm creating={createRoomMutation.isPending} onSubmit={submitRoom} />
                </Section>
            </div>

            <Section
                kicker="Nearby Players"
                title="People visible in your current range"
                description="Short cards, direct value. You should immediately know whether someone is relevant for your game."
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
                    {players.length === 0 ? (
                        <div className="rounded border border-rule bg-surface p-5 text-sm text-ink-soft">
                            No active players in this radius yet. Increase your range or turn on your own visibility first.
                        </div>
                    ) : (
                        players.map((entry) => (
                            <article key={entry.id} className="rounded border border-rule bg-surface p-5">
                                <Badge tone="pending">{entry.skillLevel || "Open level"}</Badge>
                                <h3 className="mt-4 text-xl font-body font-bold">{entry.user?.fullname || "Player"}</h3>
                                <p className="mt-2 text-sm text-ink-soft">{formatDistance(entry.distanceKm)}</p>
                                <p className="mt-2 text-sm text-ink-soft">
                                    Roles: {entry.preferredRoles?.join(", ") || "Flexible"}
                                </p>
                                {entry.notes ? <p className="mt-4 text-sm leading-6 text-ink-soft">{entry.notes}</p> : null}
                            </article>
                        ))
                    )}
                </div>
            </Section>

            <Section
                kicker="Open Rooms"
                title="Rooms close enough to matter"
                description="Join requests stay clean and consent-based, so the platform feels useful instead of noisy."
            >
                <RoomTable rooms={rooms} loading={feedQuery.isLoading} onJoin={joinRoom} />
            </Section>
        </PageShell>
    );
}
