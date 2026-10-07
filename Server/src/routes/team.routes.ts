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
import { authentication } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
    addPlayerSchema,
    createTeamSchema,
    teamIdParamSchema,
    updateTeamSchema,
} from "../modules/teams/team.schemas";

const router = express.Router();

router.post("/create", authentication, validate(createTeamSchema), createTeam);
router.get("/all", getAllTeams);
router.get("/:id", validate(teamIdParamSchema, "params"), getTeamById);
router.put(
    "/update/:id",
    authentication,
    validate(teamIdParamSchema, "params"),
    validate(updateTeamSchema),
    updateTeam,
);
router.delete(
    "/delete/:id",
    authentication,
    validate(teamIdParamSchema, "params"),
    deleteTeam,
);
router.get("/:id/members", validate(teamIdParamSchema, "params"), getTeamMembers);
router.post("/addPlayer", authentication, validate(addPlayerSchema), addPlayerToTeam);

export default router;
