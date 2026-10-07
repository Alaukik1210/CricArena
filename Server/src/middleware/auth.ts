import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { prisma } from "../shared/db/prisma";

export interface authRequest extends Request {
    userId?: string;
    userRole?: Role;
}

const getTokenFromRequest = (req: Request) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.replace("Bearer ", "").trim();
    }

    return req.cookies?.token;
};

export const authentication = async (req: authRequest, res: Response, next: NextFunction) => {
    const token = getTokenFromRequest(req);

    if (!token) {
        res.status(401).json({
            message: "Authentication required",
            success: false,
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as jwt.JwtPayload;
        const userId = decoded.userId as string | undefined;

        if (!userId) {
            res.status(401).json({
                message: "Invalid token payload",
                success: false,
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true },
        });

        if (!user) {
            res.status(401).json({
                message: "User not found",
                success: false,
            });
            return;
        }

        req.userId = user.id;
        req.userRole = user.role;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token",
            success: false,
        });
    }
};

export const requireRole = (...roles: Role[]) => {
    return (req: authRequest, res: Response, next: NextFunction) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource",
            });
            return;
        }

        next();
    };
};

export const requireSelfOrAdmin = (paramKey = "userId") => {
    return (req: authRequest, res: Response, next: NextFunction) => {
        const resourceUserId = req.params[paramKey];

        if (!req.userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        if (req.userRole === Role.ADMIN || req.userId === resourceUserId) {
            next();
            return;
        }

        res.status(403).json({
            success: false,
            message: "You can only access your own profile",
        });
    };
};
