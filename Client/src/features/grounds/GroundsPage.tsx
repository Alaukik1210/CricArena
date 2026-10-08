import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Check, LocateFixed, MapPin, StarIcon, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageShell, Section, Stat } from "@/components/ui/page-shell";
import { ApiError, api } from "@/lib/api";
import { useAppSelector } from "@/redux/store";

interface RawGround {
  id: string | null;
  name: string;
  location: string;
  rating?: number;
  bookings?: number;
  facilities?: string[] | string;
  pricePerMatch: number;
  pitchType?: string;
  tag?: string;
}

interface Ground extends Omit<RawGround, "facilities"> {
  facilities: string[];
  tag: string;
  isBookable: boolean;
}

interface BookingSessionResponse {
  session?: { id?: string };
}

interface PaymentIntentResponse {
  clientSecret?: string;
}

const fallbackGrounds: RawGround[] = [
  {
    id: null,
    name: "Sunrise Cricket Ground",
    location: "Sector 21, New Delhi",
    rating: 4.5,
    bookings: 120,
    facilities: ["Floodlights", "Parking", "Changing Rooms"],
    pricePerMatch: 2500,
    pitchType: "Matting",
    tag: "Preview",
  },
  {
    id: null,
    name: "Greenfield Arena",
    location: "MG Road, Bengaluru",
    rating: 4.2,
    bookings: 98,
    facilities: ["Seating", "Cafeteria", "Restrooms"],
    pricePerMatch: 2000,
    pitchType: "Turf",
    tag: "Preview",
  },
  {
    id: null,
    name: "Victory Sports Complex",
    location: "Andheri, Mumbai",
    rating: 4.8,
    bookings: 150,
    facilities: ["Floodlights", "Parking", "First Aid"],
    pricePerMatch: 3000,
    pitchType: "Hybrid",
    tag: "Preview",
  },
];

const toGroundView = (ground: RawGround): Ground => ({
  ...ground,
  facilities: Array.isArray(ground.facilities)
    ? ground.facilities
    : typeof ground.facilities === "string"
      ? ground.facilities.split(",").map((entry) => entry.trim()).filter(Boolean)
      : [],
  tag: ground.tag || (ground.id ? "Live" : "Preview"),
  isBookable: Boolean(ground.id),
});

export default function GroundsPage() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingGroundId, setProcessingGroundId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const user = useAppSelector((store) => store.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ grounds?: RawGround[] }>("/ground/all");
        const liveGrounds = response.data?.grounds?.length
          ? response.data.grounds.map(toGroundView)
          : fallbackGrounds.map(toGroundView);
        setGrounds(liveGrounds);
        if (!response.data?.grounds?.length) {
          setStatus("Live owner grounds are not available yet, so you are seeing preview inventory.");
        }
      } catch (error) {
        console.error("Error fetching grounds:", error);
        setGrounds(fallbackGrounds.map(toGroundView));
        setStatus("Could not load live grounds right now, so preview inventory is shown.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrounds();
  }, []);

  const metrics = useMemo(
    () => [
      { label: "Grounds", value: `${grounds.length}`, detail: "Inventory currently visible in the product" },
      { label: "Live Bookable", value: `${grounds.filter((ground) => ground.isBookable).length}`, detail: "Ready for booking session and payment flow" },
      { label: "Average Price", value: `₹${grounds.length ? Math.round(grounds.reduce((sum, ground) => sum + Number(ground.pricePerMatch || 0), 0) / grounds.length).toLocaleString() : 0}`, detail: "Useful benchmark for quick decisions" },
      { label: "Flow", value: "Book Cleanly", detail: "Ground to session to payment to confirmation" },
    ],
    [grounds],
  );

  const handleBook = async (ground: Ground) => {
    if (!user?.id) {
      setStatus("Please login first to create a booking session.");
      navigate("/login");
      return;
    }

    if (!ground.id) {
      setStatus("This card is only a preview. Add a real owner ground to enable booking.");
      return;
    }

    try {
      setProcessingGroundId(ground.id);
      setStatus("");

      const bookingSessionResponse = await api.post<BookingSessionResponse>("/booking-sessions", {
        groundId: ground.id,
        amount: Number(ground.pricePerMatch),
      });

      const bookingSession = bookingSessionResponse.data?.session;

      const response = await api.post<PaymentIntentResponse>(
        "/payment/create-payment-intent",
        {
          amount: Number(ground.pricePerMatch) * 100,
          currency: "inr",
          metadata: {
            groundId: ground.id,
            groundName: ground.name,
            groundLocation: ground.location,
            bookingSessionId: bookingSession?.id,
            userId: user?.id,
          },
        },
        { timeout: 10000 },
      );

      const clientSecret = response.data?.clientSecret;

      if (!clientSecret) {
        setStatus("Could not start payment right now. Please try again.");
        return;
      }

      navigate("/checkout", {
        state: {
          clientSecret,
          ground: {
            id: ground.id,
            name: ground.name,
            price: Number(ground.pricePerMatch),
            location: ground.location,
            pitchType: ground.pitchType,
          },
          bookingSessionId: bookingSession?.id,
        },
      });
    } catch (error) {
      console.error("Error creating payment session:", error);

      // The shared api client wraps failures in ApiError, which carries the
      // HTTP status (0 when no response arrived) and the server message.
      const apiError = error instanceof ApiError ? error : null;

      if (apiError?.status === 0 && /timeout/i.test(apiError.message)) {
        setStatus("The payment request timed out. Please try again.");
      } else if (apiError?.status === 401) {
        setStatus("Your session expired. Please login and try again.");
        navigate("/login");
      } else {
        setStatus(apiError?.message || "Could not create the booking session.");
      }
    } finally {
      setProcessingGroundId(null);
    }
  };

  return (
    <PageShell
      kicker="Ground Booking"
      title="Choose a ground and move into checkout without confusion."
      description="This booking flow is designed to stay direct on mobile and desktop: clear card, one action, one payment path."
      actions={
        <Button type="button" variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <LocateFixed className="mr-2 h-4 w-4" />
          Focus Top
        </Button>
      }
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Stat key={metric.label} {...metric} />
        ))}
      </section>

      {status ? (
        <div className="rounded border border-rule bg-surface px-5 py-4 text-sm text-pending md:px-6">
          {status}
        </div>
      ) : null}

      <Section
        kicker="Available Grounds"
        title="Bookable inventory with direct value"
        description="The card tells you what matters first: location, trust signals, facilities, and whether checkout is live."
      >
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse rounded border border-rule bg-surface p-5">
                <div className="h-40 rounded bg-surface-sunk" />
                <div className="mt-5 space-y-3">
                  <div className="h-4 w-2/3 rounded bg-surface-sunk" />
                  <div className="h-3 w-1/2 rounded bg-surface-sunk" />
                  <div className="h-3 w-full rounded bg-surface-sunk" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {grounds.map((ground) => (
              <article key={`${ground.name}-${ground.location}`} className="rounded border border-rule bg-surface p-5">
                <div className="relative overflow-hidden rounded border border-rule-soft">
                  <img
                    src="https://www.shutterstock.com/image-vector/night-cricket-stadium-illustration-vector-600nw-2160100275.jpg"
                    alt={ground.name}
                    className="h-44 w-full object-cover"
                  />
                  <Badge tone={ground.isBookable ? "pending" : "neutral"} className="absolute right-4 top-4">
                    {ground.tag}
                  </Badge>
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-body text-xl font-semibold text-ink">{ground.name}</h3>
                    <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
                      <MapPin className="h-4 w-4 text-pending" />
                      {ground.location}
                    </p>
                  </div>
                  <Badge tone="pending">{ground.pitchType || "Cricket Ground"}</Badge>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
                  <div className="flex items-center gap-1 text-pending">
                    {[...Array(Math.max(1, Math.floor(Number(ground.rating || 0))))].map((_, index) => (
                      <StarIcon key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span>{Number(ground.rating || 0).toFixed(1)}</span>
                  <span className="text-ink-faint">•</span>
                  <span>{ground.bookings || 0} bookings</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {ground.facilities.length > 0 ? (
                    ground.facilities.slice(0, 4).map((facility) => (
                      <span key={facility} className="inline-flex items-center gap-2 rounded border border-rule-soft bg-surface-sunk px-3 py-2 text-xs text-ink-soft">
                        <Check className="h-3.5 w-3.5 text-go" />
                        {facility}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-ink-soft">Facilities not added yet.</span>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-ink-soft">Match Price</p>
                    <p className="font-display text-2xl text-ink">
                      ₹{Number(ground.pricePerMatch || 0).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={ground.isBookable ? "default" : "outline"}
                    className={ground.isBookable ? undefined : "opacity-80"}
                    disabled={processingGroundId === ground.id}
                    onClick={() => handleBook(ground)}
                  >
                    {processingGroundId === ground.id ? (
                      <>
                        <CalendarClock className="mr-2 h-4 w-4" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Ticket className="mr-2 h-4 w-4" />
                        {ground.isBookable ? "Book Ground" : "Preview Only"}
                      </>
                    )}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
