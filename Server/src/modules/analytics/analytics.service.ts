import { PlayRoomStatus } from "@prisma/client";
import { prisma } from "../../shared/db/prisma";

export class AnalyticsService {
    async getOwnerAnalytics(userId: string) {
        const owner = await prisma.ownerProfile.findUnique({
            where: { userId },
            include: {
                grounds: {
                    include: {
                        bookingRecords: true,
                        structuredBookings: true,
                    },
                },
            },
        });

        if (!owner) {
            throw new Error("Owner profile not found");
        }

        const grounds = owner.grounds.map((ground) => {
            const legacyRevenue = ground.bookingRecords.reduce((sum, booking) => sum + booking.amount, 0);
            const structuredBookingCount = ground.structuredBookings.length;

            return {
                id: ground.id,
                name: ground.name,
                bookings: ground.bookings + structuredBookingCount,
                revenue: legacyRevenue,
                occupancyLabel: `${structuredBookingCount} structured bookings`,
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
