import { Request, Response } from "express";
import { prisma } from "../shared/db/prisma";
import { asyncHandler } from "../shared/http/asyncHandler";
import { NotFoundError } from "../shared/errors/AppError";
import { AddPlayerInput, CreateTeamInput, UpdateTeamInput } from "../modules/teams/team.schemas";

const linkPlayerProfilesToTeam = async (memberIds: string[], teamId: string) => {
    await Promise.all(
        memberIds.map(async (userId) => {
            const profile = await prisma.playerProfile.findUnique({ where: { userId } });
            if (!profile) {
                console.warn(`PlayerProfile not found for userId: ${userId}`);
                return;
            }
            await prisma.playerProfile.update({
                where: { userId },
                data: { teams: { connect: { id: teamId } } },
            });
        }),
    );
};

export const createTeam = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, memberIds } = req.body as CreateTeamInput;

    const team = await prisma.team.create({
        data: {
            name,
            description,
            members: memberIds?.length ? { connect: memberIds.map((id) => ({ id })) } : undefined,
        },
    });

    if (memberIds?.length) {
        await linkPlayerProfilesToTeam(memberIds, team.id);
    }

    res.status(201).json({ success: true, message: "Team created successfully", team });
});

export const getAllTeams = asyncHandler(async (_req: Request, res: Response) => {
    const teams = await prisma.team.findMany({ include: { members: true } });
    res.status(200).json({ success: true, message: "Teams fetched successfully", teams });
});

export const getTeamById = asyncHandler(async (req: Request, res: Response) => {
    const team = await prisma.team.findUnique({
        where: { id: req.params.id },
        include: { members: true },
    });
    if (!team) throw new NotFoundError("Team not found");
    res.status(200).json({ success: true, message: "Team fetched successfully", team });
});

export const updateTeam = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, memberIds } = req.body as UpdateTeamInput;

    const team = await prisma.team.update({
        where: { id },
        data: {
            name,
            description,
            members: memberIds ? { set: memberIds.map((mid) => ({ id: mid })) } : undefined,
        },
    });

    if (memberIds?.length) {
        await linkPlayerProfilesToTeam(memberIds, team.id);
    }

    res.status(200).json({ success: true, message: "Team updated successfully", team });
});

export const deleteTeam = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const playerProfiles = await prisma.playerProfile.findMany({
        where: { teams: { some: { id } } },
    });

    await Promise.all(
        playerProfiles.map((profile) =>
            prisma.playerProfile.update({
                where: { id: profile.id },
                data: { teams: { disconnect: { id } } },
            }),
        ),
    );

    await prisma.team.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Team deleted successfully" });
});

export const getTeamMembers = asyncHandler(async (req: Request, res: Response) => {
    const team = await prisma.team.findUnique({
        where: { id: req.params.id },
        include: { members: true },
    });
    if (!team) throw new NotFoundError("Team not found");

    res.status(200).json({
        success: true,
        message: "Team members fetched successfully",
        members: team.members,
    });
});

export const addPlayerToTeam = asyncHandler(async (req: Request, res: Response) => {
    const { teamId, playerId } = req.body as AddPlayerInput;

    const [team, player] = await Promise.all([
        prisma.team.findUnique({ where: { id: teamId } }),
        prisma.user.findUnique({ where: { id: playerId } }),
    ]);
    if (!team) throw new NotFoundError("Team not found");
    if (!player) throw new NotFoundError("Player not found");

    await prisma.team.update({
        where: { id: teamId },
        data: { members: { connect: { id: playerId } } },
    });
    await prisma.playerProfile.update({
        where: { userId: playerId },
        data: { teams: { connect: { id: teamId } } },
    });

    res.status(200).json({ success: true, message: "Player added to the team successfully" });
});
