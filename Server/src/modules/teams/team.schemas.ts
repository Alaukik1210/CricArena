import { z } from "zod";

export const createTeamSchema = z.object({
    name: z.string().trim().min(2).max(80),
    description: z.string().trim().min(2).max(500),
    memberIds: z.array(z.string().uuid()).optional(),
});

export const updateTeamSchema = z.object({
    name: z.string().trim().min(2).max(80).optional(),
    description: z.string().trim().min(2).max(500).optional(),
    memberIds: z.array(z.string().uuid()).optional(),
});

export const teamIdParamSchema = z.object({
    id: z.string().uuid(),
});

export const addPlayerSchema = z.object({
    teamId: z.string().uuid(),
    playerId: z.string().uuid(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type AddPlayerInput = z.infer<typeof addPlayerSchema>;
