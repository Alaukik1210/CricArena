import axios from "axios";
import { useEffect, useState } from "react";
import { ProductShell, RoleDashboard, SectionBlock, MetricCard } from "./ProductShell";
import { OWNER_ANALYTICS_API_END_POINT } from "@/utils/constants";

const ownerLinks = [
  { href: "/owner/analytics", label: "Overview" },
  { href: "/grounds", label: "Grounds" },
  { href: "/bookings", label: "Bookings" },
  { href: "/organizer/analytics", label: "Organizer View" },
];

export default function OwnerAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await axios.get(OWNER_ANALYTICS_API_END_POINT);
        setAnalytics(response.data.analytics);
      } catch (error) {
        console.error("Failed to load owner analytics:", error);
        setStatus("Could not load owner analytics right now.");
      }
    };

    loadAnalytics();
  }, []);

  const metrics = analytics
    ? [
        { label: "Grounds", value: `${analytics.totalGrounds}`, detail: "Active owner inventory" },
        { label: "Bookings", value: `${analytics.totalBookings}`, detail: "Combined booking count" },
        { label: "Revenue", value: `₹${Number(analytics.totalRevenue || 0).toLocaleString()}`, detail: "Tracked from successful bookings" },
        { label: "Focus", value: "Fill Better", detail: "Use demand and repeat behavior to optimize slots" },
      ]
    : [];

  return (
    <ProductShell
      kicker="Owner Dashboard"
      title="See occupancy, bookings, and revenue without guesswork."
      description="Owner analytics should help you improve business decisions fast, not just show raw numbers."
    >
      <RoleDashboard
        title="Owner Overview"
        description="A standard owner dashboard should reveal inventory quality, booking flow, and repeat revenue in one place."
        links={ownerLinks}
      >
        {status ? <div className="product-panel px-5 py-4 text-sm text-[#f0ddb0] md:px-6">{status}</div> : null}
        {analytics ? (
          <>
            <section className="product-grid-4">
              {metrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </section>
            <SectionBlock
              kicker="Ground Performance"
              title="Your portfolio at a glance"
              description="Directly useful information: which grounds are performing, where bookings are clustering, and where to intervene."
            >
              <div className="space-y-4">
                {(analytics.grounds || []).map((ground) => (
                  <article key={ground.id} className="product-card">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-cabinet-bold">{ground.name}</h3>
                        <p className="muted-copy mt-2 text-sm">
                          {ground.bookings} bookings • ₹{Number(ground.revenue || 0).toLocaleString()}
                        </p>
                      </div>
                      <span className="pill-gold">{ground.occupancyLabel}</span>
                    </div>
                  </article>
                ))}
              </div>
            </SectionBlock>
          </>
        ) : (
          <div className="product-card muted-copy">Loading owner analytics...</div>
        )}
      </RoleDashboard>
    </ProductShell>
  );
}
