import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, MapPinned, Radar, Trophy, User2, Users } from "lucide-react";
import logo from "../assets/logo.png";
import { USER_API_END_POINT } from "@/utils/constants";
import { clearUser } from "@/redux/userSlice";

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

const NavLinks = ({ navigate, onNavigate }) => (
  <>
    {publicLinks.map((item) => (
      <button
        key={item.label}
        type="button"
        className="text-sm font-semibold tracking-wide text-white/80 transition hover:text-[#f0ddb0]"
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
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      await axios.post(`${USER_API_END_POINT}/logout`);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(clearUser());
      navigate("/");
    }
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-[#101416]/90 px-4 py-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:px-6"
      >
        <button type="button" className="flex items-center gap-3" onClick={() => navigate("/")}>
          <img src={logo} alt="CricArena" className="h-10 w-10 rounded-full border border-white/10 object-cover" />
          <div className="flex items-baseline gap-1">
            <span className="font-cabinet-black text-2xl tracking-[0.18em] text-white">CRIC</span>
            <span className="font-cabinet-black text-2xl tracking-[0.18em] text-[#d8b56d]">ARENA</span>
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
                <button
                  key={item.label}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-[#d8b56d]/50 hover:text-[#f0ddb0]"
                  onClick={() => navigate(item.href)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}

          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="rounded-full border border-white/10 p-1">
                  <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src={user?.profile?.profilePhoto || userAvatarFallback} alt="User Avatar" />
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 rounded-3xl border border-white/10 bg-[#101416] p-5 shadow-xl">
                <div className="flex gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={user?.profile?.profilePhoto || userAvatarFallback} alt="User Avatar" />
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user.fullname}</h3>
                    <p className="text-sm text-white/60">{user.role}</p>
                    <p className="mt-2 text-sm text-white/60">
                      {user.city}, {user.state}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white transition hover:border-[#d8b56d]/50 hover:text-[#f0ddb0]"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <User2 className="h-4 w-4 text-[#d8b56d]" />
                    <span className="text-sm font-semibold">Profile</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white transition hover:border-[#d8b56d]/50 hover:text-[#f0ddb0]"
                    onClick={() => navigate("/discover")}
                  >
                    <MapPinned className="h-4 w-4 text-[#d8b56d]" />
                    <span className="text-sm font-semibold">Nearby Discovery</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white transition hover:border-[#d8b56d]/50 hover:text-[#f0ddb0]"
                    onClick={() => navigate("/rooms")}
                  >
                    <Radar className="h-4 w-4 text-[#d8b56d]" />
                    <span className="text-sm font-semibold">Rooms</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white transition hover:border-[#d8b56d]/50 hover:text-[#f0ddb0]"
                    onClick={() => navigate("/bookings")}
                  >
                    <Users className="h-4 w-4 text-[#d8b56d]" />
                    <span className="text-sm font-semibold">Bookings</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-left text-red-300 transition hover:bg-red-500/20"
                    onClick={logoutHandler}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-semibold">Logout</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="rounded-full bg-[#d8b56d] px-5 py-2 text-black hover:bg-[#f0ddb0]"
            >
              Login
            </Button>
          )}
        </div>

        <button
          type="button"
          className="rounded-full border border-white/10 bg-white/5 p-3 text-white lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </motion.div>

      {menuOpen ? (
        <div className="mx-auto mt-3 max-w-7xl rounded-[28px] border border-white/10 bg-[#101416]/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden">
          <div className="grid gap-3">
            <NavLinks navigate={navigate} onNavigate={() => setMenuOpen(false)} />
            {user?.role === "OWNER" &&
              ownerLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white"
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
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white"
                  onClick={() => {
                    navigate(`/profile/${user.id}`);
                    setMenuOpen(false);
                  }}
                >
                  Profile
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white"
                  onClick={() => {
                    navigate("/bookings");
                    setMenuOpen(false);
                  }}
                >
                  Bookings
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-left text-sm font-semibold text-red-300"
                  onClick={() => {
                    setMenuOpen(false);
                    logoutHandler();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                className="rounded-2xl bg-[#d8b56d] px-4 py-3 text-left text-sm font-semibold text-black"
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
