import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../shared/db/prisma";
import { authRequest } from "../middleware/auth";
import { asyncHandler } from "../shared/http/asyncHandler";
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from "../shared/errors/AppError";
import {
    LoginInput,
    RegisterInput,
    SearchPlayerInput,
    UpdateProfileInput,
} from "../modules/auth/auth.schemas";

const COOKIE_OPTIONS = {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
};

const toSafeUser = <T extends { password: string }>(user: T) => {
    const { password, ...safe } = user;
    return safe;
};

const signToken = (userId: string) => {
    const secret = process.env.SECRET_KEY;
    if (!secret) throw new Error("SECRET_KEY is not configured");
    return jwt.sign({ userId }, secret, { expiresIn: "1d" });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { fullname, email, password, phoneNumber, role, state, city } = req.body as RegisterInput;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictError("User already exists with this email");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: { fullname, email, password: hashedPassword, phoneNumber, role, state, city },
    });

    const token = signToken(newUser.id);

    res.status(201)
        .cookie("token", token, COOKIE_OPTIONS)
        .json({
            success: true,
            message: "Account created successfully",
            user: toSafeUser(newUser),
        });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, role } = req.body as LoginInput;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedError("Incorrect email or password");

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new UnauthorizedError("Incorrect email or password");

    if (role !== user.role) throw new BadRequestError("User does not exist with this role");

    const token = signToken(user.id);

    res.status(200)
        .cookie("token", token, COOKIE_OPTIONS)
        .json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: toSafeUser(user),
        });
});

export const searchPlayer = asyncHandler(async (req: Request, res: Response) => {
    const { fullname, email, phoneNumber } = req.body as SearchPlayerInput;

    const players = await prisma.user.findMany({
        where: {
            ...(fullname && { fullname }),
            ...(email && { email }),
            ...(phoneNumber && { phoneNumber }),
        },
    });

    if (players.length === 0) throw new NotFoundError("No player found");

    res.status(200).json({ success: true, message: "Player found", player: players });
});

export const updateProfile = asyncHandler(async (req: authRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) throw new UnauthorizedError();

    const data = req.body as UpdateProfileInput;

    const updated = await prisma.user.update({ where: { id: userId }, data });

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: toSafeUser(updated),
    });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
    res.status(200)
        .cookie("token", "", { ...COOKIE_OPTIONS, maxAge: 0 })
        .json({ success: true, message: "Logged out successfully." });
});
