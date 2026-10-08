import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageShell, DashboardShell, Section, Stat } from "@/components/ui/page-shell";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

const organizerLinks = [
    { href: "/organizer/analytics", label: "Overview" },
    { href: "/tournaments", label: "Tournaments" },
    { href: "/bookings", label: "Payments" },
    { href: "/owner/analytics", label: "Owner View" },
];

interface TournamentRow {
    id: string;
    title: string;
    registrations: number;
    projectedRevenue: number;
    status: string;
}

interface OrganizerAnalyticsData {
    totalTournaments: number;
    totalRegistrations: number;
    projectedRevenue: number;
    tournaments?: TournamentRow[];
}

const rupees = (n: number | undefined | null) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const tournamentColumns: Column<TournamentRow>[] = [
    { key: "title", header: "Tournament", render: (t) => t.title },
    { key: "registrations", header: "Registrations", numeric: true, render: (t) => t.registrations },
    { key: "revenue", header: "Projected revenue", numeric: true, render: (t) => rupees(t.projectedRevenue) },
    { key: "status", header: "Status", render: (t) => <Badge tone="pending">{t.status}</Badge> },
];

export default function OrganizerAnalytics() {
    const [analytics, setAnalytics] = useState<OrganizerAnalyticsData | null>(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const response = await api.get<{ analytics: OrganizerAnalyticsData }>("/organizer/analytics");
                setAnalytics(response.data.analytics);
            } catch (error) {
                console.error("Failed to load organizer analytics:", error);
                setStatus("Could not load organizer analytics right now.");
            }
        };

        loadAnalytics();
    }, []);

    return (
        <PageShell
            kicker="Organizer Dashboard"
            title="Run tournaments with less manual follow-up."
            description="This standard organizer view keeps registrations, payment traction, and event health easy to read from mobile and desktop."
        >
            <DashboardShell
                title="Organizer Overview"
                description="Track registration quality, projected revenue, and event-level traction from one consistent layout."
                links={organizerLinks}
            >
                {status ? (
                    <div role="alert" className="rounded border border-rule bg-surface px-5 py-4 text-sm text-ink md:px-6">
                        {status}
                    </div>
                ) : null}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
                    <Stat
                        label="Tournaments"
                        value={analytics ? analytics.totalTournaments : "-"}
                        detail="Events created through the platform"
                    />
                    <Stat
                        label="Registrations"
                        value={analytics ? analytics.totalRegistrations : "-"}
                        detail="Teams currently registered"
                    />
                    <Stat
                        label="Projected Revenue"
                        value={analytics ? rupees(analytics.projectedRevenue) : "-"}
                        detail="Based on current entry fee mix"
                    />
                </section>
                <Section kicker="Tournament Health" title="Which events need attention">
                    <DataTable
                        columns={tournamentColumns}
                        rows={analytics?.tournaments ?? []}
                        getRowId={(t) => t.id}
                        loading={!analytics && !status}
                        emptyMessage={status ? "Analytics unavailable." : "No tournaments yet."}
                    />
                </Section>
            </DashboardShell>
        </PageShell>
    );
}
