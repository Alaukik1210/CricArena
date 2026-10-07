import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { BadRequestError } from "../shared/errors/AppError";

type Source = "body" | "query" | "params";

export const validate =
    (schema: ZodSchema, source: Source = "body") =>
    (req: Request, _res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req[source]);
            // Replace with parsed (coerced/stripped) value
            (req as Record<Source, unknown>)[source] = parsed;
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const details = err.issues.map((i) => ({
                    path: i.path.join("."),
                    message: i.message,
                }));
                next(new BadRequestError("Validation failed", details));
                return;
            }
            next(err);
        }
    };
