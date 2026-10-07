import express from "express";
import { Role } from "@prisma/client";
import { authentication, requireRole } from "../../middleware/auth";
import {
    getAdminAnalytics,
    getOrganizerAnalytics,
    getOwnerAnalytics,
} from "./analytics.controller";

const router = express.Router();

router.get("/owner", authentication, requireRole(Role.OWNER, Role.ADMIN), getOwnerAnalytics);
router.get("/organizer", authentication, requireRole(Role.OWNER, Role.ADMIN), getOrganizerAnalytics);
router.get("/admin", authentication, requireRole(Role.ADMIN), getAdminAnalytics);

export default router;
