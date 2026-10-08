import { loadStripe } from "@stripe/stripe-js";
import type { StripeCardElementOptions } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { STRIPE_PUBLISHABLE_KEY } from "@/utils/constants";
import { stripeCardStyle } from "@/design/stripe-appearance";

const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const cardElementOptions: StripeCardElementOptions = {
  style: stripeCardStyle,
};

interface CheckoutFormProps {
  clientSecret: string;
}

function CheckoutForm({ clientSecret }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setStatus("");

    const card = elements.getElement(CardElement);

    if (!card) {
      setStatus("Could not load the card form. Please refresh and try again.");
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      setLoading(false);
      setStatus(result.error.message || "Payment could not be completed.");
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      try {
        await api.post("/payment/confirm-booking", {
          paymentIntentId: result.paymentIntent.id,
        });
        navigate("/bookings");
      } catch (error) {
        console.error("Booking persistence failed:", error);
        setStatus("Payment succeeded, but booking confirmation needs support review.");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(false);
    setStatus("Payment is still pending. Please wait or try again.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded border border-rule bg-surface p-5">
        <CardElement options={cardElementOptions} />
      </div>

      <div className="rounded border border-rule-soft bg-surface-sunk p-4 text-sm text-ink-soft">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-go" />
          <p>After payment succeeds, the platform confirms your booking session and records the booking automatically.</p>
        </div>
      </div>

      {status ? (
        <div className="rounded border border-urgent bg-surface px-4 py-3 text-sm text-urgent">
          {status}
        </div>
      ) : null}

      <Button type="submit" disabled={!stripe || loading} className="w-full justify-center">
        <ArrowRight className="mr-2 h-4 w-4" />
        {loading ? "Processing Payment..." : "Pay And Confirm Booking"}
      </Button>
    </form>
  );
}

interface StripeCheckoutWrapperProps {
  clientSecret: string;
  // CheckoutPage passes this, but the wrapper has never read it. It is
  // declared only so the call site type-checks; do not wire it up here.
  bookingSessionId?: string;
}

export default function StripeCheckoutWrapper({ clientSecret }: StripeCheckoutWrapperProps) {
  if (!clientSecret) {
    return <div className="text-sm text-ink-soft">Payment session not found.</div>;
  }

  if (!stripePromise) {
    return (
      <div className="rounded border border-rule bg-surface p-5 text-sm text-ink-soft">
        Stripe is not configured yet. Add `VITE_STRIPE_PUBLISHABLE_KEY` to the client environment.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}
