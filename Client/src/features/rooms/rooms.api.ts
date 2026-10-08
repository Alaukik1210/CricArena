import { api } from "@/lib/api";

export interface RoomMember {
    id: string;
    userId: string;
    status: string;
}

export interface RoomJoinRequest {
    id: string;
    requesterUserId: string;
    message: string | null;
    status: string;
    requester?: { fullname: string; city?: string; state?: string };
}

export interface MyRoom {
    id: string;
    createdByUserId: string;
    title: string;
    status: string;
    city: string | null;
    skillLevel: string | null;
    currentPlayers: number;
    requiredPlayers: number;
    members?: RoomMember[];
    joinRequests?: RoomJoinRequest[];
}

export async function fetchRooms(): Promise<MyRoom[]> {
    // Envelope is { success, rooms } - rooms is a top-level key.
    const { data } = await api.get<{ rooms?: MyRoom[] }>("/play-rooms");
    return data.rooms ?? [];
}

export async function approveMember(roomId: string, memberId: string): Promise<void> {
    await api.post(`/play-rooms/${roomId}/members/${memberId}/approve`);
}
