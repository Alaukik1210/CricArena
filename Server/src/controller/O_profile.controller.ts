import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Upsert (Create or Update) OwnerProfile
export const upsertOwnerProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            res.status(400).json({
                message: "User ID is required",
                success: false,
            });
            return;
        }

        const { bio, profilePhoto,ownerId } = req.body;

        const ownerProfile = await prisma.ownerProfile.upsert({
            where: { userId },
            
            create: {
                ownerId,
                userId,
                bio,
                profilePhoto,
            },
            update: {
                bio,
                profilePhoto,
            },
        });

        res.status(200).json({
            message: "Owner profile saved successfully",
            success: true,
            profile: ownerProfile,
        });
        return;
    } catch (error) {
        console.error("Error upserting OwnerProfile:", error);
        res.status(500).json({
            message: "Server error",
            success: false,
        });
        return;
    }
};

// Get OwnerProfile by User ID
export const getOwnerProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const ownerProfile = await prisma.ownerProfile.findUnique({
            where: { userId },
            include: {
                grounds: true, // Include related grounds
            },
        });

        if (!ownerProfile) {
            res.status(404).json({
                message: "Owner profile not found",
                success: false,
            });
            return;
        }

        res.status(200).json({
            message: "Owner profile fetched successfully",
            success: true,
            profile: ownerProfile,
        });
        return;
    } catch (error) {
        console.error("Error fetching OwnerProfile:", error);
        res.status(500).json({
            message: "Server error",
            success: false,
        });
        return;
    }
};

// Delete OwnerProfile by User ID
export const deleteOwnerProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const ownerProfile = await prisma.ownerProfile.findUnique({
            where: { userId },
        });

        if (!ownerProfile) {
            res.status(404).json({
                message: "Owner profile not found",
                success: false,
            });
            return;
        }

        await prisma.ownerProfile.delete({
            where: { userId },
        });

        res.status(200).json({
            message: "Owner profile deleted successfully",
            success: true,
        });
        return;
    } catch (error) {
        console.error("Error deleting OwnerProfile:", error);
        res.status(500).json({
            message: "Server error",
            success: false,
        });
        return;
    }
};

// Get Grounds for an OwnerProfile
export const getOwnerGrounds = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const ownerProfile = await prisma.ownerProfile.findUnique({
            where: { userId },
            include: {
                grounds: true, // Include related grounds
            },
        });

        if (!ownerProfile) {
            res.status(404).json({
                message: "Owner profile not found",
                success: false,
            });
            return;
        }

        res.status(200).json({
            message: "Owner grounds fetched successfully",
            success: true,
            grounds: ownerProfile.grounds,
        });
        return;
    } catch (error) {
        console.error("Error fetching Owner grounds:", error);
        res.status(500).json({
            message: "Server error",
            success: false,
        });
        return;
    }
};