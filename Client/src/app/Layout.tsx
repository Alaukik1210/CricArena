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
        <div className="relative flex h-fit flex-col justify-between">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Layout;
