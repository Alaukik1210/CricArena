import express from "express";
import { Role } from "@prisma/client";
import {
    upsertOwnerProfile,
    getOwnerProfile,
    deleteOwnerProfile,
    getOwnerGrounds,
} from "../controller/O_profile.controller";
import { authentication, requireRole, requireSelfOrAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
    upsertOwnerProfileSchema,
    userIdParamSchema,
} from "../modules/profiles/profile.schemas";

const router = express.Router();

const ownerGuards = [
    authentication,
    requireRole(Role.OWNER, Role.ADMIN),
    requireSelfOrAdmin(),
    validate(userIdParamSchema, "params"),
] as const;

router.post("/:userId", ...ownerGuards, validate(upsertOwnerProfileSchema), upsertOwnerProfile);
router.get("/:userId", ...ownerGuards, getOwnerProfile);
router.delete("/:userId", ...ownerGuards, deleteOwnerProfile);
router.get("/:userId/grounds", ...ownerGuards, getOwnerGrounds);

export default router;
