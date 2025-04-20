import express, { Router, Request, Response } from "express";
import { login, register, searchPlayer, updateProfile } from "../controller/user.controller";
import { authentication } from "../middleware/auth";

const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/searchPlayer',authentication, searchPlayer);
router.put('update',updateProfile);
export default router;