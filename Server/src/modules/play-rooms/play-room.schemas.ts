import { z } from "zod";
import { ContactMode, PlayRoomStatus, PlayRoomTeamMode, SportType } from "@prisma/client";

export const listPlayRoomsQuerySchema = z.object({
    status: z.nativeEnum(PlayRoomStatus).optional(),
    sport: z.nativeEnum(SportType).optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
});

export const createPlayRoomSchema = z.object({
    title: z.string().trim().min(2).max(120),
    description: z.string().trim().max(2000).optional(),
    skillLevel: z.string().trim().optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    matchDate: z.string().datetime().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    radiusKm: z.coerce.number().positive().optional(),
    requiredPlayers: z.coerce.number().int().positive().optional(),
    teamMode: z.nativeEnum(PlayRoomTeamMode).optional(),
    sport: z.nativeEnum(SportType).optional(),
    contactMode: z.nativeEnum(ContactMode).optional(),
});

export const playRoomIdParamSchema = z.object({
    id: z.string().uuid(),
});

export const playRoomMemberParamSchema = z.object({
    id: z.string().uuid(),
    memberId: z.string().uuid(),
});

export const joinRequestSchema = z.object({
    message: z.string().trim().max(500).optional(),
    rolePreference: z.string().trim().max(60).optional(),
});

export type ListPlayRoomsQuery = z.infer<typeof listPlayRoomsQuerySchema>;
export type CreatePlayRoomInput = z.infer<typeof createPlayRoomSchema>;
export type JoinRequestInput = z.infer<typeof joinRequestSchema>;
