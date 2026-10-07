import express, { Express } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import paymentWebhookRouter from "../modules/payments/payment-webhook.routes";
import { registerRoutes } from "./register-routes";
import { errorHandler, notFoundHandler } from "../middleware/errorHandler";

dotenv.config();

export const createApp = (): Express => {
    const app: Express = express();
    const isProd = process.env.NODE_ENV === "production";

    app.set("trust proxy", 1);

    const allowedOrigins = new Set([
        process.env.CLIENT_URL || "http://localhost:5173",
        process.env.NEXT_CLIENT_URL || "http://localhost:3001",
    ]);

    const corsOptions: CorsOptions = {
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }

            const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
            if (allowedOrigins.has(origin) || isLocalhost) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"],
    };

    app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
    app.use(cors(corsOptions));
    app.options("*", cors(corsOptions));
    app.use(morgan(isProd ? "combined" : "dev"));
    app.use(cookieParser());

    // Stripe webhook needs raw body — must be before express.json()
    app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }), paymentWebhookRouter);

    app.use(express.json({ limit: "1mb" }));
    app.use(express.urlencoded({ extended: true, limit: "1mb" }));

    const globalLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 300,
        standardHeaders: true,
        legacyHeaders: false,
        message: { success: false, message: "Too many requests, please try again later" },
    });

    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20,
        standardHeaders: true,
        legacyHeaders: false,
        message: { success: false, message: "Too many auth attempts, please try again later" },
    });

    app.use("/api/", globalLimiter);
    app.use("/api/v1/user/login", authLimiter);
    app.use("/api/v1/user/register", authLimiter);

    registerRoutes(app);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};
