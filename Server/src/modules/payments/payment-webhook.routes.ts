import { BookingSessionStatus, BookingStatus, PaymentRecordStatus } from "@prisma/client";
import { Router, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../../shared/db/prisma";

const router = Router();

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: "2025-08-27.basil",
      })
    : null;

router.post("/", async (req, res: Response) => {
    try {
        const signature = req.headers["stripe-signature"];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event: Stripe.Event | null = null;

        if (stripe && webhookSecret && signature && Buffer.isBuffer(req.body)) {
            event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
        } else if (typeof req.body === "object") {
            event = req.body as Stripe.Event;
        }

        if (!event) {
            res.status(400).json({
                success: false,
                message: "Invalid webhook payload",
            });
            return;
        }

        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const bookingSessionId = paymentIntent.metadata?.bookingSessionId;

            if (bookingSessionId) {
                const session = await prisma.bookingSession.update({
                    where: { id: bookingSessionId },
                    data: {
                        status: BookingSessionStatus.CONFIRMED,
                        paymentIntentId: paymentIntent.id,
                    },
                });

                await prisma.booking.upsert({
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

                await prisma.paymentRecord.upsert({
                    where: {
                        providerPaymentId: paymentIntent.id,
                    },
                    update: {
                        paymentIntentId: paymentIntent.id,
                        status: PaymentRecordStatus.SUCCEEDED,
                        amount: paymentIntent.amount,
                        currency: paymentIntent.currency,
                        userId: session.userId,
                    },
                    create: {
                        userId: session.userId,
                        bookingId: null,
                        amount: paymentIntent.amount,
                        currency: paymentIntent.currency,
                        providerPaymentId: paymentIntent.id,
                        paymentIntentId: paymentIntent.id,
                        status: PaymentRecordStatus.SUCCEEDED,
                        metadata: paymentIntent.metadata,
                    },
                });
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Webhook handling failed",
        });
    }
});

export default router;
