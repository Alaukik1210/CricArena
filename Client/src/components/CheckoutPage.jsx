import { useLocation, useNavigate } from "react-router-dom";
import { CalendarClock, MapPin, ShieldCheck, Ticket } from "lucide-react";
import StripeCheckoutWrapper from "./StripeCheckoutWrapper";
import { ProductShell, SectionBlock } from "./ProductShell";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientSecret, ground, bookingSessionId } = location.state || {};

  if (!clientSecret) {
    return (
      <ProductShell
        kicker="Checkout"
        title="No active payment session was found."
        description="Start again from live grounds so the system can create a booking session and attach payment correctly."
        actions={
          <button type="button" className="cta-primary" onClick={() => navigate("/grounds")}>
            <Ticket className="mr-2 h-4 w-4" />
            Back To Grounds
          </button>
        }
      >
        <SectionBlock
          kicker="Booking State"
          title="Nothing is lost"
          description="You just do not have a current payment intent on this page. Open a ground card and restart from there."
        />
      </ProductShell>
    );
  }

  return (
    <ProductShell
      kicker="Checkout"
      title="Complete your booking with one clear payment step."
      description="The booking session is already created. Payment confirmation will finalize the structured booking and send you to your booking history."
    >
      <div className="product-grid-2">
        <SectionBlock
          kicker="Booking Summary"
          title={ground?.name || "Ground booking"}
          description="Review the essentials before you pay."
        >
          <div className="space-y-4">
            <div className="product-card">
              <p className="section-kicker">Amount</p>
              <p className="text-3xl font-cabinet-black text-white">
                ₹{Number(ground?.price || 0).toLocaleString()}
              </p>
            </div>

            <div className="product-card space-y-3">
              <div className="flex items-center gap-3 text-sm text-white/80">
                <MapPin className="h-4 w-4 text-[#d8b56d]" />
                <span>{ground?.location || "Location will be attached to the booking."}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <CalendarClock className="h-4 w-4 text-[#d8b56d]" />
                <span>{ground?.pitchType || "Standard cricket ground booking"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <ShieldCheck className="h-4 w-4 text-[#8bc78f]" />
                <span>Booking session linked: {bookingSessionId ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          kicker="Payment"
          title="Secure checkout"
          description="Pay once. On success, the system confirms the booking session and moves it into your booking history."
        >
          <StripeCheckoutWrapper clientSecret={clientSecret} bookingSessionId={bookingSessionId} />
        </SectionBlock>
      </div>
    </ProductShell>
  );
}
