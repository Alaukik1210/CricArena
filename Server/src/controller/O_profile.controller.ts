import { Request, Response } from "express";
import { prisma } from "../shared/db/prisma";
import { asyncHandler } from "../shared/http/asyncHandler";
import { NotFoundError } from "../shared/errors/AppError";
import { UpsertOwnerProfileInput } from "../modules/profiles/profile.schemas";

export const upsertOwnerProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { bio, profilePhoto, ownerId } = req.body as UpsertOwnerProfileInput;
    const normalizedOwnerId = ownerId || userId;

    const profile = await prisma.ownerProfile.upsert({
        where: { userId },
        create: { ownerId: normalizedOwnerId, userId, bio, profilePhoto },
        update: { bio, profilePhoto },
    });

    res.status(200).json({ success: true, message: "Owner profile saved successfully", profile });
});

export const getOwnerProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await prisma.ownerProfile.findUnique({
        where: { userId: req.params.userId },
        include: { grounds: true },
    });
    if (!profile) throw new NotFoundError("Owner profile not found");
    res.status(200).json({ success: true, message: "Owner profile fetched successfully", profile });
});

export const deleteOwnerProfile = asyncHandler(async (req: Request, res: Response) => {
    await prisma.ownerProfile.delete({ where: { userId: req.params.userId } });
    res.status(200).json({ success: true, message: "Owner profile deleted successfully" });
});

export const getOwnerGrounds = asyncHandler(async (req: Request, res: Response) => {
    const profile = await prisma.ownerProfile.findUnique({
        where: { userId: req.params.userId },
        include: { grounds: true },
    });
    if (!profile) throw new NotFoundError("Owner profile not found");
    res.status(200).json({
        success: true,
        message: "Owner grounds fetched successfully",
        grounds: profile.grounds,
    });
});
