import express from "express";
import {
    createGround,
    getAllGrounds,
    getGroundById,
    updateGround,
    deleteGround,
} from "../controller/ground.controller";
import { authentication } from "../middleware/auth";

const router = express.Router();

router.post("/create",authentication, createGround);
router.get("/all", getAllGrounds); 
router.get("/:id", getGroundById); 
router.put("/update/:id", updateGround); 
router.delete("/delete/:id", deleteGround);

export default router;