import express from "express";
import {
    upsertPlayerProfile,
    getPlayerProfile,
    deletePlayerProfile,
    getPlayerTeams,
} from "../controller/P_profile.controller";

const router = express.Router();

router.post("/upsert:userId", upsertPlayerProfile);
router.get("/:userId", getPlayerProfile);
router.delete("/:userId", deletePlayerProfile);
router.get("/:userId/teams", getPlayerTeams);

export default router;