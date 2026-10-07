import { z } from "zod";

export const createGroundSchema = z.object({
    name: z.string().trim().min(2).max(120),
    location: z.string().trim().min(2).max(200),
    rating: z.number().min(0).max(5).optional(),
    bookings: z.number().int().min(0).optional(),
    pitchType: z.string().trim().min(1).max(60),
    facilities: z.unknown().optional(),
    pricePerMatch: z.number().positive(),
});

export const updateGroundSchema = createGroundSchema.partial();

export const groundIdParamSchema = z.object({
    id: z.string().uuid(),
});

export type CreateGroundInput = z.infer<typeof createGroundSchema>;
export type UpdateGroundInput = z.infer<typeof updateGroundSchema>;
