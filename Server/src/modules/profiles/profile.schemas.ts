import { z } from "zod";

export const userIdParamSchema = z.object({
    userId: z.string().uuid(),
});

export const upsertOwnerProfileSchema = z.object({
    bio: z.string().trim().max(2000).optional(),
    profilePhoto: z.string().trim().url().optional(),
    ownerId: z.string().uuid().optional(),
});

export const upsertPlayerProfileSchema = z.object({
    bio: z.string().trim().max(2000).optional(),
    skills: z.string().trim().min(1).max(500),
    battingStyle: z.string().trim().min(1).max(60),
    bowlingStyle: z.string().trim().min(1).max(60),
    profilePhoto: z.string().trim().url().optional(),
    achievements: z.array(z.string().trim().min(1)).optional(),
    stats: z.unknown().optional(),
});

export type UpsertOwnerProfileInput = z.infer<typeof upsertOwnerProfileSchema>;
export type UpsertPlayerProfileInput = z.infer<typeof upsertPlayerProfileSchema>;
