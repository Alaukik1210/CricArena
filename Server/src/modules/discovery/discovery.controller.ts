import { Request, Response } from "express";
import { authRequest } from "../../middleware/auth";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { UnauthorizedError } from "../../shared/errors/AppError";
import { discoveryService } from "./discovery.service";
import {
    DiscoveryFeedQuery,
    UpsertAvailabilityInput,
} from "./discovery.schemas";

export const getDiscoveryFeed = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as DiscoveryFeedQuery;
    const feed = await discoveryService.getFeed(query);
    res.status(200).json({ success: true, ...feed });
});

export const upsertAvailability = asyncHandler(async (req: authRequest, res: Response) => {
    if (!req.userId) throw new UnauthorizedError();
    const data = req.body as UpsertAvailabilityInput;
    const availability = await discoveryService.upsertAvailability(req.userId, {
        ...data,
        preferredRoles: data.preferredRoles ?? [],
    });
    res.status(200).json({ success: true, availability });
});
