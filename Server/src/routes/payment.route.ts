import { BookingSessionStatus, BookingStatus, PaymentRecordStatus } from "@prisma/client";
import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { authentication, authRequest } from "../middleware/auth";
import { prisma } from "../shared/db/prisma";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil", // or the latest available
});

// POST /api/v1/payment/create-payment-intent
router.post("/create-payment-intent", authentication, async (req: authRequest, res: Response): Promise<void> => {
  try {
    const { amount, currency, metadata } = req.body;

    if (!amount || !currency) {
      res.status(400).json({ error: "Amount and currency are required" });
      return;
    }

    // Stripe expects amount in the smallest unit (e.g., cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        groundId: metadata?.groundId || "",
        groundName: metadata?.groundName || "",
        groundLocation: metadata?.groundLocation || "",
        bookingSessionId: metadata?.bookingSessionId || "",
        userId: req.userId || metadata?.userId || "",
      },
      automatic_payment_methods: { enabled: true },
    });

    if (metadata?.bookingSessionId) {
      await prisma.bookingSession.update({
        where: { id: metadata.bookingSessionId },
        data: {
          paymentIntentId: paymentIntent.id,
          status: BookingSessionStatus.PAYMENT_PENDING,
        },
      });
    }

    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/payment/confirm-booking
router.post("/confirm-booking", authentication, async (req: authRequest, res: Response): Promise<void> => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      res.status(400).json({
        success: false,
        message: "paymentIntentId is required",
      });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      res.status(400).json({
        success: false,
        message: "Payment is not successful",
      });
      return;
    }

    const existingBooking = await prisma.groundBooking.findUnique({
      where: { paymentIntentId },
    });

    if (existingBooking) {
      res.status(200).json({
        success: true,
        message: "Booking already persisted",
        booking: existingBooking,
      });
      return;
    }

    const groundId = paymentIntent.metadata?.groundId;
    const bookingSessionId = paymentIntent.metadata?.bookingSessionId || null;
    const userId = req.userId || paymentIntent.metadata?.userId || null;

    if (!groundId) {
      res.status(400).json({
        success: false,
        message: "groundId metadata is required to persist booking",
      });
      return;
    }

    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.groundBooking.create({
        data: {
          paymentIntentId,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          groundId,
          userId,
        },
      });

      if (bookingSessionId && userId) {
        await tx.bookingSession.update({
          where: { id: bookingSessionId },
          data: {
            status: BookingSessionStatus.CONFIRMED,
            paymentIntentId,
          },
        });

        const session = await tx.bookingSession.findUnique({
          where: { id: bookingSessionId },
        });

        if (session) {
          const structuredBooking = await tx.booking.upsert({
            where: {
              bookingSessionId: session.id,
            },
            update: {
              status: BookingStatus.CONFIRMED,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
            },
            create: {
              userId: session.userId,
              groundId: session.groundId,
              slotId: session.slotId,
              bookingSessionId: session.id,
              status: BookingStatus.CONFIRMED,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              startsAt: session.startsAt,
              endsAt: session.endsAt,
            },
          });

          await tx.paymentRecord.upsert({
            where: { providerPaymentId: paymentIntent.id },
            update: {
              bookingId: structuredBooking.id,
              userId: session.userId,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              paymentIntentId,
              status: PaymentRecordStatus.SUCCEEDED,
            },
            create: {
              bookingId: structuredBooking.id,
              userId: session.userId,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              providerPaymentId: paymentIntent.id,
              paymentIntentId,
              status: PaymentRecordStatus.SUCCEEDED,
              metadata: paymentIntent.metadata,
            },
          });
        }
      }

      await tx.ground.update({
        where: { id: groundId },
        data: {
          bookings: {
            increment: 1,
          },
        },
      });

      return created;
    });

    res.status(200).json({
      success: true,
      message: "Booking confirmed and persisted",
      booking,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

export default router;
