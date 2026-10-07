import { Response } from "express";
import { authRequest } from "../../middleware/auth";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { UnauthorizedError } from "../../shared/errors/AppError";
import { bookingSessionService } from "./booking-session.service";
import { CreateBookingSessionInput } from "./booking-session.schemas";

export const createBookingSession = asyncHandler(async (req: authRequest, res: Response) => {
    if (!req.userId) throw new UnauthorizedError();

    const data = req.body as CreateBookingSessionInput;
    const session = await bookingSessionService.createSession(req.userId, data);

    res.status(201).json({ success: true, session });
});

export const getMyBookingSessions = asyncHandler(async (req: authRequest, res: Response) => {
    if (!req.userId) throw new UnauthorizedError();
    const sessions = await bookingSessionService.listSessionsForUser(req.userId);
    res.status(200).json({ success: true, sessions });
});
