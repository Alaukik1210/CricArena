import express,{ Router } from "express";
import { getAllTournaments, getTournamentById, registerForTour, TournamentDetails } from "../controller/TourDetails.controller";

const router: Router = express.Router();
router.post('/tourDetails', TournamentDetails);
router.get('/getTours', getAllTournaments );
router.get('/details/:id', getAllTournaments );
router.post("/register", registerForTour);
router.get("/:id", getTournamentById);

export default router