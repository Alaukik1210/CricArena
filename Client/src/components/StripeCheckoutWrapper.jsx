import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PAYMENT_API_END_POINT, STRIPE_PUBLISHABLE_KEY } from "@/utils/constants";

const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const cardElementOptions = {
  style: {
    base: {
      color: "#f5efe3",
      fontFamily: "CabinetGrotesk-Medium, sans-serif",
      fontSize: "16px",
      "::placeholder": {
        color: "rgba(245, 239, 227, 0.45)",
      },
    },
    invalid: {
      color: "#cd725e",
    },
  },
};

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
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
        await axios.post(`${PAYMENT_API_END_POINT}/confirm-booking`, {
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
      <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
        <CardElement options={cardElementOptions} />
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-white/75">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-[#8bc78f]" />
          <p>After payment succeeds, the platform confirms your booking session and records the booking automatically.</p>
        </div>
      </div>

      {status ? (
        <div className="rounded-[20px] border border-[#cd725e]/30 bg-[#cd725e]/10 px-4 py-3 text-sm text-[#f5d1c7]">
          {status}
        </div>
      ) : null}

      <button type="submit" disabled={!stripe || loading} className="cta-primary w-full justify-center">
        <ArrowRight className="mr-2 h-4 w-4" />
        {loading ? "Processing Payment..." : "Pay And Confirm Booking"}
      </button>
    </form>
  );
}

CheckoutForm.propTypes = {
  clientSecret: PropTypes.string.isRequired,
};

export default function StripeCheckoutWrapper({ clientSecret }) {
  if (!clientSecret) {
    return <div className="muted-copy text-sm">Payment session not found.</div>;
  }

  if (!stripePromise) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm text-white/80">
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

StripeCheckoutWrapper.propTypes = {
  clientSecret: PropTypes.string.isRequired,
};
