import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../shared/db/prisma";
import { asyncHandler } from "../shared/http/asyncHandler";
import { NotFoundError } from "../shared/errors/AppError";
import { UpsertPlayerProfileInput } from "../modules/profiles/profile.schemas";

export const upsertPlayerProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const data = req.body as UpsertPlayerProfileInput;

    const stats = data.stats as Prisma.InputJsonValue | undefined;

    const profile = await prisma.playerProfile.upsert({
        where: { userId },
        update: { ...data, stats },
        create: { userId, ...data, stats },
    });

    res.status(200).json({ success: true, message: "Player profile saved successfully", profile });
});

export const getPlayerProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await prisma.playerProfile.findUnique({
        where: { userId: req.params.userId },
        include: { teams: true },
    });
    if (!profile) throw new NotFoundError("Player profile not found");
    res.status(200).json({ success: true, message: "Player profile fetched successfully", profile });
});

export const deletePlayerProfile = asyncHandler(async (req: Request, res: Response) => {
    await prisma.playerProfile.delete({ where: { userId: req.params.userId } });
    res.status(200).json({ success: true, message: "Player profile deleted successfully" });
});

export const getPlayerTeams = asyncHandler(async (req: Request, res: Response) => {
    const profile = await prisma.playerProfile.findUnique({
        where: { userId: req.params.userId },
        include: { teams: true },
    });
    if (!profile) throw new NotFoundError("Player profile not found");
    res.status(200).json({
        success: true,
        message: "Player teams fetched successfully",
        teams: profile.teams,
    });
});
