import express from "express";
import { authentication } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
    approvePlayRoomMember,
    createPlayRoom,
    listPlayRooms,
    requestJoinPlayRoom,
} from "./play-room.controller";
import {
    createPlayRoomSchema,
    joinRequestSchema,
    listPlayRoomsQuerySchema,
    playRoomIdParamSchema,
    playRoomMemberParamSchema,
} from "./play-room.schemas";

const router = express.Router();

router.get("/", validate(listPlayRoomsQuerySchema, "query"), listPlayRooms);
router.post("/", authentication, validate(createPlayRoomSchema), createPlayRoom);
router.post(
    "/:id/join-requests",
    authentication,
    validate(playRoomIdParamSchema, "params"),
    validate(joinRequestSchema),
    requestJoinPlayRoom,
);
router.post(
    "/:id/members/:memberId/approve",
    authentication,
    validate(playRoomMemberParamSchema, "params"),
    approvePlayRoomMember,
);

export default router;
