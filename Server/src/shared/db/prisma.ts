import { PrismaClient } from "@prisma/client";

declare global {
    // `var` is required here: it is the only declaration form that augments
    // globalThis. `let`/`const` in a `declare global` block do not.
    var __cricArenaPrisma: PrismaClient | undefined;
}

export const prisma =
    global.__cricArenaPrisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    global.__cricArenaPrisma = prisma;
}
