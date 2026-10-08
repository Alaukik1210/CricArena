import { ArrowRight, CalendarRange, Compass, MapPinned, ShieldCheck, Ticket, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "./redux/store";
import { PageShell, Section, Stat } from "./components/ui/page-shell";
import { Button } from "./components/ui/button";
import Landing from "./features/marketing/Landing";

const valuePoints = [
  {
    title: "Discover",
    text: "See active players and open rooms in your chosen radius instead of depending on random groups.",
    icon: Compass,
    href: "/discover",
  },
  {
    title: "Book",
    text: "Create booking sessions cleanly and move from ground selection to payment without confusion.",
    icon: Ticket,
    href: "/grounds",
  },
  {
    title: "Organize",
    text: "Run teams and tournaments with one clear operational flow instead of scattered manual follow-up.",
    icon: Trophy,
    href: "/tournaments",
  },
];

const spine = [
  "Discover the right people, rooms, and grounds nearby.",
  "Decide quickly with direct cards, clear status, and visible fit.",
  "Join, book, or register without messy handoffs.",
  "Coordinate safely with consent-based connection and approvals.",
  "Track bookings, rooms, and tournament traction in one place.",
  "Return because the next game is easier to find than before.",
];

function App() {
  const { user } = useAppSelector((s) => s.user);

  if (!user) {
    return <Landing />;
  }

  const metrics = [
    { label: "Core Promise", value: "Play Faster", detail: "Less coordination friction, more actual cricket." },
    { label: "Primary Wedge", value: "Nearby Rooms", detail: "Radius-based player discovery built for local games." },
    { label: "Business Layer", value: "Owner + Organizer", detail: "Grounds, revenue, registrations, and repeat usage." },
    { label: "Product Feel", value: "Clean Standard", detail: "Direct value, responsive UI, and one consistent system." },
  ];

  return (
    <PageShell
      kicker="CricArena"
      title="Local cricket, without the usual coordination mess."
      description="Discover nearby players, open rooms, book grounds, and manage tournaments from one standard product flow built for repeat play."
      actions={
        <>
          <Button asChild>
            <Link to="/discover">
              <Compass />
              Open Discovery
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/grounds">
              <Ticket />
              Explore Grounds
            </Link>
          </Button>
        </>
      }
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Stat key={metric.label} {...metric} />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
        <Section
          kicker="What You Can Do"
          title="One product, three immediate jobs"
          description="Each area should create direct value in one glance and one action."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {valuePoints.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className="rounded border border-rule bg-surface p-5 transition hover:border-pending"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded border border-rule-soft bg-surface-sunk">
                      <Icon className="h-5 w-5 text-ink" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-ink-soft" />
                  </div>
                  <h2 className="mt-5 font-display text-2xl uppercase tracking-wide text-ink">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">{item.text}</p>
                </Link>
              );
            })}
          </div>
        </Section>

        <Section
          kicker="Why It Works"
          title="Standard product spine"
          description="The platform stays understandable because every important flow follows the same rhythm."
        >
          <div className="space-y-3">
            {spine.map((step, index) => (
              <div key={step} className="flex items-start gap-4 rounded border border-rule bg-surface p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-rule-soft bg-surface-sunk font-data text-sm font-semibold text-ink">
                  {index + 1}
                </div>
                <p className="text-sm leading-7 text-ink">{step}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
        <Section
          kicker="Players"
          title="Find the right game faster"
          description="Turn on visibility, set your radius, and join rooms that fit your level and time."
        >
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/discover">
                <MapPinned />
                Discover Nearby
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/rooms">
                <Users />
                Manage Rooms
              </Link>
            </Button>
          </div>
        </Section>

        <Section
          kicker="Owners"
          title="Fill inventory with more confidence"
          description="Track grounds, bookings, and revenue from a clearer operating view."
        >
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/grounds">
                <CalendarRange />
                View Grounds
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/owner/analytics">
                <ShieldCheck />
                Owner Analytics
              </Link>
            </Button>
          </div>
        </Section>

        <Section
          kicker="Organizers"
          title="Run tournaments with less manual follow-up"
          description="Monitor registrations and projected value without chasing updates across multiple screens."
        >
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/tournaments">
                <Trophy />
                Open Tournaments
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/organizer/analytics">
                <ArrowRight />
                Organizer Analytics
              </Link>
            </Button>
          </div>
        </Section>
      </div>
    </PageShell>
  );
}

export default App;
