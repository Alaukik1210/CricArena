import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CalendarClock, Check, LocateFixed, MapPin, StarIcon, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BOOKING_SESSION_API_END_POINT, GROUND_API_END_POINT, PAYMENT_API_END_POINT } from "@/utils/constants";
import { MetricCard, ProductShell, SectionBlock } from "./ProductShell";

const fallbackGrounds = [
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

const toGroundView = (ground) => ({
  ...ground,
  facilities: Array.isArray(ground.facilities)
    ? ground.facilities
    : typeof ground.facilities === "string"
      ? ground.facilities.split(",").map((entry) => entry.trim()).filter(Boolean)
      : [],
  tag: ground.tag || (ground.id ? "Live" : "Preview"),
  isBookable: Boolean(ground.id),
});

export default function Grounds() {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingGroundId, setProcessingGroundId] = useState(null);
  const [status, setStatus] = useState("");
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${GROUND_API_END_POINT}/all`);
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

  const handleBook = async (ground) => {
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

      const bookingSessionResponse = await axios.post(BOOKING_SESSION_API_END_POINT, {
        groundId: ground.id,
        amount: Number(ground.pricePerMatch),
      });

      const bookingSession = bookingSessionResponse.data?.session;

      const response = await axios.post(
        `${PAYMENT_API_END_POINT}/create-payment-intent`,
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

      if (error.code === "ECONNABORTED") {
        setStatus("The payment request timed out. Please try again.");
      } else if (error.response?.status === 401) {
        setStatus("Your session expired. Please login and try again.");
        navigate("/login");
      } else {
        setStatus(error.response?.data?.message || "Could not create the booking session.");
      }
    } finally {
      setProcessingGroundId(null);
    }
  };

  return (
    <ProductShell
      kicker="Ground Booking"
      title="Choose a ground and move into checkout without confusion."
      description="This booking flow is designed to stay direct on mobile and desktop: clear card, one action, one payment path."
      actions={
        <button type="button" className="cta-secondary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <LocateFixed className="mr-2 h-4 w-4" />
          Focus Top
        </button>
      }
    >
      <section className="product-grid-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      {status ? (
        <div className="product-panel px-5 py-4 text-sm text-[#f0ddb0] md:px-6">
          {status}
        </div>
      ) : null}

      <SectionBlock
        kicker="Available Grounds"
        title="Bookable inventory with direct value"
        description="The card tells you what matters first: location, trust signals, facilities, and whether checkout is live."
      >
        {loading ? (
          <div className="product-grid-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="product-card animate-pulse">
                <div className="h-40 rounded-[24px] bg-white/5" />
                <div className="mt-5 space-y-3">
                  <div className="h-4 w-2/3 rounded bg-white/5" />
                  <div className="h-3 w-1/2 rounded bg-white/5" />
                  <div className="h-3 w-full rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid-3">
            {grounds.map((ground) => (
              <article key={`${ground.name}-${ground.location}`} className="product-card">
                <div className="relative overflow-hidden rounded-[24px] border border-white/10">
                  <img
                    src="https://www.shutterstock.com/image-vector/night-cricket-stadium-illustration-vector-600nw-2160100275.jpg"
                    alt={ground.name}
                    className="h-44 w-full object-cover"
                  />
                  <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${ground.isBookable ? "bg-[#d8b56d] text-black" : "bg-white/90 text-black"}`}>
                    {ground.tag}
                  </span>
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-cabinet-bold text-white">{ground.name}</h3>
                    <p className="muted-copy mt-2 flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-[#d8b56d]" />
                      {ground.location}
                    </p>
                  </div>
                  <span className="pill-gold">{ground.pitchType || "Cricket Ground"}</span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
                  <div className="flex items-center gap-1 text-[#d8b56d]">
                    {[...Array(Math.max(1, Math.floor(Number(ground.rating || 0))))].map((_, index) => (
                      <StarIcon key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span>{Number(ground.rating || 0).toFixed(1)}</span>
                  <span className="text-white/30">•</span>
                  <span>{ground.bookings || 0} bookings</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {ground.facilities.length > 0 ? (
                    ground.facilities.slice(0, 4).map((facility) => (
                      <span key={facility} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
                        <Check className="h-3.5 w-3.5 text-[#8bc78f]" />
                        {facility}
                      </span>
                    ))
                  ) : (
                    <span className="muted-copy text-sm">Facilities not added yet.</span>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="section-kicker mb-1">Match Price</p>
                    <p className="text-2xl font-cabinet-black text-white">
                      ₹{Number(ground.pricePerMatch || 0).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={ground.isBookable ? "cta-primary" : "cta-secondary opacity-80"}
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
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionBlock>
    </ProductShell>
  );
}
