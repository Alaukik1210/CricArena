import { PlayRoomStatus } from "@prisma/client";
import { prisma } from "../../shared/db/prisma";

type RevenueInput = {
    bookingRecords: { amount: number }[];
    structuredBookings: { payments: { amount: number; status: string }[] }[];
};

/**
 * Single source of truth for ground revenue.
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
    const legacyRevenue = ground.bookingRecords.reduce((sum, b) => sum + b.amount, 0);

    const structuredRevenue = ground.structuredBookings.reduce(
        (sum, booking) =>
            sum +
            booking.payments
                .filter((p) => p.status === "SUCCEEDED")
                .reduce((pSum, p) => pSum + p.amount, 0),
        0,
    );

    return {
        bookings: ground.bookingRecords.length + ground.structuredBookings.length,
        revenue: legacyRevenue + structuredRevenue,
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
