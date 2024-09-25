import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy } from 'react-scroll';


const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(() => {
    gsap.from("#cric", {
      x: -100,
      opacity: 0,
      duration: 1,
      delay: 1,
    });
    gsap.from("#logo", {
      y: 100,
      opacity: 0,
      duration: 1,
      delay: 1,
    });
    gsap.from("#arena", {
      x: 100,
      opacity: 0,
      duration: 1,
      delay: 1,
    });
    gsap.from("#home", {
      y: -100,
      opacity: 0,
      duration: 0.5,
      delay: 1,
    });
    gsap.from("#blogs", {
      y: -100,
      opacity: 0,
      duration: 0.5,
      delay: 1.5,
    });
    gsap.from("#explore", {
      y: -100,
      opacity: 0,
      duration: 0.5,
      delay: 2,
    });
    gsap.from("#about", {
      y: -100,
      opacity: 0,
      duration: 0.5,
      delay: 2.5,
    });
    gsap.from("#login", {
      y: -100,
      opacity: 0,
      duration: 0.5,
      delay: 3,
    });


    gsap.to("#abc", {
      x: 1850,
      duration: 6,
      repeat: -1,
    });
  }, []);

  return (
    <div className="z-50 fixed w-full top-0 bg-black">
      {/* Full Navbar for desktop */}
      <div className="hidden text-gold md:flex flex-col md:flex-row justify-between  items-center  md:items-start p-4 md:p-8">
        <Link activeClass="active" 
          to="top" 
          spy={true} 
          smooth={true} 
          offset={-200} 
          duration={500} 
           className="flex gap-2 items-center md:ml-20 cursor-pointer ml-8">
          <div>
            <img id="logo" className="h-12 md:h-16" src={logo} alt="Logo" />
          </div>
          <div
            id="cric"
            className="text-gold font-cabinet-extrabold  font-bold text-3xl md:text-5xl"
          >
            Cric
          </div>

          <div
            id="arena"
            className="text-gold font-cabinet-extrabold font-bold text-3xl md:text-5xl"
          >
            Arena
          </div>
        </Link>

        <div className=" flex md:mr-20 cursor-pointer gap-4 md:gap-8 mt-4 md:mt-[24px] font-cabinet-bold text-xl md:text-xl font-semibold">
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-white text-gold "
            id="home"
          >
            Home
          </div>
          <Link  activeClass="active" 
      to="aboutus" 
      spy={true} 
      smooth={true} 
      offset={-200} 
      duration={500} 
            className="cursor-pointer hover:text-white text-gold "
            id="blogs"
          >
            About
          </Link>
          <Link
          activeClass="active" 
          to="tour" 
          spy={true} 
          smooth={true} 
          offset={-200} 
          duration={500} 
            className="cursor-pointer hover:text-white text-gold "
            id="explore"
          >
            Tournaments
          </Link>
          <Link
          activeClass="active" 
          to="joining" 
          spy={true} 
          smooth={true} 
          offset={-200} 
          duration={500} 
            className="cursor-pointer hover:text-white text-gold "
            id="about"
          >
            Contact
          </Link>
          <button
          id="login"
            onClick={() => navigate("/login")}
            type="submit"
            className="group relative h-8 w-32 overflow-hidden rounded-xl bg-goldx text-md font-bold border-2 border-gold text-gold text-center"
          >
            LOGIN
            <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
          </button>
        </div>
        <span
          id="abc"
          className="absolute bottom-0 h-[2px] w-[50px] bg-gradient-to-r from-transparent to-white animate-[animate_5s_linear_infinite]"
        ></span>
      </div>

      {/* Menu button for mobile */}
      <div className="flex md:hidden justify-between items-center p-4">
        <div className="flex gap-2 items-center">
          <div className="text-gold font-cabinet-bold font-bold text-3xl">
            Cric
          </div>
          <div>
            <img className="h-12" src={logo} alt="Logo" />
          </div>
          <div className="text-gold font-cabinet-bold font-bold text-3xl">
            Arena
          </div>
        </div>
        <button
          className="text-gold font-cabinet-bold text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Menu
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="bg-black md:hidden w-20 flex flex-col text-gold p-4 font-cabinet-bold">
          <div className="py-2">Home</div>
          <div className="py-2">Blogs</div>
          <div className="py-2">Explore</div>
          <div className="py-2">About</div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
