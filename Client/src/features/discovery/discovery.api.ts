import { api } from "@/lib/api";
import type {
    AvailabilityPayload,
    CreateRoomPayload,
    DiscoveryFeed,
    DiscoveryFilters,
} from "./discovery.types";

export async function fetchDiscoveryFeed(filters: DiscoveryFilters): Promise<DiscoveryFeed> {
    // The server spreads the feed into the envelope:
    //   res.json({ success: true, ...feed })
    // so `rooms` / `activePlayers` sit at the top level, NOT under `data`.
    const { data } = await api.get<{ success: boolean } & DiscoveryFeed>("/discovery/feed", {
        params: filters,
    });
    return { rooms: data.rooms ?? [], activePlayers: data.activePlayers ?? [] };
}

/** Requires auth. Same endpoint the legacy screen used. */
export async function saveAvailability(payload: AvailabilityPayload): Promise<void> {
    await api.post("/availability", payload);
}

/** Requires auth. */
export async function createPlayRoom(payload: CreateRoomPayload): Promise<void> {
    await api.post("/play-rooms", payload);
}

/** Requires auth. */
export async function requestToJoin(roomId: string, message: string): Promise<void> {
    await api.post(`/play-rooms/${roomId}/join-requests`, { message });
}
