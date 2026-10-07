import { z } from "zod";
import { Role } from "@prisma/client";

const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

export const registerSchema = z.object({
    fullname: z.string().trim().min(2).max(80),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(128),
    phoneNumber: z
        .string()
        .trim()
        .regex(phoneRegex, "Invalid phone number")
        .or(z.number().transform((n) => String(n))),
    role: z.nativeEnum(Role),
    state: z.string().trim().min(2).max(60),
    city: z.string().trim().min(2).max(60),
});

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1).max(128),
    role: z.nativeEnum(Role),
});

export const searchPlayerSchema = z
    .object({
        fullname: z.string().trim().min(1).optional(),
        email: z.string().trim().toLowerCase().email().optional(),
        phoneNumber: z.string().trim().regex(phoneRegex).optional(),
    })
    .refine((d) => d.fullname || d.email || d.phoneNumber, {
        message: "At least one search field is required",
    });

export const updateProfileSchema = z.object({
    fullname: z.string().trim().min(2).max(80).optional(),
    phoneNumber: z.string().trim().regex(phoneRegex).optional(),
    state: z.string().trim().min(2).max(60).optional(),
    city: z.string().trim().min(2).max(60).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SearchPlayerInput = z.infer<typeof searchPlayerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
