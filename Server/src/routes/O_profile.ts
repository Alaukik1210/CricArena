import express from "express";
import {
    upsertOwnerProfile,
    getOwnerProfile,
    deleteOwnerProfile,
    getOwnerGrounds,
} from "../controller/O_profile.controller";
import { authentication } from "../middleware/auth";

const router = express.Router();

router.post("/:userId",authentication, upsertOwnerProfile);
router.get("/:userId", getOwnerProfile);
router.delete("/:userId", deleteOwnerProfile);
router.get("/:userId/grounds", getOwnerGrounds);

export default router;