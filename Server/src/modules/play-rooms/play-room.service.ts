import {
    ContactMode,
    JoinRequestStatus,
    PlayRoomStatus,
    PlayRoomTeamMode,
    SportType,
} from "@prisma/client";
import { prisma } from "../../shared/db/prisma";

type CreatePlayRoomInput = {
    title: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    requiredPlayers?: number;
    skillLevel?: string;
    city?: string;
    state?: string;
    teamMode?: PlayRoomTeamMode;
    sport?: SportType;
    matchDate?: string;
    contactMode?: ContactMode;
};

type JoinRoomInput = {
    message?: string;
    rolePreference?: string;
};

export class PlayRoomService {
    async listRooms(filters: {
        status?: PlayRoomStatus;
        sport?: SportType;
        city?: string;
        state?: string;
    }) {
        return prisma.playRoom.findMany({
            where: {
                status: filters.status,
                sport: filters.sport,
                city: filters.city,
                state: filters.state,
            },
            include: {
                members: true,
                joinRequests: {
                    where: { status: JoinRequestStatus.PENDING },
                    include: {
                        requester: {
                            select: {
                                id: true,
                                fullname: true,
                                city: true,
                                state: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async createRoom(userId: string, input: CreatePlayRoomInput) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { city: true, state: true },
        });

        const room = await prisma.playRoom.create({
            data: {
                createdByUserId: userId,
                title: input.title,
                description: input.description,
                latitude: input.latitude,
                longitude: input.longitude,
                radiusKm: input.radiusKm ?? 10,
                requiredPlayers: input.requiredPlayers ?? 10,
                currentPlayers: 1,
                skillLevel: input.skillLevel,
                city: input.city ?? user?.city,
                state: input.state ?? user?.state,
                teamMode: input.teamMode ?? PlayRoomTeamMode.SINGLE_GROUP,
                sport: input.sport ?? SportType.CRICKET,
                matchDate: input.matchDate ? new Date(input.matchDate) : undefined,
                contactMode: input.contactMode ?? ContactMode.IN_APP,
                members: {
                    create: {
                        userId,
                        status: JoinRequestStatus.APPROVED,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        await prisma.analyticsEvent.create({
            data: {
                actorUserId: userId,
                name: "play_room.created",
                category: "play-room",
                context: {
                    roomId: room.id,
                    requiredPlayers: room.requiredPlayers,
                    city: room.city,
                },
            },
        });

        return room;
    }

    async requestToJoin(roomId: string, requesterUserId: string, input: JoinRoomInput) {
        const room = await prisma.playRoom.findUnique({
            where: { id: roomId },
        });

        if (!room) {
            throw new Error("Play room not found");
        }

        if (room.status !== PlayRoomStatus.OPEN) {
            throw new Error("This room is not open for new join requests");
        }

        if (room.currentPlayers >= room.requiredPlayers) {
            throw new Error("This room is already full");
        }

        if (room.createdByUserId === requesterUserId) {
            throw new Error("Room creator is already a member");
        }

        const existingMember = await prisma.playRoomMember.findUnique({
            where: {
                roomId_userId: {
                    roomId,
                    userId: requesterUserId,
                },
            },
        });

        if (existingMember) {
            throw new Error("You already have a membership record for this room");
        }

        const [member, request] = await prisma.$transaction([
            prisma.playRoomMember.create({
                data: {
                    roomId,
                    userId: requesterUserId,
                    rolePreference: input.rolePreference,
                    status: JoinRequestStatus.PENDING,
                },
            }),
            prisma.playRoomJoinRequest.create({
                data: {
                    roomId,
                    requesterUserId,
                    message: input.message,
                },
            }),
        ]);

        await prisma.analyticsEvent.create({
            data: {
                actorUserId: requesterUserId,
                name: "play_room.join_requested",
                category: "play-room",
                context: {
                    roomId,
                    requestId: request.id,
                },
            },
        });

        return { member, request };
    }

    async approveMember(roomId: string, memberId: string, actorUserId: string) {
        const room = await prisma.playRoom.findUnique({
            where: { id: roomId },
        });

        if (!room) {
            throw new Error("Play room not found");
        }

        if (room.createdByUserId !== actorUserId) {
            throw new Error("Only the room creator can approve members");
        }

        const member = await prisma.playRoomMember.findUnique({
            where: { id: memberId },
        });

        if (!member || member.roomId !== roomId) {
            throw new Error("Member not found for this room");
        }

        const approvedMember = await prisma.playRoomMember.update({
            where: { id: memberId },
            data: { status: JoinRequestStatus.APPROVED },
        });

        await prisma.playRoomJoinRequest.updateMany({
            where: {
                roomId,
                requesterUserId: approvedMember.userId,
                status: JoinRequestStatus.PENDING,
            },
            data: { status: JoinRequestStatus.APPROVED },
        });

        const approvedCount = await prisma.playRoomMember.count({
            where: {
                roomId,
                status: JoinRequestStatus.APPROVED,
            },
        });

        const roomStatus =
            approvedCount >= room.requiredPlayers ? PlayRoomStatus.FULL : PlayRoomStatus.OPEN;

        await prisma.playRoom.update({
            where: { id: roomId },
            data: {
                currentPlayers: approvedCount,
                status: roomStatus,
            },
        });

        await prisma.analyticsEvent.create({
            data: {
                actorUserId,
                name: "play_room.member_approved",
                category: "play-room",
                context: {
                    roomId,
                    memberId,
                    approvedCount,
                },
            },
        });

        return approvedMember;
    }
}

export const playRoomService = new PlayRoomService();
