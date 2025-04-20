import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { authRequest } from "../middleware/auth";

const prisma = new PrismaClient();

export const register = async (req: any, res: Response) => {
    try {
        const { fullname, email, password, phoneNumber, role ,state , city } = req.body;
            console.log("hii",req.body)
        if (!fullname || !email || !password || !role || !phoneNumber || !state || !city) {
             res.status(400).json({
                message: "Something is missing",
                success: false
            });
            return
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
             res.status(400).json({
                message: "User already exists with this email",
                success: false
            });
            return
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

       const newUser =  await prisma.user.create({
            data: {
                fullname,
                email,
                password: hashedPassword,
                phoneNumber,
                role,
                state,
                city
            }
        });

         res.status(201).json({
            message: "Account created successfully",
            success: true,
            newUser
        });
        return

    } catch (error) {
        console.log(error);
         res.status(500).json({
            message: "Server error",
            success: false
        });
        return
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
             res.status(400).json({
                message: "Invalid email or password.",
                success: false
            });
            return
        }

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
            return
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
             res.status(403).json({
                message: "Invalid email or password",
                success: false
            });
            return
        }

        if (role !== user.role) {
             res.status(400).json({
                message: "User does not exist with this role",
                success: false
            });
            return
        }

        const tokenData = {
            userId: user.id,
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY as string, {
            expiresIn: "1d",
        });

       

         res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });
        return

    } catch (error) {
        console.log(error);
         res.status(500).json({
            message: "Server error",
            success: false
        });
        return
    }
};

export const searchPlayer = async (req: Request, res: Response) => {
    try {
        const { fullname, email, phoneNumber } = req.body;
        if (!phoneNumber && !email && !fullname) {
             res.status(400).json({
                message: "At least provide any search criteria",
                success: false
            });
            return
        }

        const query: any = {};
        if (phoneNumber) query.phoneNumber = phoneNumber;
        if (email) query.email = email;
        if (fullname) query.fullname = fullname;

        const player = await prisma.user.findMany({ where: query });

        if (player.length === 0) {
             res.status(404).json({
                message: "No player found",
                success: false
            });
            return
        }

         res.status(200).json({
            message: "Player found",
            player,
            success: true
        });
        return

    } catch (error) {
        console.log(error);
         res.status(500).json({
            message: "Server error",
            success: false
        });
        return
    }
};

export const updateProfile = async (req: authRequest, res: Response) => {
    try {
       const userId = req.userId;
       

    } catch (error) {
        console.error(error);
         res.status(500).json({
            message: "Server error",
            success: false,
           
        });
        return
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
         res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
        return
    } catch (error) {
        console.log(error);
         res.status(500).json({
            message: "Server error",
            success: false
        });
        return
    }
};