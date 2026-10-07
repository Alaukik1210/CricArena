import { AvailabilityType, JoinRequestStatus, PlayRoomStatus, SportType } from "@prisma/client";
import { prisma } from "../../shared/db/prisma";

const toRadians = (value: number) => (value * Math.PI) / 180;

const calculateDistanceKm = (
    originLat: number,
    originLng: number,
    targetLat: number,
    targetLng: number,
) => {
    const earthRadiusKm = 6371;
    const dLat = toRadians(targetLat - originLat);
    const dLng = toRadians(targetLng - originLng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(originLat)) *
            Math.cos(toRadians(targetLat)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
};

type DiscoveryFilters = {
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    city?: string;
    state?: string;
    sport?: SportType;
};

type AvailabilityInput = {
    availabilityType?: AvailabilityType;
    skillLevel?: string;
    preferredRoles?: string[];
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    availableFrom?: string;
    availableUntil?: string;
    notes?: string;
    visibility?: string;
    sport?: SportType;
    isActive?: boolean;
};

export class DiscoveryService {
    async getFeed(filters: DiscoveryFilters) {
        const hasCoordinates =
            filters.latitude !== undefined && filters.longitude !== undefined;

        const rooms = await prisma.playRoom.findMany({
            where: {
                status: PlayRoomStatus.OPEN,
                sport: filters.sport,
                city: hasCoordinates ? undefined : filters.city,
                state: hasCoordinates ? undefined : filters.state,
            },
            include: {
                members: {
                    where: {
                        status: JoinRequestStatus.APPROVED,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const activePlayers = await prisma.playerAvailability.findMany({
            where: {
                isActive: true,
                sport: filters.sport,
                user: !hasCoordinates && (filters.city || filters.state)
                    ? {
                          city: filters.city,
                          state: filters.state,
                      }
                    : undefined,
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullname: true,
                        city: true,
                        state: true,
                    },
                },
            },
        });

        if (!hasCoordinates) {
            return { rooms, activePlayers };
        }

        const maxRadiusKm = filters.radiusKm ?? 10;

        return {
            rooms: rooms
                .map((room) => {
                    const distanceKm =
                        room.latitude !== null &&
                        room.longitude !== null
                            ? calculateDistanceKm(
                                  filters.latitude as number,
                                  filters.longitude as number,
                                  room.latitude,
                                  room.longitude,
                              )
                            : null;

                    return {
                        ...room,
                        distanceKm,
                    };
                })
                .filter((room) => room.distanceKm === null || room.distanceKm <= maxRadiusKm),
            activePlayers: activePlayers
                .map((availability) => {
                    const distanceKm =
                        availability.latitude !== null &&
                        availability.longitude !== null
                            ? calculateDistanceKm(
                                  filters.latitude as number,
                                  filters.longitude as number,
                                  availability.latitude,
                                  availability.longitude,
                              )
                            : null;

                    return {
                        ...availability,
                        distanceKm,
                    };
                })
                .filter(
                    (availability) =>
                        availability.distanceKm === null || availability.distanceKm <= maxRadiusKm,
                ),
        };
    }

    async upsertAvailability(userId: string, input: AvailabilityInput) {
        const existing = await prisma.playerAvailability.findFirst({
            where: { userId },
            orderBy: { updatedAt: "desc" },
        });

        const data = {
            sport: input.sport ?? SportType.CRICKET,
            isActive: input.isActive ?? true,
            availabilityType: input.availabilityType ?? AvailabilityType.CASUAL,
            skillLevel: input.skillLevel,
            preferredRoles: input.preferredRoles ?? [],
            latitude: input.latitude,
            longitude: input.longitude,
            radiusKm: input.radiusKm ?? 10,
            availableFrom: input.availableFrom ? new Date(input.availableFrom) : undefined,
            availableUntil: input.availableUntil ? new Date(input.availableUntil) : undefined,
            notes: input.notes,
            visibility: input.visibility ?? "public",
        };

        const availability = existing
            ? await prisma.playerAvailability.update({
                  where: { id: existing.id },
                  data,
              })
            : await prisma.playerAvailability.create({
                  data: {
                      userId,
                      ...data,
                  },
              });

        await prisma.analyticsEvent.create({
            data: {
                actorUserId: userId,
                name: "availability.upserted",
                category: "discovery",
                context: {
                    availabilityId: availability.id,
                    isActive: availability.isActive,
                    radiusKm: availability.radiusKm,
                },
            },
        });

        return availability;
    }
}

export const discoveryService = new DiscoveryService();
