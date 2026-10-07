import { z } from "zod";
import { AvailabilityType, SportType } from "@prisma/client";

const csvOrArray = z.union([
    z.array(z.string().trim().min(1)),
    z
        .string()
        .transform((s) =>
            s
                .split(",")
                .map((entry) => entry.trim())
                .filter(Boolean),
        ),
]);

export const discoveryFeedQuerySchema = z.object({
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    radiusKm: z.coerce.number().positive().optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    sport: z.nativeEnum(SportType).optional(),
});

export const upsertAvailabilitySchema = z.object({
    availabilityType: z.nativeEnum(AvailabilityType).optional(),
    skillLevel: z.string().trim().optional(),
    preferredRoles: csvOrArray.optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    radiusKm: z.coerce.number().positive().optional(),
    availableFrom: z.string().datetime().optional(),
    availableUntil: z.string().datetime().optional(),
    notes: z.string().trim().max(500).optional(),
    visibility: z.string().trim().optional(),
    sport: z.nativeEnum(SportType).optional(),
    isActive: z.boolean().optional(),
});

export type DiscoveryFeedQuery = z.infer<typeof discoveryFeedQuerySchema>;
export type UpsertAvailabilityInput = z.infer<typeof upsertAvailabilitySchema>;
