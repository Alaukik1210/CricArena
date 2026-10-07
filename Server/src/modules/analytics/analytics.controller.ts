import { Response } from "express";
import { authRequest } from "../../middleware/auth";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { UnauthorizedError } from "../../shared/errors/AppError";
import { analyticsService } from "./analytics.service";

export const getOwnerAnalytics = asyncHandler(async (req: authRequest, res: Response) => {
    if (!req.userId) throw new UnauthorizedError();
    const analytics = await analyticsService.getOwnerAnalytics(req.userId);
    res.status(200).json({ success: true, analytics });
});

export const getOrganizerAnalytics = asyncHandler(async (req: authRequest, res: Response) => {
    if (!req.userId) throw new UnauthorizedError();
    const analytics = await analyticsService.getOrganizerAnalytics(req.userId);
    res.status(200).json({ success: true, analytics });
});

export const getAdminAnalytics = asyncHandler(async (_req: authRequest, res: Response) => {
    const analytics = await analyticsService.getAdminAnalytics();
    res.status(200).json({ success: true, analytics });
});
