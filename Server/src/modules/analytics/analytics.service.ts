import { PlayRoomStatus } from "@prisma/client";
import { prisma } from "../../shared/db/prisma";

type RevenueInput = {
    bookingRecords: { amount: number; paymentIntentId: string }[];
    structuredBookings: {
        payments: { amount: number; status: string; paymentIntentId: string | null }[];
    }[];
};

/**
 * Single source of truth for ground revenue.
 *
 * UNITS. `GroundBooking.amount` and `PaymentRecord.amount` both hold INTEGER
 * PAISE - both are written straight from Stripe's `paymentIntent.amount`, and
 * the client creates that intent as `pricePerMatch * 100`. This function is
 * the one and only place that conversion happens: it takes paise and returns
 * RUPEES. Callers must not scale the result again. The result is exact rather
 * than rounded-to-look-exact: both columns are Prisma `Int`, so the total is
 * an integer, and `integer / 100` is always representable in its shortest
 * decimal form - `3 / 100` is `0.03`, never `0.030000000000000002`. The
 * `Math.round` below is a guard for a non-integer amount reaching this code,
 * not what makes the arithmetic safe.
 *
 * DE-DUPLICATION. `POST /payment/confirm-booking` writes, for a single Stripe
 * payment and inside one transaction, both a legacy `GroundBooking` and a
 * structured `Booking` + `PaymentRecord`. Summing both tables therefore read
 * one booking as two, at twice the money. `GroundBooking.paymentIntentId` and
 * `PaymentRecord.paymentIntentId` are both unique, so a legacy row whose
 * payment intent also appears on a `PaymentRecord` reachable through
 * `structuredBookings` is provably that same payment written twice: it is
 * dropped from both the sum and the count, and the structured pair is kept.
 * A legacy row with no structured twin is a genuine historical booking and
 * still counts.
 *
 * Previously revenue summed only `bookingRecords` (legacy GroundBooking)
 * while the booking *count* included structured bookings - so every
 * structured Booking contributed zero revenue. See docs/PLAN.md section 3 gap #13.
 *
 * This also stops counting the denormalized `Ground.bookings` column. That
 * column is only ever written at ground creation from `data.bookings ?? 0`
 * and is never incremented when a booking is made, so adding it to the count
 * mixed an owner-supplied arbitrary number into a real total. Counts are now
 * derived purely from booking rows.
 */
export function computeGroundRevenue(ground: RevenueInput): { bookings: number; revenue: number } {
    // Every payment intent that the structured side already accounts for.
    // A null `paymentIntentId` identifies nothing, so it is not collected -
    // a legacy row can never be shown to be its twin, and is kept.
    const structuredPaymentIntentIds = new Set<string>();
    for (const booking of ground.structuredBookings) {
        for (const payment of booking.payments) {
            if (payment.paymentIntentId !== null) {
                structuredPaymentIntentIds.add(payment.paymentIntentId);
            }
        }
    }

    // The duplicate is structural - the two rows exist because one payment was
    // written twice - so it is dropped regardless of the payment's status.
    //
    // That is unconditionally right for the COUNT. For REVENUE it is right
    // because of an invariant, not a theorem: a legacy row can only exist if
    // `confirm-booking` ran, and that handler returns early unless the intent
    // is `succeeded`, then writes the twin PaymentRecord as SUCCEEDED at the
    // same amount in the same transaction. So dropping the legacy row always
    // trades it for an identical structured one.
    //
    // If a future refund or reconciliation path ever writes a non-SUCCEEDED
    // status onto a PaymentRecord that still has a legacy twin, that invariant
    // breaks and real money silently disappears from the dashboard. Change
    // this to fall back to the legacy amount before you add such a path.
    const unduplicatedLegacy = ground.bookingRecords.filter(
        (b) => !structuredPaymentIntentIds.has(b.paymentIntentId),
    );

    const legacyPaise = unduplicatedLegacy.reduce((sum, b) => sum + b.amount, 0);

    const structuredPaise = ground.structuredBookings.reduce(
        (sum, booking) =>
            sum +
            booking.payments
                .filter((p) => p.status === "SUCCEEDED")
                .reduce((pSum, p) => pSum + p.amount, 0),
        0,
    );

    return {
        bookings: unduplicatedLegacy.length + ground.structuredBookings.length,
        revenue: Math.round(legacyPaise + structuredPaise) / 100,
    };
}

export class AnalyticsService {
    async getOwnerAnalytics(userId: string) {
        const owner = await prisma.ownerProfile.findUnique({
            where: { userId },
            include: {
                grounds: {
                    include: {
                        bookingRecords: true,
                        structuredBookings: { include: { payments: true } },
                    },
                },
            },
        });

        if (!owner) {
            throw new Error("Owner profile not found");
        }

        const grounds = owner.grounds.map((ground) => {
            const { bookings, revenue } = computeGroundRevenue(ground);
            return {
                id: ground.id,
                name: ground.name,
                bookings,
                revenue,
                occupancyLabel: `${ground.structuredBookings.length} structured bookings`,
            };
        });

        return {
            totalGrounds: grounds.length,
            totalBookings: grounds.reduce((sum, ground) => sum + ground.bookings, 0),
            totalRevenue: grounds.reduce((sum, ground) => sum + ground.revenue, 0),
            grounds,
        };
    }

    async getOrganizerAnalytics(userId: string) {
        const tournaments = await prisma.tournamentDetails.findMany({
            where: {
                createdByUserId: userId,
            },
            include: {
                teams: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const totalRegistrations = tournaments.reduce((sum, tournament) => sum + tournament.teams.length, 0);
        const projectedRevenue = tournaments.reduce(
            (sum, tournament) => sum + (tournament.entryFeeAmount ?? 0) * tournament.teams.length,
            0,
        );

        return {
            totalTournaments: tournaments.length,
            totalRegistrations,
            projectedRevenue,
            tournaments: tournaments.map((tournament) => ({
                id: tournament.id,
                title: tournament.title,
                status: tournament.status,
                registrations: tournament.teams.length,
                projectedRevenue: (tournament.entryFeeAmount ?? 0) * tournament.teams.length,
            })),
        };
    }

    async getAdminAnalytics() {
        const [users, playRooms, grounds, tournaments, bookingSessions, analyticsEvents] =
            await Promise.all([
                prisma.user.count(),
                prisma.playRoom.count(),
                prisma.ground.count(),
                prisma.tournamentDetails.count(),
                prisma.bookingSession.count(),
                prisma.analyticsEvent.count(),
            ]);

        const activeRooms = await prisma.playRoom.count({
            where: {
                status: PlayRoomStatus.OPEN,
            },
        });

        return {
            totalUsers: users,
            totalPlayRooms: playRooms,
            activePlayRooms: activeRooms,
            totalGrounds: grounds,
            totalTournaments: tournaments,
            totalBookingSessions: bookingSessions,
            trackedEvents: analyticsEvents,
        };
    }
}

export const analyticsService = new AnalyticsService();
