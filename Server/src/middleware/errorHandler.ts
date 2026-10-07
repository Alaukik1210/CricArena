import { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/errors/AppError";

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    const isProd = process.env.NODE_ENV === "production";

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.details !== undefined ? { details: err.details } : {}),
        });
        return;
    }

    const anyErr = err as { name?: string; code?: string; message?: string; stack?: string };

    // Prisma known errors
    if (anyErr?.code === "P2002") {
        res.status(409).json({ success: false, message: "Resource already exists" });
        return;
    }
    if (anyErr?.code === "P2025") {
        res.status(404).json({ success: false, message: "Resource not found" });
        return;
    }

    // JWT errors
    if (anyErr?.name === "JsonWebTokenError" || anyErr?.name === "TokenExpiredError") {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
        return;
    }

    console.error("[unhandled error]", {
        method: req.method,
        url: req.originalUrl,
        error: anyErr?.message,
        stack: anyErr?.stack,
    });

    res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(isProd ? {} : { error: anyErr?.message }),
    });
};
