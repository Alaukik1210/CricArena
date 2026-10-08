import { CalendarDays, CircleCheckBig, ReceiptText, Ticket } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageShell, Section, Stat } from "@/components/ui/page-shell";
import { api } from "@/lib/api";

interface BookingSession {
  id: string;
  status: string;
  amount?: number;
  currency?: string;
  startsAt?: string | null;
  ground?: { name?: string; location?: string } | null;
  booking?: unknown;
}

export default function BookingsHub() {
  const [sessions, setSessions] = useState<BookingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ sessions?: BookingSession[] }>("/booking-sessions/mine");
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
    <PageShell
      kicker="Bookings"
      title="Track every booking from session to confirmation."
      description="This view is intentionally clean: what you tried to book, what got confirmed, and what still needs action."
      actions={
        <Button asChild>
          <Link to="/grounds">
            <Ticket className="mr-2 h-4 w-4" />
            Book A Ground
          </Link>
        </Button>
      }
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Stat key={metric.label} {...metric} />
        ))}
      </section>

      {status ? (
        <div className="rounded border border-rule bg-surface px-5 py-4 text-sm text-pending md:px-6">{status}</div>
      ) : null}

      <Section
        kicker="My Booking Sessions"
        title="One list, direct decisions"
        description="This is the standard booking history rhythm: status first, context second, next action obvious."
      >
        {loading ? (
          <div className="rounded border border-rule bg-surface p-5 text-ink-soft">Loading your booking sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="rounded border border-rule bg-surface p-5 text-ink-soft">
            You have not created any booking sessions yet. Start from Grounds to book a slot cleanly.
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <article key={session.id} className="rounded border border-rule bg-surface p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <Badge tone={session.status === "CONFIRMED" ? "go" : "pending"}>
                      {session.status.replace(/_/g, " ")}
                    </Badge>
                    <h3 className="mt-4 font-body text-xl font-semibold">{session.ground?.name || "Ground booking"}</h3>
                    <p className="mt-2 text-sm text-ink-soft">
                      {session.ground?.location || "Location unavailable"} • ₹{Number(session.amount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="grid gap-2 text-sm text-ink-soft">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-pending" />
                      <span>
                        {session.startsAt ? new Date(session.startsAt).toLocaleString() : "Time pending"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ReceiptText className="h-4 w-4 text-pending" />
                      <span>{session.currency?.toUpperCase() || "INR"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CircleCheckBig className="h-4 w-4 text-go" />
                      <span>{session.booking ? "Structured booking recorded" : "Awaiting final booking record"}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
