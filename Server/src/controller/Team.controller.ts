import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new team
export const createTeam = async (req: Request, res: Response) => {
    try {
        const { name, description, memberIds } = req.body;

        if (!name || !description) {
             res.status(400).json({
                message: "Name and description are required",
                success: false,
            });
            return
        }
        const newTeam = await prisma.team.create({
            data: {
                name,
                description,
                members: {
                    connect: memberIds?.map((id: string) => ({ id })),
                },
            },
        });

        if (memberIds && memberIds.length > 0) {
            await Promise.all(
                memberIds.map(async (id: string) => {
                    
                    const playerProfile = await prisma.playerProfile.findUnique({
                        where: { userId: id },
                    });

                    if (playerProfile) {
                        
                        await prisma.playerProfile.update({
                            where: { userId: id },
                            data: {
                                teams: {
                                    connect: { id: newTeam.id },
                                },
                            },
                        });
                    } else {
                        console.warn(`PlayerProfile not found for userId: ${id}`);
                    }
                })
            );
        }

         res.status(201).json({
            message: "Team created successfully",
            success: true,
            team: newTeam,
        });
        return
    } catch (error) {
        console.error(error);
         res.status(500).json({
            message: "Server error",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
        return
    }
};
export const getAllTeams = async (req: Request, res: Response) => {
    try {
        const teams = await prisma.team.findMany({
            include: {
                members: true,
            },
        });

         res.status(200).json({
            message: "Teams fetched successfully",
            success: true,
            teams,
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

// Get a single team by ID
export const getTeamById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const team = await prisma.team.findUnique({
            where: { id },
            include: {
                members: true,
            },
        });

        if (!team) {
             res.status(404).json({
                message: "Team not found",
                success: false,
            });
            return
        }

         res.status(200).json({
            message: "Team fetched successfully",
            success: true,
            team,
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

// Update a team
export const updateTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, memberIds } = req.body;

        const team = await prisma.team.findUnique({ where: { id } });

        if (!team) {
             res.status(404).json({
                message: "Team not found",
                success: false,
            });
            return
        }

        const updatedTeam = await prisma.team.update({
            where: { id },
            data: {
                name,
                description,
                members: {
                    set: memberIds?.map((id: string) => ({ id })),
                },
            },
        });

        if (memberIds && memberIds.length > 0) {
            await Promise.all(
                memberIds.map(async (id: string) => {
                    await prisma.playerProfile.update({
                        where: { userId: id },
                        data: {
                            teams: {
                                connect: { id: updatedTeam.id },
                            },
                        },
                    });
                })
            );
        }


         res.status(200).json({
            message: "Team updated successfully",
            success: true,
            team: updatedTeam,
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

// Delete a team
export const deleteTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const team = await prisma.team.findUnique({ where: { id } });

        if (!team) {
             res.status(404).json({
                message: "Team not found",
                success: false,
            });
            return
        }

        const playerProfiles = await prisma.playerProfile.findMany({
            where: {
                teams: {
                    some: { id },
                },
            },
        });

        // Disconnect the team from each player's profile
        await Promise.all(
            playerProfiles.map(async (profile) => {
                await prisma.playerProfile.update({
                    where: { id: profile.id },
                    data: {
                        teams: {
                            disconnect: { id },
                        },
                    },
                });
            })
        );

        await prisma.team.delete({ where: { id } });

         res.status(200).json({
            message: "Team deleted successfully",
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

// Get members of a specific team
export const getTeamMembers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Fetch the team along with its members
        const team = await prisma.team.findUnique({
            where: { id },
            include: {
                members: true, // Include members in the response
            },
        });

        if (!team) {
             res.status(404).json({
                message: "Team not found",
                success: false,
            });
            return
        }

         res.status(200).json({
            message: "Team members fetched successfully",
            success: true,
            members: team.members,
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

export const addPlayerToTeam = async (req: Request, res: Response) => {
    try {
        const { teamId, playerId } = req.body;

        // Validate input
        if (!teamId || !playerId) {
             res.status(400).json({
                message: "Team ID and Player ID are required",
                success: false,
            });
            return
        }

        // Check if the team exists
        const team = await prisma.team.findUnique({
            where: { id: teamId },
        });

        if (!team) {
             res.status(404).json({
                message: "Team not found",
                success: false,
            });
            return
        }

        // Check if the player exists
        const player = await prisma.user.findUnique({
            where: { id: playerId },
        });

        if (!player) {
             res.status(404).json({
                message: "Player not found",
                success: false,
            });
            return
        }

        // Add the player to the team
        await prisma.team.update({
            where: { id: teamId },
            data: {
                members: {
                    connect: { id: playerId },
                },
            },
        });

        await prisma.playerProfile.update({
            where: { userId: playerId },
            data: {
                teams: {
                    connect: { id: teamId },
                },
            },
        });

         res.status(200).json({
            message: "Player added to the team successfully",
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