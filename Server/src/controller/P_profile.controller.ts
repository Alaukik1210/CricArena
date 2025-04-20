import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const upsertPlayerProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params; 

        if (!userId) {
             res.status(400).json({
                message: "User ID is required",
                success: false,
            });
            return
        }

        const { bio, skills, battingStyle, bowlingStyle, profilePhoto, achievements, stats } = req.body;

        const playerProfile = await prisma.playerProfile.upsert({
            where: { userId },
            update: {
                bio,
                skills,
                battingStyle,
                bowlingStyle,
                profilePhoto,
                achievements,
                stats,
            },
            create: {
                userId,
                bio,
                skills,
                battingStyle,
                bowlingStyle,
                profilePhoto,
                achievements,
                stats,
            },
        });

         res.status(200).json({
            message: "Player profile saved successfully",
            success: true,
            profile: playerProfile,
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

export const getPlayerProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const playerProfile = await prisma.playerProfile.findUnique({
            where: { userId },
            include: {
                teams: true, 
            },
        });

        if (!playerProfile) {
             res.status(404).json({
                message: "Player profile not found",
                success: false,
            });
            return
        }
         res.status(200).json({
            message: "Player profile fetched successfully",
            success: true,
            profile: playerProfile,
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

export const deletePlayerProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const playerProfile = await prisma.playerProfile.findUnique({
            where: { userId },
        });

        if (!playerProfile) {
             res.status(404).json({
                message: "Player profile not found",
                success: false,
            });
            return
        }

        await prisma.playerProfile.delete({
            where: { userId },
        });

         res.status(200).json({
            message: "Player profile deleted successfully",
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

export const getPlayerTeams = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const playerProfile = await prisma.playerProfile.findUnique({
            where: { userId },
            include: {
                teams: true, 
            },
        });

        if (!playerProfile) {
             res.status(404).json({
                message: "Player profile not found",
                success: false,
            });
            return
        }

         res.status(200).json({
            message: "Player teams fetched successfully",
            success: true,
            teams: playerProfile.teams,
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