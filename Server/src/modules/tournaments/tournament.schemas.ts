import { z } from "zod";
import { Type } from "@prisma/client";

const isoDate = z.union([z.string().datetime(), z.string().regex(/^\d{4}-\d{2}-\d{2}/)]);

export const createTournamentSchema = z.object({
    title: z.string().trim().min(2).max(120),
    description: z.string().trim().min(2).max(2000),
    tourStartsDate: isoDate,
    tourEndDate: isoDate,
    venue: z.string().trim().min(2).max(200),
    entryFee: z.coerce.number().nonnegative(),
    spots: z.coerce.number().int().positive(),
    type: z.nativeEnum(Type),
    lastRegistrationDate: isoDate,
});

export const tournamentIdParamSchema = z.object({
    id: z.string().uuid(),
});

export const registerForTourSchema = z.object({
    tournamentId: z.string().uuid(),
    teamId: z.string().uuid(),
});

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type RegisterForTourInput = z.infer<typeof registerForTourSchema>;
