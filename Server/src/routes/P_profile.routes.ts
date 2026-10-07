import express from "express";
import {
    upsertPlayerProfile,
    getPlayerProfile,
    deletePlayerProfile,
    getPlayerTeams,
} from "../controller/P_profile.controller";
import { authentication, requireSelfOrAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
    upsertPlayerProfileSchema,
    userIdParamSchema,
} from "../modules/profiles/profile.schemas";

const router = express.Router();

const playerGuards = [
    authentication,
    requireSelfOrAdmin(),
    validate(userIdParamSchema, "params"),
] as const;

router.post("/upsert/:userId", ...playerGuards, validate(upsertPlayerProfileSchema), upsertPlayerProfile);
router.get("/:userId", ...playerGuards, getPlayerProfile);
router.delete("/:userId", ...playerGuards, deletePlayerProfile);
router.get("/:userId/teams", ...playerGuards, getPlayerTeams);

export default router;
