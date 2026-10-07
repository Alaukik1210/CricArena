import axios from "axios";
import { useEffect, useState } from "react";
import { ProductShell, RoleDashboard, SectionBlock, MetricCard } from "./ProductShell";
import { ORGANIZER_ANALYTICS_API_END_POINT } from "@/utils/constants";

const organizerLinks = [
  { href: "/organizer/analytics", label: "Overview" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/bookings", label: "Payments" },
  { href: "/owner/analytics", label: "Owner View" },
];

export default function OrganizerAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await axios.get(ORGANIZER_ANALYTICS_API_END_POINT);
        setAnalytics(response.data.analytics);
      } catch (error) {
        console.error("Failed to load organizer analytics:", error);
        setStatus("Could not load organizer analytics right now.");
      }
    };

    loadAnalytics();
  }, []);

  const metrics = analytics
    ? [
        { label: "Tournaments", value: `${analytics.totalTournaments}`, detail: "Events created through the platform" },
        { label: "Registrations", value: `${analytics.totalRegistrations}`, detail: "Teams currently registered" },
        { label: "Projected Revenue", value: `₹${Number(analytics.projectedRevenue || 0).toLocaleString()}`, detail: "Based on current entry fee mix" },
        { label: "Focus", value: "Fill Faster", detail: "Watch weak-fill tournaments before they slip" },
      ]
    : [];

  return (
    <ProductShell
      kicker="Organizer Dashboard"
      title="Run tournaments with less manual follow-up."
      description="This standard organizer view keeps registrations, payment traction, and event health easy to read from mobile and desktop."
    >
      <RoleDashboard
        title="Organizer Overview"
        description="Track registration quality, projected revenue, and event-level traction from one consistent layout."
        links={organizerLinks}
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
              kicker="Tournament Health"
              title="Which events need attention"
              description="See registration and projected value per tournament without opening multiple pages."
            >
              <div className="space-y-4">
                {(analytics.tournaments || []).map((tournament) => (
                  <article key={tournament.id} className="product-card">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-cabinet-bold">{tournament.title}</h3>
                        <p className="muted-copy mt-2 text-sm">
                          {tournament.registrations} registrations • ₹{Number(tournament.projectedRevenue || 0).toLocaleString()}
                        </p>
                      </div>
                      <span className="pill-gold">{tournament.status}</span>
                    </div>
                  </article>
                ))}
              </div>
            </SectionBlock>
          </>
        ) : (
          <div className="product-card muted-copy">Loading organizer analytics...</div>
        )}
      </RoleDashboard>
    </ProductShell>
  );
}
