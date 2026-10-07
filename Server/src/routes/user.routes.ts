import express, { Router } from "express";
import { login, logout, register, searchPlayer, updateProfile } from "../controller/user.controller";
import { authentication } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
    loginSchema,
    registerSchema,
    searchPlayerSchema,
    updateProfileSchema,
} from "../modules/auth/auth.schemas";

const router: Router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/searchPlayer", authentication, validate(searchPlayerSchema), searchPlayer);
router.put("/update", authentication, validate(updateProfileSchema), updateProfile);
router.post("/logout", logout);

export default router;
