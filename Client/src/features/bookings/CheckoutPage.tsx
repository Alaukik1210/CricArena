import { useLocation, useNavigate } from "react-router-dom";
import { CalendarClock, MapPin, ShieldCheck, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, Section } from "@/components/ui/page-shell";
import StripeCheckoutWrapper from "./StripeCheckoutWrapper";

interface CheckoutState {
  clientSecret?: string;
  ground?: {
    id?: string;
    name?: string;
    price?: number;
    location?: string;
    pitchType?: string;
  };
  bookingSessionId?: string;
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientSecret, ground, bookingSessionId } = (location.state as CheckoutState | null) || {};

  if (!clientSecret) {
    return (
      <PageShell
        kicker="Checkout"
        title="No active payment session was found."
        description="Start again from live grounds so the system can create a booking session and attach payment correctly."
        actions={
          <Button type="button" onClick={() => navigate("/grounds")}>
            <Ticket className="mr-2 h-4 w-4" />
            Back To Grounds
          </Button>
        }
      >
        <Section
          kicker="Booking State"
          title="Nothing is lost"
          description="You just do not have a current payment intent on this page. Open a ground card and restart from there."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      kicker="Checkout"
      title="Complete your booking with one clear payment step."
      description="The booking session is already created. Payment confirmation will finalize the structured booking and send you to your booking history."
    >
      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
        <Section
          kicker="Booking Summary"
          title={ground?.name || "Ground booking"}
          description="Review the essentials before you pay."
        >
          <div className="space-y-4">
            <div className="rounded border border-rule bg-surface p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-soft">Amount</p>
              <p className="font-display text-3xl text-ink">
                ₹{Number(ground?.price || 0).toLocaleString()}
              </p>
            </div>

            <div className="space-y-3 rounded border border-rule bg-surface p-5">
              <div className="flex items-center gap-3 text-sm text-ink-soft">
                <MapPin className="h-4 w-4 text-pending" />
                <span>{ground?.location || "Location will be attached to the booking."}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-ink-soft">
                <CalendarClock className="h-4 w-4 text-pending" />
                <span>{ground?.pitchType || "Standard cricket ground booking"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-ink-soft">
                <ShieldCheck className="h-4 w-4 text-go" />
                <span>Booking session linked: {bookingSessionId ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </Section>

        <Section
          kicker="Payment"
          title="Secure checkout"
          description="Pay once. On success, the system confirms the booking session and moves it into your booking history."
        >
          <StripeCheckoutWrapper clientSecret={clientSecret} bookingSessionId={bookingSessionId} />
        </Section>
      </div>
    </PageShell>
  );
}
