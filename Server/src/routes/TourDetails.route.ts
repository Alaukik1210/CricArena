import express, { Router } from "express";
import { Role } from "@prisma/client";
import {
    getAllTournaments,
    getTournamentById,
    registerForTour,
    TournamentDetails,
} from "../controller/TourDetails.controller";
import { authentication, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
    createTournamentSchema,
    registerForTourSchema,
    tournamentIdParamSchema,
} from "../modules/tournaments/tournament.schemas";

const router: Router = express.Router();

router.post(
    "/tourDetails",
    authentication,
    requireRole(Role.OWNER, Role.ADMIN),
    validate(createTournamentSchema),
    TournamentDetails,
);
router.get("/getTours", getAllTournaments);
router.get("/details/:id", validate(tournamentIdParamSchema, "params"), getTournamentById);
router.post("/register", authentication, validate(registerForTourSchema), registerForTour);
router.get("/:id", validate(tournamentIdParamSchema, "params"), getTournamentById);

export default router;
