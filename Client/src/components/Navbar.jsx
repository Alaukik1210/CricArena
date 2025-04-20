import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Link } from "react-scroll";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { User2, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((store) => store.user);

  const logoutHandler = () => {
    console.log("User logged out");
  };

  return (
    <div className="z-50 fixed w-full top-0 bg-black">
      {/* Desktop Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex justify-between items-center p-6 text-white"
      >
        {/* Logo */}
        <Link
          to="top"
          spy={true}
          smooth={true}
          offset={-200}
          duration={500}
          className="flex gap-2 items-center cursor-pointer ml-8"
        >
          <motion.img
            src={logo}
            alt="Logo"
            className="h-12 md:h-16"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <motion.div
            className="text-white font-bold text-3xl md:text-5xl"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            Cric
          </motion.div>
          <motion.div
            className="text-orangex font-bold text-3xl md:text-5xl"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          >
            Arena
          </motion.div>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 mr-16 text-xl font-bold pt-4 text-white">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="cursor-pointer text-white hover:text-orangex"
            onClick={() => navigate(`/`)}
          >
            Home
          </motion.div>
          {["About", "Tournaments", "Grounds"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 * index }}
              className="cursor-pointer text-white hover:text-orangex"
              onClick={() => navigate(`/${item.toLowerCase()}`)}
            >
              {item}
            </motion.div>
          ))}

          {/* User Avatar or Login Button */}
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      "https://via.placeholder.com/40"
                    }
                    alt="User Avatar"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 bg-[#030b18] shadow-lg outline-none rounded-lg border border-gray-700">
                <div className="flex gap-4 items-center">
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={
                        user?.profile?.profilePhoto ||
                        "https://via.placeholder.com/40"
                      }
                      alt="User Avatar"
                    />
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-white">{user.fullname}</h3>
                    <p className="text-sm text-gray-400">{user.role}</p>
                  </div>
                </div>
                {user.role === "PLAYER" && (
                  <div className="flex mt-4 items-center gap-2">
                    <User2 className="text-[#FFD070]" />
                    <Button
                      variant="link"
                      className="text-[#FFD070]"
                      onClick={() => navigate("/profile")}
                    >
                      View Profile
                    </Button>
                  </div>
                )}
                <div className="flex mt-4 items-center gap-2">
                  <LogOut className="text-red-500" />
                  <Button
                    onClick={logoutHandler}
                    variant="link"
                    className="text-red-500"
                  >
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
              onClick={() => navigate("/login")}
              className="px-6 bg-[#FFD070] text-black rounded-3xl border-2 border-orangex hover:bg-white hover:text-[#FFD070] transition"
            >
              LOGIN
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden justify-between items-center p-4">
        <div className="flex gap-2 items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-white font-bold text-3xl"
          >
            Cric
          </motion.div>
          <motion.img
            src={logo}
            alt="Logo"
            className="h-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-orangex font-bold text-3xl"
          >
            Arena
          </motion.div>
        </div>
        <motion.button
          className="text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          ☰
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="md:hidden bg-black w-full flex flex-col text-white p-4 text-lg"
        >
          {["Home", "About", "Tournaments", "Contact"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 * index }}
              className="py-2 cursor-pointer hover:text-orangex"
              onClick={() => {
                setMenuOpen(false);
                navigate(`/${item.toLowerCase()}`);
              }}
            >
              {item}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;