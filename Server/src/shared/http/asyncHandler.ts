import { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncRequestHandler<Req extends Request = Request> = (
    req: Req,
    res: Response,
    next: NextFunction,
) => Promise<unknown> | unknown;

export const asyncHandler =
    <Req extends Request = Request>(fn: AsyncRequestHandler<Req>): RequestHandler =>
    (req, res, next) => {
        Promise.resolve(fn(req as Req, res, next)).catch(next);
    };
