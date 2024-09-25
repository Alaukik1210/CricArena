import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const About = () => {
  const navigate = useNavigate();

  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [cardsRef, cardsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="joining">
      <div ref={headerRef} className="">
        <motion.div
          animate={headerInView ? { x: 100 } : { x: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          id="joinushed"
          className="md:ml-0 -ml-20 lg:text-6xl text-4xl text-gold font-cabinet-extrabold font-bold lg:mt-8 mt-4 w-[100px] lg:w-[300px] md:pr-20 h-16 lg:h-24 lg:pt-2 pt-1 flex items-center justify-evenly rounded-r-3xl bg-black"
        >
          <span className="text-white md:mr-2">Join</span> Us
        </motion.div>
        <motion.span
          animate={headerInView ? { x: 200 } : { x: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          id="joinus"
          className="hidden md:block absolute left-0 rounded-e-lg h-[4px] w-[150px] bg-gradient-to-r from-transparent to-gold animate-[animate_5s_linear_infinite]"
        ></motion.span>
        <motion.span
          animate={headerInView ? { x: 70 } : { x: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="block md:hidden absolute left-0 rounded-e-lg h-[4px] w-[80px] bg-gradient-to-r from-transparent to-gold animate-[animate_5s_linear_infinite]"
        ></motion.span>
      </div>
      <div ref={cardsRef} className="md:mt-32 mt-8 px-12 sm:px-8 md:px-12 md:mb-40 mb-4 grid gap-8 grid-cols-1 sm:grid-cols-2 md:flex md:justify-evenly">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={cardsInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-96 w-[310px] text-center text-3xl font-bold font-cabinet-bold pt-4 rounded-3xl z-20 text-white bg-banner"
        >
          Live from Stadium
          <div className="h-1 w-full bg-gold"></div>
          <div className="text-center mt-64">
            <button
              onClick={() => navigate("/ticket")}
              className="group relative h-8 w-40 overflow-hidden rounded-2xl bg-goldx text-lg font-bold border-2 border-gold text-gold"
            >
              Book Ticket
              <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
            </button>
          </div>
        </motion.div>
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={cardsInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="h-96 w-[310px] text-center text-3xl font-bold font-cabinet-bold pt-4 rounded-3xl z-20 text-white bg-banner3"
        >
          Book a Trial
          <div className="h-1 w-full bg-gold"></div>
          <div className="text-center mt-64">
            <button
              onClick={() => navigate("/trial")}
              className="group relative h-8 w-40 overflow-hidden rounded-2xl bg-goldx text-lg font-bold border-2 border-gold text-gold"
            >
              Submit
              <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={cardsInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
          className="h-96 w-[310px] text-center text-3xl font-bold font-cabinet-bold pt-4 rounded-3xl z-20 text-white bg-bann"
        >
          Host a Tournament
          <div className="h-1 w-full bg-gold"></div>
          <div className="text-center mt-64">
            <button
              onClick={() => navigate("/tournament")}
              className="group relative h-8 w-40 overflow-hidden rounded-2xl bg-goldx text-lg font-bold border-2 border-gold text-gold"
            >
              Register
              <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;