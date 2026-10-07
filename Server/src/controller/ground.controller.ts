import { Response } from "express";
import { Request } from "express";
import { prisma } from "../shared/db/prisma";
import { authRequest } from "../middleware/auth";
import { asyncHandler } from "../shared/http/asyncHandler";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../shared/errors/AppError";
import { CreateGroundInput, UpdateGroundInput } from "../modules/grounds/ground.schemas";

export const createGround = asyncHandler(async (req: authRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) throw new UnauthorizedError();

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { ownerProfile: true },
    });
    if (!user) throw new UnauthorizedError("Please login first");

    const ownerId = user.ownerProfile?.id;
    if (!ownerId) throw new BadRequestError("Owner profile required before creating a ground");

    const data = req.body as CreateGroundInput;

    const ground = await prisma.ground.create({
        data: {
            name: data.name,
            location: data.location,
            rating: data.rating ?? 0,
            bookings: data.bookings ?? 0,
            pitchType: data.pitchType,
            facilities: data.facilities as any,
            pricePerMatch: data.pricePerMatch,
            owner: { connect: { id: ownerId } },
        },
    });

    res.status(201).json({ success: true, message: "Ground created successfully", ground });
});

export const getAllGrounds = asyncHandler(async (_req: Request, res: Response) => {
    const grounds = await prisma.ground.findMany({ include: { owner: true } });
    res.status(200).json({ success: true, message: "Grounds fetched successfully", grounds });
});

export const getGroundById = asyncHandler(async (req: Request, res: Response) => {
    const ground = await prisma.ground.findUnique({
        where: { id: req.params.id },
        include: { owner: true },
    });
    if (!ground) throw new NotFoundError("Ground not found");

    res.status(200).json({ success: true, message: "Ground details fetched successfully", ground });
});

export const updateGround = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as UpdateGroundInput;
    const ground = await prisma.ground.update({
        where: { id: req.params.id },
        data: {
            ...data,
            facilities: data.facilities as any,
        },
    });
    res.status(200).json({ success: true, message: "Ground updated successfully", ground });
});

export const deleteGround = asyncHandler(async (req: Request, res: Response) => {
    await prisma.ground.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: "Ground deleted successfully" });
});
