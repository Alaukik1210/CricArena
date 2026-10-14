import { describe, it, expect } from "vitest";
import { computeGroundRevenue } from "./analytics.service";

// UNITS. Every `amount` below is INTEGER PAISE, because that is what both
// GroundBooking.amount and PaymentRecord.amount hold - both are written from
// Stripe's `paymentIntent.amount`. `computeGroundRevenue` returns RUPEES.
// A 2,500 rupee booking is therefore the input 250000 and the output 2500.

describe("computeGroundRevenue", () => {
    it("returns rupees, converting from the paise stored in the database", () => {
        const result = computeGroundRevenue({
            bookingRecords: [{ amount: 250000, paymentIntentId: "pi_legacy_only" }],
            structuredBookings: [],
        });
        expect(result).toEqual({ bookings: 1, revenue: 2500 });
    });

    it("counts a legacy row and its structured twin as one booking at one amount", () => {
        // The headline case: `confirm-booking` writes a GroundBooking AND a
        // Booking + PaymentRecord for the SAME Stripe payment intent, inside
        // one transaction. That is one 2,500 rupee booking, not two.
        const result = computeGroundRevenue({
            bookingRecords: [{ amount: 250000, paymentIntentId: "pi_shared" }],
            structuredBookings: [
                {
                    payments: [
                        { amount: 250000, status: "SUCCEEDED", paymentIntentId: "pi_shared" },
                    ],
                },
            ],
        });
        expect(result).toEqual({ bookings: 1, revenue: 2500 });
    });

    it("keeps a legacy row that has no structured twin alongside a structured booking", () => {
        // A genuine historical GroundBooking, written before the structured
        // tables existed, must still count.
        const result = computeGroundRevenue({
            bookingRecords: [{ amount: 100000, paymentIntentId: "pi_historical" }],
            structuredBookings: [
                {
                    payments: [
                        { amount: 200000, status: "SUCCEEDED", paymentIntentId: "pi_structured" },
                    ],
                },
            ],
        });
        expect(result).toEqual({ bookings: 2, revenue: 3000 });
    });

    it("counts legacy GroundBooking revenue", () => {
        const result = computeGroundRevenue({
            bookingRecords: [
                { amount: 500000, paymentIntentId: "pi_a" },
                { amount: 300000, paymentIntentId: "pi_b" },
            ],
            structuredBookings: [],
        });
        expect(result.revenue).toBe(8000);
        expect(result.bookings).toBe(2);
    });

    it("counts structured Booking revenue from SUCCEEDED payments", () => {
        const result = computeGroundRevenue({
            bookingRecords: [],
            structuredBookings: [
                { payments: [{ amount: 400000, status: "SUCCEEDED", paymentIntentId: "pi_c" }] },
                { payments: [{ amount: 250000, status: "SUCCEEDED", paymentIntentId: "pi_d" }] },
            ],
        });
        expect(result.revenue).toBe(6500);
        expect(result.bookings).toBe(2);
    });

    it("ignores failed and pending payments", () => {
        const result = computeGroundRevenue({
            bookingRecords: [],
            structuredBookings: [
                { payments: [{ amount: 400000, status: "FAILED", paymentIntentId: "pi_e" }] },
                {
                    payments: [
                        { amount: 100000, status: "REQUIRES_ACTION", paymentIntentId: "pi_f" },
                    ],
                },
                { payments: [{ amount: 200000, status: "SUCCEEDED", paymentIntentId: "pi_g" }] },
            ],
        });
        expect(result.revenue).toBe(2000);
        expect(result.bookings).toBe(3);
    });

    it("excludes refunded and processing payments, so revenue is net of refunds", () => {
        const result = computeGroundRevenue({
            bookingRecords: [],
            structuredBookings: [
                { payments: [{ amount: 500000, status: "REFUNDED", paymentIntentId: "pi_h" }] },
                { payments: [{ amount: 300000, status: "PROCESSING", paymentIntentId: "pi_i" }] },
                { payments: [{ amount: 150000, status: "SUCCEEDED", paymentIntentId: "pi_j" }] },
            ],
        });
        // Deliberate: a refunded payment contributes nothing, so the owner
        // dashboard reports revenue net of refunds. If that product decision
        // ever changes, this test should be the thing that fails.
        expect(result.revenue).toBe(1500);
        // All three are still bookings that happened.
        expect(result.bookings).toBe(3);
    });

    it("de-duplicates on the payment intent even when the structured payment failed", () => {
        // The duplicate is structural - both rows exist because one payment
        // was written twice - so it is removed regardless of payment status.
        // The structured booking survives, failed, contributing no revenue.
        const result = computeGroundRevenue({
            bookingRecords: [{ amount: 250000, paymentIntentId: "pi_failed_twin" }],
            structuredBookings: [
                {
                    payments: [
                        { amount: 250000, status: "FAILED", paymentIntentId: "pi_failed_twin" },
                    ],
                },
            ],
        });
        expect(result).toEqual({ bookings: 1, revenue: 0 });
    });

    it("keeps legacy rows when a structured payment has no payment intent id", () => {
        // A PaymentRecord with a null paymentIntentId can never be shown to be
        // the twin of a legacy row, so nothing is de-duplicated.
        const result = computeGroundRevenue({
            bookingRecords: [{ amount: 100000, paymentIntentId: "pi_unmatched" }],
            structuredBookings: [
                { payments: [{ amount: 200000, status: "SUCCEEDED", paymentIntentId: null }] },
            ],
        });
        expect(result).toEqual({ bookings: 2, revenue: 3000 });
    });

    it("counts a structured booking with no payments as a booking worth nothing", () => {
        const result = computeGroundRevenue({
            bookingRecords: [],
            structuredBookings: [{ payments: [] }],
        });
        expect(result).toEqual({ bookings: 1, revenue: 0 });
    });

    it("rounds rupees to two decimal places", () => {
        // 1 paisa is a hundredth of a rupee; three of them must not come back
        // as 0.030000000000000002.
        const result = computeGroundRevenue({
            bookingRecords: [
                { amount: 1, paymentIntentId: "pi_k" },
                { amount: 1, paymentIntentId: "pi_l" },
                { amount: 1, paymentIntentId: "pi_m" },
            ],
            structuredBookings: [],
        });
        expect(result.revenue).toBe(0.03);
    });

    it("returns zeroes for a ground with no bookings", () => {
        const result = computeGroundRevenue({ bookingRecords: [], structuredBookings: [] });
        expect(result).toEqual({ bookings: 0, revenue: 0 });
    });
});
