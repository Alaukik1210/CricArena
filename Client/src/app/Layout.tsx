import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/features/marketing/Footer";
import Navbar from "@/components/Navbar";

const Layout = () => {
    const location = useLocation();

    useEffect(() => {
        // Scroll to the top of the page whenever the route changes
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className="flex min-h-screen flex-col">
            {/* z-index must stay above the navbar's z-50, or the focused link paints behind it. */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:border focus:border-rule focus:bg-surface focus:px-4 focus:py-2 focus:text-ink"
            >
                Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
