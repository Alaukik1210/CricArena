import { Request, Response } from "express";
import { authRequest } from "../../middleware/auth";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { UnauthorizedError } from "../../shared/errors/AppError";
import { playRoomService } from "./play-room.service";
import {
    CreatePlayRoomInput,
    JoinRequestInput,
    ListPlayRoomsQuery,
} from "./play-room.schemas";

export const listPlayRooms = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as ListPlayRoomsQuery;
    const rooms = await playRoomService.listRooms(query);
    res.status(200).json({ success: true, rooms });
});

export const createPlayRoom = asyncHandler(async (req: authRequest, res: Response) => {
    if (!req.userId) throw new UnauthorizedError();
    const data = req.body as CreatePlayRoomInput;
    const room = await playRoomService.createRoom(req.userId, data);
    res.status(201).json({ success: true, room });
});

export const requestJoinPlayRoom = asyncHandler(async (req: authRequest, res: Response) => {
    if (!req.userId) throw new UnauthorizedError();
    const data = req.body as JoinRequestInput;
    const result = await playRoomService.requestToJoin(req.params.id, req.userId, data);
    res.status(201).json({ success: true, ...result });
});

export const approvePlayRoomMember = asyncHandler(async (req: authRequest, res: Response) => {
    if (!req.userId) throw new UnauthorizedError();
    const member = await playRoomService.approveMember(
        req.params.id,
        req.params.memberId,
        req.userId,
    );
    res.status(200).json({ success: true, member });
});
