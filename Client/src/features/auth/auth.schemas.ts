import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
    role: z.enum(["PLAYER", "OWNER", "ADMIN"]),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
