import express from "express";
import { Role } from "@prisma/client";
import {
    createGround,
    getAllGrounds,
    getGroundById,
    updateGround,
    deleteGround,
} from "../controller/ground.controller";
import { authentication, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
    createGroundSchema,
    groundIdParamSchema,
    updateGroundSchema,
} from "../modules/grounds/ground.schemas";

const router = express.Router();

router.post(
    "/create",
    authentication,
    requireRole(Role.OWNER, Role.ADMIN),
    validate(createGroundSchema),
    createGround,
);
router.get("/all", getAllGrounds);
router.get("/:id", validate(groundIdParamSchema, "params"), getGroundById);
router.put(
    "/update/:id",
    authentication,
    requireRole(Role.OWNER, Role.ADMIN),
    validate(groundIdParamSchema, "params"),
    validate(updateGroundSchema),
    updateGround,
);
router.delete(
    "/delete/:id",
    authentication,
    requireRole(Role.OWNER, Role.ADMIN),
    validate(groundIdParamSchema, "params"),
    deleteGround,
);

export default router;
