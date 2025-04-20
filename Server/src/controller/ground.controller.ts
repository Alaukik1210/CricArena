import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new ground
export const createGround = async (req: Request, res: Response) => {
    try {
        const { name, location, rating, bookings, pitchType, facilities, pricePerMatch, ownerId } = req.body;

        if (!name || !location || !pitchType || !pricePerMatch) {
             res.status(400).json({
                message: "Name, location, pitch type, price per match, and owner ID are required",
                success: false,
            });
            return
        }

        const newGround = await prisma.ground.create({
            data: {
                name,
                location,
                rating: rating || 0.0,
                bookings: bookings || 0,
                pitchType,
                facilities,
                pricePerMatch,
                ownerId,
            },
        });

         res.status(201).json({
            message: "Ground created successfully",
            success: true,
            ground: newGround,
        });
        return
    } catch (error) {
        console.error(error);
         res.status(500).json({
            message: "Server error",
            success: false,
        });
        return
    }
};

// Get all grounds
export const getAllGrounds = async (req: Request, res: Response) => {
    try {
        const grounds = await prisma.ground.findMany({
            include: {
                owner: true, // Include owner details
            },
        });

         res.status(200).json({
            message: "Grounds fetched successfully",
            success: true,
            grounds,
        });
        return
    } catch (error) {
        console.error(error);
         res.status(500).json({
            message: "Server error",
            success: false,
        });
        return
    }
};

// Get a ground by ID
export const getGroundById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const ground = await prisma.ground.findUnique({
            where: { id },
            include: {
                owner: true, // Include owner details
            },
        });

        if (!ground) {
             res.status(404).json({
                message: "Ground not found",
                success: false,
            });
            return
        }

         res.status(200).json({
            message: "Ground details fetched successfully",
            success: true,
            ground,
        });
        return
    } catch (error) {
        console.error(error);
         res.status(500).json({
            message: "Server error",
            success: false,
        });
        return
    }
};

// Update a ground
export const updateGround = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, location, rating, bookings, pitchType, facilities, pricePerMatch } = req.body;

        const ground = await prisma.ground.findUnique({ where: { id } });

        if (!ground) {
             res.status(404).json({
                message: "Ground not found",
                success: false,
            });
            return
        }

        const updatedGround = await prisma.ground.update({
            where: { id },
            data: {
                name,
                location,
                rating,
                bookings,
                pitchType,
                facilities,
                pricePerMatch,
            },
        });

         res.status(200).json({
            message: "Ground updated successfully",
            success: true,
            ground: updatedGround,
        });
        return
    } catch (error) {
        console.error(error);
         res.status(500).json({
            message: "Server error",
            success: false,
        });
        return
    }
};

export const deleteGround = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const ground = await prisma.ground.findUnique({ where: { id } });

        if (!ground) {
             res.status(404).json({
                message: "Ground not found",
                success: false,
            });
            return
        }

        await prisma.ground.delete({ where: { id } });

         res.status(200).json({
            message: "Ground deleted successfully",
            success: true,
        });
        return
    } catch (error) {
        console.error(error);
         res.status(500).json({
            message: "Server error",
            success: false,
        });
        return
    }
};