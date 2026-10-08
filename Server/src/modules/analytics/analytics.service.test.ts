import { describe, it, expect } from "vitest";
import { computeGroundRevenue } from "./analytics.service";

describe("computeGroundRevenue", () => {
    it("counts legacy GroundBooking revenue", () => {
        const result = computeGroundRevenue({
            bookingRecords: [{ amount: 5000 }, { amount: 3000 }],
            structuredBookings: [],
        });
        expect(result.revenue).toBe(8000);
        expect(result.bookings).toBe(2);
    });

    // This is the regression this task exists to fix.
    it("counts structured Booking revenue from SUCCEEDED payments", () => {
        const result = computeGroundRevenue({
            bookingRecords: [],
            structuredBookings: [
                { payments: [{ amount: 4000, status: "SUCCEEDED" }] },
                { payments: [{ amount: 2500, status: "SUCCEEDED" }] },
            ],
        });
        expect(result.revenue).toBe(6500);
        expect(result.bookings).toBe(2);
    });

    it("ignores failed and pending payments", () => {
        const result = computeGroundRevenue({
            bookingRecords: [],
            structuredBookings: [
                { payments: [{ amount: 4000, status: "FAILED" }] },
                { payments: [{ amount: 1000, status: "REQUIRES_ACTION" }] },
                { payments: [{ amount: 2000, status: "SUCCEEDED" }] },
            ],
        });
        expect(result.revenue).toBe(2000);
    });

    it("sums legacy and structured revenue together", () => {
        const result = computeGroundRevenue({
            bookingRecords: [{ amount: 1000 }],
            structuredBookings: [{ payments: [{ amount: 2000, status: "SUCCEEDED" }] }],
        });
        expect(result.revenue).toBe(3000);
        expect(result.bookings).toBe(2);
    });

    it("returns zeroes for a ground with no bookings", () => {
        const result = computeGroundRevenue({ bookingRecords: [], structuredBookings: [] });
        expect(result).toEqual({ bookings: 0, revenue: 0 });
    });
});
