import { ArrowRight, CalendarRange, Compass, MapPinned, ShieldCheck, Ticket, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "./redux/store";
import { MetricCard, ProductShell, SectionBlock } from "./components/ProductShell";
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
    <ProductShell
      kicker="CricArena"
      title="Local cricket, without the usual coordination mess."
      description="Discover nearby players, open rooms, book grounds, and manage tournaments from one standard product flow built for repeat play."
      actions={
        <>
          <Link to={user ? "/discover" : "/signup"} className="cta-primary">
            <Compass className="mr-2 h-4 w-4" />
            {user ? "Open Discovery" : "Start Playing"}
          </Link>
          <Link to="/grounds" className="cta-secondary">
            <Ticket className="mr-2 h-4 w-4" />
            Explore Grounds
          </Link>
        </>
      }
    >
      <section className="product-grid-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <div className="product-grid-2">
        <SectionBlock
          kicker="What You Can Do"
          title="One product, three immediate jobs"
          description="Each area should create direct value in one glance and one action."
        >
          <div className="product-grid-3">
            {valuePoints.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.title} to={item.href} className="product-card transition hover:border-[#d8b56d]/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon className="h-5 w-5 text-[#d8b56d]" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/40" />
                  </div>
                  <h2 className="mt-5 text-2xl font-cabinet-bold text-white">{item.title}</h2>
                  <p className="muted-copy mt-3 text-sm leading-6">{item.text}</p>
                </Link>
              );
            })}
          </div>
        </SectionBlock>

        <SectionBlock
          kicker="Why It Works"
          title="Standard product spine"
          description="The platform stays understandable because every important flow follows the same rhythm."
        >
          <div className="space-y-3">
            {spine.map((step, index) => (
              <div key={step} className="product-card flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-[#f0ddb0]">
                  {index + 1}
                </div>
                <p className="text-sm leading-7 text-white/85">{step}</p>
              </div>
            ))}
          </div>
        </SectionBlock>
      </div>

      <div className="product-grid-3">
        <SectionBlock
          kicker="Players"
          title="Find the right game faster"
          description="Turn on visibility, set your radius, and join rooms that fit your level and time."
        >
          <div className="flex flex-wrap gap-3">
            <Link to="/discover" className="cta-primary">
              <MapPinned className="mr-2 h-4 w-4" />
              Discover Nearby
            </Link>
            <Link to="/rooms" className="cta-secondary">
              <Users className="mr-2 h-4 w-4" />
              Manage Rooms
            </Link>
          </div>
        </SectionBlock>

        <SectionBlock
          kicker="Owners"
          title="Fill inventory with more confidence"
          description="Track grounds, bookings, and revenue from a clearer operating view."
        >
          <div className="flex flex-wrap gap-3">
            <Link to="/grounds" className="cta-primary">
              <CalendarRange className="mr-2 h-4 w-4" />
              View Grounds
            </Link>
            <Link to="/owner/analytics" className="cta-secondary">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Owner Analytics
            </Link>
          </div>
        </SectionBlock>

        <SectionBlock
          kicker="Organizers"
          title="Run tournaments with less manual follow-up"
          description="Monitor registrations and projected value without chasing updates across multiple screens."
        >
          <div className="flex flex-wrap gap-3">
            <Link to="/tournaments" className="cta-primary">
              <Trophy className="mr-2 h-4 w-4" />
              Open Tournaments
            </Link>
            <Link to="/organizer/analytics" className="cta-secondary">
              <ArrowRight className="mr-2 h-4 w-4" />
              Organizer Analytics
            </Link>
          </div>
        </SectionBlock>
      </div>
    </ProductShell>
  );
}

export default App;
