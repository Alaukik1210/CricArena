import express from "express";
import { authentication } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createBookingSession, getMyBookingSessions } from "./booking-session.controller";
import { createBookingSessionSchema } from "./booking-session.schemas";

const router = express.Router();

router.get("/mine", authentication, getMyBookingSessions);
router.post("/", authentication, validate(createBookingSessionSchema), createBookingSession);

export default router;
