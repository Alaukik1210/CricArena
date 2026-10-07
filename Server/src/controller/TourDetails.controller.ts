import { Request, Response } from "express";
import { TournamentLifecycleStatus } from "@prisma/client";
import { prisma } from "../shared/db/prisma";
import { authRequest } from "../middleware/auth";
import { asyncHandler } from "../shared/http/asyncHandler";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../shared/errors/AppError";
import {
    CreateTournamentInput,
    RegisterForTourInput,
} from "../modules/tournaments/tournament.schemas";

const toDate = (value: string) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d;
};

export const TournamentDetails = asyncHandler(async (req: authRequest, res: Response) => {
    const data = req.body as CreateTournamentInput;
    if (!req.userId) throw new UnauthorizedError();

    const tournament = await prisma.tournamentDetails.create({
        data: {
            title: data.title,
            description: data.description,
            tourStartsDate: data.tourStartsDate,
            tourEndDate: data.tourEndDate,
            venue: data.venue,
            entryFee: String(data.entryFee),
            spots: String(data.spots),
            type: data.type,
            lastRegistrationDate: data.lastRegistrationDate,
            startsAt: toDate(data.tourStartsDate),
            endsAt: toDate(data.tourEndDate),
            registrationClosesAt: toDate(data.lastRegistrationDate),
            entryFeeAmount: data.entryFee,
            capacity: data.spots,
            status: TournamentLifecycleStatus.REGISTRATION_OPEN,
            createdByUserId: req.userId,
        },
    });

    res.status(201).json({ success: true, message: "Tournament created successfully", tournament });
});

export const getAllTournaments = asyncHandler(async (_req: Request, res: Response) => {
    const tournaments = await prisma.tournamentDetails.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, message: "Tournaments fetched successfully", tournaments });
});

export const registerForTour = asyncHandler(async (req: Request, res: Response) => {
    const { tournamentId, teamId } = req.body as RegisterForTourInput;

    const [tournament, team, alreadyRegistered] = await Promise.all([
        prisma.tournamentDetails.findUnique({ where: { id: tournamentId } }),
        prisma.team.findUnique({ where: { id: teamId } }),
        prisma.tournamentDetails.findFirst({
            where: { id: tournamentId, teams: { some: { id: teamId } } },
        }),
    ]);

    if (!tournament) throw new NotFoundError("Tournament not found");
    if (!team) throw new NotFoundError("Team not found");
    if (alreadyRegistered) throw new BadRequestError("Team is already registered for this tournament");

    await prisma.tournamentDetails.update({
        where: { id: tournamentId },
        data: { teams: { connect: { id: teamId } } },
    });

    res.status(200).json({ success: true, message: "Team successfully registered for the tournament" });
});

export const getTournamentById = asyncHandler(async (req: Request, res: Response) => {
    const tournament = await prisma.tournamentDetails.findUnique({
        where: { id: req.params.id },
        include: { teams: true },
    });
    if (!tournament) throw new NotFoundError("Tournament not found");

    res.status(200).json({ success: true, message: "Tournament details fetched successfully", tournament });
});
