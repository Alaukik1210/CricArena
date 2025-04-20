import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const TournamentDetails = async (req:Request,res:Response)=>{
    try {
        const {title,description,tourStartsDate,tourEndDate,venue,entryFee,spots,type,lastRegistrationDate} = req.body;
        if(!title || !description || !tourStartsDate || !tourEndDate || !venue || !entryFee || !spots || !type || !lastRegistrationDate){
            res.status(400).json({
                message:"Please enter all these important details",
                success:false
            });
            return
        }

        const newTournament = await prisma.tournamentDetails.create({
            data: {
                title,
                description,
                tourStartsDate,
                tourEndDate,
                venue,
                entryFee,
                spots,
                type,
                lastRegistrationDate
            }
        });

         res.status(201).json({
            message: "Tournament created successfully",
            success: true,
            tournament: newTournament
        });
        return
       
        
    } catch (error) {
        console.log(error);
        
    }
}

export const getAllTournaments = async(req:Request,res:Response)=>{
    try {
        const tournaments = await prisma.tournamentDetails.findMany({
            orderBy:{
                createdAt:'desc'
            }
        });

        if(!tournaments.length){
            res.status(404).json({
                message:"No tournaments found",
                success:false
            })
            return 
        }

        res.status(200).json({
            message:"Tournaments fetched successfully",
            success:true,
            tournaments
        })
        
    } catch (error) {
        console.log(error)
    }
}

export const registerForTour = async (req: Request, res: Response) => {
    try {
        const { tournamentId, teamId } = req.body;

        // Validate input
        if (!tournamentId || !teamId) {
             res.status(400).json({
                message: "Tournament ID and Team ID are required",
                success: false,
            });
            return
        }

        // Check if the tournament exists
        const tournament = await prisma.tournamentDetails.findUnique({
            where: { id: tournamentId },
        });

        if (!tournament) {
             res.status(404).json({
                message: "Tournament not found",
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

        // Check if the team is already registered for the tournament
        const isAlreadyRegistered = await prisma.tournamentDetails.findFirst({
            where: {
                id: tournamentId,
                teams: {
                    some: { id: teamId },
                },
            },
        });

        if (isAlreadyRegistered) {
             res.status(400).json({
                message: "Team is already registered for this tournament",
                success: false,
            });
            return
        }

        // Register the team for the tournament
        await prisma.tournamentDetails.update({
            where: { id: tournamentId },
            data: {
                teams: {
                    connect: { id: teamId },
                },
            },
        });

         res.status(200).json({
            message: "Team successfully registered for the tournament",
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

export const getTournamentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if the tournament exists
        const tournament = await prisma.tournamentDetails.findUnique({
            where: { id },
            include: {
                teams: true, // Include the teams registered for the tournament
            },
        });

        if (!tournament) {
             res.status(404).json({
                message: "Tournament not found",
                success: false,
            });
            return
        }

         res.status(200).json({
            message: "Tournament details fetched successfully",
            success: true,
            tournament,
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