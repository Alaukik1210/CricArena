/* eslint-disable react-refresh/only-export-components -- route table module; it exports no components, so fast-refresh boundaries do not apply */
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

// Eager - needed for shell
import Layout from "../components/Layout.jsx";

// Route-level code-splitting
const App = lazy(() => import("../App"));
const TicketBookingForm = lazy(() => import("../components/TicketBookingForm.jsx"));
const PlayerRegistrationForm = lazy(() => import("../components/PlayerRegistrationForm.jsx"));
const TournamentHostingForm = lazy(() => import("../components/TournamentHostingForm.jsx"));
const CricketScoreboard = lazy(() => import("../components/CricketScoreboard.jsx"));
const Login = lazy(() => import("../features/auth/Login"));
const SignUp = lazy(() => import("../features/auth/SignUp"));
const Tours = lazy(() => import("../components/Tours.jsx"));
const PlayerProfile = lazy(() => import("../components/PlayerProfile.jsx"));
const Grounds = lazy(() => import("../components/Grouds.jsx"));
const About_cric = lazy(() => import("../features/marketing/About_cric"));
const RegisterTour = lazy(() => import("../components/RegisterTour.jsx"));
const CheckoutPage = lazy(() => import("../components/CheckoutPage.jsx"));
const Discover = lazy(() => import("../components/Discover.jsx"));
const RoomsHub = lazy(() => import("../components/RoomsHub.jsx"));
const BookingsHub = lazy(() => import("../components/BookingsHub.jsx"));
const OwnerAnalytics = lazy(() => import("../components/OwnerAnalytics.jsx"));
const OrganizerAnalytics = lazy(() => import("../components/OrganizerAnalytics.jsx"));

const RouteFallback = () => (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink-soft">Loading…</div>
);

const lazyRoute = (Component: React.LazyExoticComponent<React.ComponentType<unknown>>) => (
    <Suspense fallback={<RouteFallback />}>
        <Component />
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: lazyRoute(App) },
            { path: "/ticket", element: lazyRoute(TicketBookingForm) },
            { path: "/trial", element: lazyRoute(PlayerRegistrationForm) },
            { path: "/tournament", element: lazyRoute(TournamentHostingForm) },
            { path: "/login", element: lazyRoute(Login) },
            { path: "/score", element: lazyRoute(CricketScoreboard) },
            { path: "/signup", element: lazyRoute(SignUp) },
            { path: "/tournaments", element: lazyRoute(Tours) },
            { path: "/profile/:id", element: lazyRoute(PlayerProfile) },
            { path: "/grounds", element: lazyRoute(Grounds) },
            { path: "/discover", element: lazyRoute(Discover) },
            { path: "/rooms", element: lazyRoute(RoomsHub) },
            { path: "/bookings", element: lazyRoute(BookingsHub) },
            { path: "/owner/analytics", element: lazyRoute(OwnerAnalytics) },
            { path: "/organizer/analytics", element: lazyRoute(OrganizerAnalytics) },
            { path: "/about", element: lazyRoute(About_cric) },
            { path: "/register/:id", element: lazyRoute(RegisterTour) },
            { path: "/checkout", element: lazyRoute(CheckoutPage) },
        ],
    },
]);
