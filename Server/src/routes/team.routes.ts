import express from "express";
import {
    createTeam,
    getAllTeams,
    getTeamById,
    updateTeam,
    deleteTeam,
    getTeamMembers,
    addPlayerToTeam,
} from "../controller/Team.controller";

const router = express.Router();

router.post("/create", createTeam);
router.get("/all", getAllTeams);
router.get("/:id", getTeamById);
router.put("/update/:id", updateTeam);
router.delete("/delete/:id", deleteTeam);
router.get("/:id/members", getTeamMembers);
router.post("/addPlayer", addPlayerToTeam);

export default router;