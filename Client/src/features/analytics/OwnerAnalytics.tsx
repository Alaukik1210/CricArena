import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageShell, DashboardShell, Section, Stat } from "@/components/ui/page-shell";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

const ownerLinks = [
    { href: "/owner/analytics", label: "Overview" },
    { href: "/grounds", label: "Grounds" },
    { href: "/bookings", label: "Bookings" },
    { href: "/organizer/analytics", label: "Organizer View" },
];

interface GroundRow {
    id: string;
    name: string;
    bookings: number;
    revenue: number;
    occupancyLabel: string;
}

interface OwnerAnalyticsData {
    totalGrounds: number;
    totalBookings: number;
    totalRevenue: number;
    grounds?: GroundRow[];
}

const rupees = (n: number | undefined | null) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const groundColumns: Column<GroundRow>[] = [
    { key: "name", header: "Ground", render: (g) => g.name },
    { key: "bookings", header: "Bookings", numeric: true, render: (g) => g.bookings },
    { key: "revenue", header: "Revenue", numeric: true, render: (g) => rupees(g.revenue) },
    { key: "occupancy", header: "Occupancy", render: (g) => <Badge tone="pending">{g.occupancyLabel}</Badge> },
];

export default function OwnerAnalytics() {
    const [analytics, setAnalytics] = useState<OwnerAnalyticsData | null>(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const response = await api.get<{ analytics: OwnerAnalyticsData }>("/owner/analytics");
                setAnalytics(response.data.analytics);
            } catch (error) {
                console.error("Failed to load owner analytics:", error);
                setStatus("Could not load owner analytics right now.");
            }
        };

        loadAnalytics();
    }, []);

    return (
        <PageShell
            kicker="Owner Dashboard"
            title="See occupancy, bookings, and revenue without guesswork."
            description="Owner analytics should help you improve business decisions fast, not just show raw numbers."
        >
            <DashboardShell
                title="Owner Overview"
                description="A standard owner dashboard should reveal inventory quality, booking flow, and repeat revenue in one place."
                links={ownerLinks}
            >
                {status ? (
                    <div role="alert" className="rounded border border-rule bg-surface px-5 py-4 text-sm text-ink md:px-6">
                        {status}
                    </div>
                ) : null}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
                    <Stat label="Grounds" value={analytics ? analytics.totalGrounds : "-"} detail="Active owner inventory" />
                    <Stat label="Bookings" value={analytics ? analytics.totalBookings : "-"} detail="Combined booking count" />
                    <Stat
                        label="Revenue"
                        value={analytics ? rupees(analytics.totalRevenue) : "-"}
                        detail="Tracked from successful bookings"
                    />
                </section>
                <Section kicker="Ground Performance" title="Your portfolio at a glance">
                    <DataTable
                        columns={groundColumns}
                        rows={analytics?.grounds ?? []}
                        getRowId={(g) => g.id}
                        loading={!analytics && !status}
                        emptyMessage={status ? "Analytics unavailable." : "No grounds yet."}
                    />
                </Section>
            </DashboardShell>
        </PageShell>
    );
}
