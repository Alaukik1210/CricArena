import { BookingSessionStatus } from "@prisma/client";
import { prisma } from "../../shared/db/prisma";

type CreateBookingSessionInput = {
    groundId: string;
    slotId?: string;
    startsAt?: string;
    endsAt?: string;
    amount?: number;
    currency?: string;
};

export class BookingSessionService {
    async listSessionsForUser(userId: string) {
        return prisma.bookingSession.findMany({
            where: { userId },
            include: {
                ground: true,
                slot: true,
                booking: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async createSession(userId: string, input: CreateBookingSessionInput) {
        const ground = await prisma.ground.findUnique({
            where: { id: input.groundId },
        });

        if (!ground) {
            throw new Error("Ground not found");
        }

        const slot = input.slotId
            ? await prisma.groundSlot.findUnique({
                  where: { id: input.slotId },
              })
            : null;

        if (input.slotId && !slot) {
            throw new Error("Ground slot not found");
        }

        const amount = input.amount ?? slot?.price ?? ground.pricePerMatch;
        const currency = input.currency ?? slot?.currency ?? "inr";

        const session = await prisma.bookingSession.create({
            data: {
                userId,
                groundId: ground.id,
                slotId: slot?.id,
                amount,
                currency,
                status: BookingSessionStatus.PAYMENT_PENDING,
                startsAt: input.startsAt ? new Date(input.startsAt) : slot?.startsAt,
                endsAt: input.endsAt ? new Date(input.endsAt) : slot?.endsAt,
            },
            include: {
                ground: true,
                slot: true,
            },
        });

        await prisma.analyticsEvent.create({
            data: {
                actorUserId: userId,
                name: "booking_session.created",
                category: "booking",
                context: {
                    bookingSessionId: session.id,
                    groundId: ground.id,
                    amount,
                },
            },
        });

        return session;
    }
}

export const bookingSessionService = new BookingSessionService();
