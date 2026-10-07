import { Express } from "express";
import userRouter from "../routes/user.routes";
import tour from "../routes/TourDetails.route";
import team from "../routes/team.routes";
import profile from "../routes/P_profile.routes";
import ownerProfile from "../routes/O_profile";
import ground from "../routes/ground.route";
import payment from "../routes/payment.route";
import playRoomRoutes from "../modules/play-rooms/play-room.routes";
import discoveryRoutes from "../modules/discovery/discovery.routes";
import bookingSessionRoutes from "../modules/bookings/booking-session.routes";
import analyticsRoutes from "../modules/analytics/analytics.routes";
import { upsertAvailability } from "../modules/discovery/discovery.controller";
import { authentication, requireRole } from "../middleware/auth";
import {
    getAdminAnalytics,
    getOrganizerAnalytics,
    getOwnerAnalytics,
} from "../modules/analytics/analytics.controller";
import { Role } from "@prisma/client";

export const registerRoutes = (app: Express) => {
    app.get("/api/v1/health", (_req, res) => {
        res.status(200).json({
            success: true,
            service: "CricArena API",
        });
    });

    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/ground", ground);
    app.use("/api/v1/owner/tours", tour);
    app.use("/api/v1/user/team", team);
    app.use("/api/v1/user/profile", profile);
    app.use("/api/v1/owner/profile", ownerProfile);
    app.use("/api/v1/payment", payment);

    app.use("/api/v1/play-rooms", playRoomRoutes);
    app.use("/api/v1/discovery", discoveryRoutes);
    app.post("/api/v1/availability", authentication, upsertAvailability);
    app.use("/api/v1/booking-sessions", bookingSessionRoutes);
    app.use("/api/v1/analytics", analyticsRoutes);
    app.get("/api/v1/owner/analytics", authentication, requireRole(Role.OWNER, Role.ADMIN), getOwnerAnalytics);
    app.get("/api/v1/organizer/analytics", authentication, requireRole(Role.OWNER, Role.ADMIN), getOrganizerAnalytics);
    app.get("/api/v1/admin/analytics", authentication, requireRole(Role.ADMIN), getAdminAnalytics);
};
