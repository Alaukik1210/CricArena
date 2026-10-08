import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, MapPinned, Radar, Trophy, User2, Users } from "lucide-react";
import logo from "../assets/logo.png";
import { api } from "@/lib/api";
import { clearUser } from "@/redux/userSlice";
import { useAppSelector } from "@/redux/store";

const publicLinks = [
    { label: "Home", href: "/" },
    { label: "Discover", href: "/discover" },
    { label: "Rooms", href: "/rooms" },
    { label: "Grounds", href: "/grounds" },
    { label: "Tournaments", href: "/tournaments" },
];

const ownerLinks = [
    { label: "Owner", href: "/owner/analytics", icon: LayoutDashboard },
    { label: "Organizer", href: "/organizer/analytics", icon: Trophy },
];

const userAvatarFallback =
    "https://static.vecteezy.com/system/resources/previews/053/296/128/non_2x/cricket-player-wearing-protective-helmet-holding-wooden-bat-in-monochrome-simple-minimalistic-in-black-ink-drawing-on-white-background-vector.jpg";

const menuItemClass =
    "rounded border border-rule bg-surface-sunk px-4 py-3 text-left text-sm font-semibold text-ink transition hover:bg-surface";

interface NavLinksProps {
    navigate: NavigateFunction;
    onNavigate?: () => void;
}

const NavLinks = ({ navigate, onNavigate }: NavLinksProps) => (
    <>
        {publicLinks.map((item) => (
            <button
                key={item.label}
                type="button"
                className="text-sm font-semibold tracking-wide text-ink transition hover:text-pending"
                onClick={() => {
                    navigate(item.href);
                    onNavigate?.();
                }}
            >
                {item.label}
            </button>
        ))}
    </>
);

const Navbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useAppSelector((store) => store.user);
    const dispatch = useDispatch();

    const logoutHandler = async () => {
        try {
            await api.post("/user/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            dispatch(clearUser());
            navigate("/");
        }
    };

    const accountLinks = user
        ? [
              { label: "Profile", href: `/profile/${user.id}`, icon: User2 },
              { label: "Nearby Discovery", href: "/discover", icon: MapPinned },
              { label: "Rooms", href: "/rooms", icon: Radar },
              { label: "Bookings", href: "/bookings", icon: Users },
          ]
        : [];

    return (
        <div className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-6">
            <motion.div
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded border border-rule bg-surface px-4 py-4 text-ink md:px-6"
            >
                <button type="button" className="flex items-center gap-3" onClick={() => navigate("/")}>
                    <img src={logo} alt="CricArena" className="h-10 w-10 rounded border border-rule-soft object-cover" />
                    <div className="flex items-baseline gap-1">
                        <span className="font-display text-2xl tracking-widest text-ink">CRIC</span>
                        <span className="font-display text-2xl tracking-widest text-pending">ARENA</span>
                    </div>
                </button>

                <div className="hidden items-center gap-6 lg:flex">
                    <NavLinks navigate={navigate} />
                </div>

                <div className="hidden items-center gap-3 lg:flex">
                    {user?.role === "OWNER" &&
                        ownerLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Button key={item.label} variant="outline" onClick={() => navigate(item.href)}>
                                    <Icon />
                                    {item.label}
                                </Button>
                            );
                        })}

                    {user ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button type="button" aria-label="Account menu" className="rounded border border-rule-soft p-1">
                                    <Avatar className="h-10 w-10 cursor-pointer">
                                        <AvatarImage src={user.profile?.profilePhoto || userAvatarFallback} alt="" />
                                    </Avatar>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-5">
                                <div className="flex gap-4">
                                    <Avatar className="h-14 w-14">
                                        <AvatarImage src={user.profile?.profilePhoto || userAvatarFallback} alt="" />
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-semibold text-ink">{user.fullname}</h3>
                                        <p className="text-sm text-ink-soft">{user.role}</p>
                                        <p className="mt-2 text-sm text-ink-soft">
                                            {user.city}, {user.state}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-2">
                                    {accountLinks.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.label}
                                                type="button"
                                                className={`flex items-center gap-3 ${menuItemClass}`}
                                                onClick={() => navigate(item.href)}
                                            >
                                                <Icon className="h-4 w-4 text-ink" />
                                                <span>{item.label}</span>
                                            </button>
                                        );
                                    })}
                                    <button
                                        type="button"
                                        className="flex items-center gap-3 rounded border border-urgent bg-surface px-4 py-3 text-left text-sm font-semibold text-urgent transition hover:bg-surface-sunk"
                                        onClick={logoutHandler}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <Button onClick={() => navigate("/login")}>Login</Button>
                    )}
                </div>

                <button
                    type="button"
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                    className="rounded border border-rule bg-surface-sunk p-3 text-ink lg:hidden"
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    ☰
                </button>
            </motion.div>

            {menuOpen ? (
                <div className="mx-auto mt-3 max-w-7xl rounded border border-rule bg-surface p-4 lg:hidden">
                    <div className="grid gap-3">
                        <NavLinks navigate={navigate} onNavigate={() => setMenuOpen(false)} />
                        {user?.role === "OWNER" &&
                            ownerLinks.map((item) => (
                                <button
                                    key={item.label}
                                    type="button"
                                    className={menuItemClass}
                                    onClick={() => {
                                        navigate(item.href);
                                        setMenuOpen(false);
                                    }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        {user ? (
                            <>
                                <button
                                    type="button"
                                    className={menuItemClass}
                                    onClick={() => {
                                        navigate(`/profile/${user.id}`);
                                        setMenuOpen(false);
                                    }}
                                >
                                    Profile
                                </button>
                                <button
                                    type="button"
                                    className={menuItemClass}
                                    onClick={() => {
                                        navigate("/bookings");
                                        setMenuOpen(false);
                                    }}
                                >
                                    Bookings
                                </button>
                                <button
                                    type="button"
                                    className="rounded border border-urgent bg-surface px-4 py-3 text-left text-sm font-semibold text-urgent"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        logoutHandler();
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Button
                                className="justify-start"
                                onClick={() => {
                                    navigate("/login");
                                    setMenuOpen(false);
                                }}
                            >
                                Login
                            </Button>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Navbar;
