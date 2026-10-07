import axios from "axios";
import { CalendarDays, CircleCheckBig, ReceiptText, Ticket } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ProductShell, SectionBlock, MetricCard } from "./ProductShell";
import { BOOKING_SESSION_API_END_POINT } from "@/utils/constants";

export default function BookingsHub() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BOOKING_SESSION_API_END_POINT}/mine`);
        setSessions(response.data.sessions || []);
      } catch (error) {
        console.error("Failed to load booking sessions:", error);
        setStatus("Could not load your booking history.");
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  const metrics = useMemo(
    () => [
      { label: "Booking Sessions", value: `${sessions.length}`, detail: "Created from the new booking-first flow" },
      {
        label: "Confirmed",
        value: `${sessions.filter((session) => session.status === "CONFIRMED").length}`,
        detail: "Payment completed and booking locked",
      },
      {
        label: "Pending Payment",
        value: `${sessions.filter((session) => session.status === "PAYMENT_PENDING").length}`,
        detail: "Sessions waiting for payment completion",
      },
      { label: "Best Next Step", value: "Book Faster", detail: "Use sessions to reduce checkout confusion" },
    ],
    [sessions],
  );

  return (
    <ProductShell
      kicker="Bookings"
      title="Track every booking from session to confirmation."
      description="This view is intentionally clean: what you tried to book, what got confirmed, and what still needs action."
      actions={
        <Link to="/grounds" className="cta-primary">
          <Ticket className="mr-2 h-4 w-4" />
          Book A Ground
        </Link>
      }
    >
      <section className="product-grid-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      {status ? <div className="product-panel px-5 py-4 text-sm text-[#f0ddb0] md:px-6">{status}</div> : null}

      <SectionBlock
        kicker="My Booking Sessions"
        title="One list, direct decisions"
        description="This is the standard booking history rhythm: status first, context second, next action obvious."
      >
        {loading ? (
          <div className="product-card muted-copy">Loading your booking sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="product-card muted-copy">
            You have not created any booking sessions yet. Start from Grounds to book a slot cleanly.
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <article key={session.id} className="product-card">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className={session.status === "CONFIRMED" ? "pill-accent" : "pill-gold"}>
                      {session.status.replaceAll("_", " ")}
                    </span>
                    <h3 className="mt-4 text-xl font-cabinet-bold">{session.ground?.name || "Ground booking"}</h3>
                    <p className="muted-copy mt-2 text-sm">
                      {session.ground?.location || "Location unavailable"} • ₹{Number(session.amount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="grid gap-2 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#d8b56d]" />
                      <span>
                        {session.startsAt ? new Date(session.startsAt).toLocaleString() : "Time pending"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ReceiptText className="h-4 w-4 text-[#d8b56d]" />
                      <span>{session.currency?.toUpperCase() || "INR"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CircleCheckBig className="h-4 w-4 text-[#8bc78f]" />
                      <span>{session.booking ? "Structured booking recorded" : "Awaiting final booking record"}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionBlock>
    </ProductShell>
  );
}
