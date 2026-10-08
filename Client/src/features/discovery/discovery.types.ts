export interface PlayRoomSummary {
    id: string;
    title: string;
    description?: string | null;
    teamMode?: string | null;
    city: string | null;
    /** Absent entirely when the caller sent no coordinates. */
    distanceKm?: number | null;
    currentPlayers: number;
    requiredPlayers: number;
    skillLevel: string | null;
    matchDate: string | null;
}

export interface ActivePlayerSummary {
    id: string;
    userId: string;
    skillLevel: string | null;
    preferredRoles: string[];
    availabilityType: string;
    notes?: string | null;
    /** Absent entirely when the caller sent no coordinates. */
    distanceKm?: number | null;
    user: { id: string; fullname: string; city: string; state: string };
}

/** Mirrors the server envelope: rooms and activePlayers are top-level keys. */
export interface DiscoveryFeed {
    rooms: PlayRoomSummary[];
    activePlayers: ActivePlayerSummary[];
}

/** Mirrors `discoveryFeedQuerySchema` in Server/src/modules/discovery/discovery.schemas.ts. */
export interface DiscoveryFilters {
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    city?: string;
    state?: string;
    sport?: "CRICKET";
}

export interface Coords {
    latitude: number;
    longitude: number;
}

/** Values owned by AvailabilityForm (radius is lifted to the page, it drives the feed). */
export interface AvailabilityValues {
    skillLevel: string;
    preferredRoles: string;
    notes: string;
}

export interface AvailabilityPayload extends AvailabilityValues {
    sport: "CRICKET";
    isActive: boolean;
    availabilityType: "CASUAL";
    radiusKm?: number;
    latitude?: number;
    longitude?: number;
}

/** Values owned by CreateRoomForm. Numbers stay strings until submit. */
export interface RoomFormValues {
    title: string;
    description: string;
    requiredPlayers: string;
    skillLevel: string;
    teamMode: string;
    matchDate: string;
    contactMode: string;
}

export interface CreateRoomPayload extends Omit<RoomFormValues, "requiredPlayers"> {
    sport: "CRICKET";
    requiredPlayers: number;
    radiusKm?: number;
    latitude?: number;
    longitude?: number;
    city?: string;
    state?: string;
}
