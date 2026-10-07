import express from "express";
import { authentication } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { getDiscoveryFeed, upsertAvailability } from "./discovery.controller";
import {
    discoveryFeedQuerySchema,
    upsertAvailabilitySchema,
} from "./discovery.schemas";

const router = express.Router();

router.get("/feed", validate(discoveryFeedQuerySchema, "query"), getDiscoveryFeed);
router.post(
    "/availability",
    authentication,
    validate(upsertAvailabilitySchema),
    upsertAvailability,
);

export default router;
