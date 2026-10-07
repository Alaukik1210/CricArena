import { z } from "zod";

export const createBookingSessionSchema = z.object({
    groundId: z.string().uuid(),
    slotId: z.string().uuid().optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
    amount: z.coerce.number().positive().optional(),
    currency: z.string().trim().length(3).optional(),
});

export type CreateBookingSessionInput = z.infer<typeof createBookingSessionSchema>;
