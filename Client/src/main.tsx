import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import axios from "axios";

import store, { persistor } from "./redux/store";
import { queryClient } from "./lib/queryClient";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

// Keep global axios sending cookies — legacy JSX components rely on this
// until they migrate to the new lib/api.ts client.
axios.defaults.withCredentials = true;

// Eager — needed for shell
import Layout from "./components/Layout.jsx";

// Route-level code-splitting
const App = lazy(() => import("./App"));
const TicketBookingForm = lazy(() => import("./components/TicketBookingForm.jsx"));
const PlayerRegistrationForm = lazy(() => import("./components/PlayerRegistrationForm.jsx"));
const TournamentHostingForm = lazy(() => import("./components/TournamentHostingForm.jsx"));
const CricketScoreboard = lazy(() => import("./components/CricketScoreboard.jsx"));
const Login = lazy(() => import("./components/Login"));
const SignUp = lazy(() => import("./components/SignUp.jsx"));
const Tours = lazy(() => import("./components/Tours.jsx"));
const PlayerProfile = lazy(() => import("./components/PlayerProfile.jsx"));
const Grounds = lazy(() => import("./components/Grouds.jsx"));
const About_cric = lazy(() => import("./components/About_cric.jsx"));
const RegisterTour = lazy(() => import("./components/RegisterTour.jsx"));
const CheckoutPage = lazy(() => import("./components/CheckoutPage.jsx"));
const Discover = lazy(() => import("./components/Discover.jsx"));
const RoomsHub = lazy(() => import("./components/RoomsHub.jsx"));
const BookingsHub = lazy(() => import("./components/BookingsHub.jsx"));
const OwnerAnalytics = lazy(() => import("./components/OwnerAnalytics.jsx"));
const OrganizerAnalytics = lazy(() => import("./components/OrganizerAnalytics.jsx"));

const RouteFallback = () => (
    <div className="min-h-[50vh] flex items-center justify-center text-white/60 text-sm">
        Loading…
    </div>
);

const lazyRoute = (Component: React.LazyExoticComponent<React.ComponentType<unknown>>) => (
    <Suspense fallback={<RouteFallback />}>
        <Component />
    </Suspense>
);

const router = createBrowserRouter([
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

window.addEventListener("auth:unauthorized", () => {
    // Hook for a global 401 response — wire to logout / redirect once auth refactor lands
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
    <StrictMode>
        <ErrorBoundary>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <QueryClientProvider client={queryClient}>
                        <RouterProvider router={router} />
                        <Toaster theme="dark" position="top-right" richColors />
                    </QueryClientProvider>
                </PersistGate>
            </Provider>
        </ErrorBoundary>
    </StrictMode>,
);
