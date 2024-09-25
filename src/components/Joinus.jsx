import React from "react";
import CricketStumps from "./CricketStumps";
import helmet from "../assets/helmet.png";
import wicket from "../assets/wickets.png";
import stadium from "../assets/stadium.png";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

const Joinus = () => {
  const { ref: refHeader, inView: inViewHeader } = useInView({
    triggerOnce: true,
    threshold: 0.3,   
  });

  const { ref: refContent, inView: inViewContent } = useInView({
    triggerOnce: true,
    threshold: 0.3,   
  });

  return (
    <div id="aboutus" className="h-auto md:h-[80vh]  px-4 sm:px-8 md:px-0">
      <div ref={refHeader} className="">
        <motion.div
          animate={inViewHeader ? { x: 100 } : { x: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="md:ml-0 -ml-20 lg:text-6xl text-4xl text-gold font-cabinet-extrabold font-bold lg:mt-8 mt-4 w-[100px] lg:w-[300px] md:pr-20 h-16 lg:h-24 lg:pt-2 pt-1 flex items-center justify-evenly rounded-r-3xl bg-black"
        >
          <span className="text-white md:mr-2">About</span> Us
        </motion.div>
        <motion.span
          animate={inViewHeader ? { x: 230 } : { x: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="hidden md:block absolute left-0 rounded-e-lg h-[4px] w-[150px] bg-gradient-to-r from-transparent to-gold animate-[animate_5s_linear_infinite]"
        ></motion.span>
        <motion.span
          animate={inViewHeader ? { x: 120 } : { x: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="block md:hidden absolute left-0 rounded-e-lg h-[4px] w-[80px] bg-gradient-to-r from-transparent to-gold animate-[animate_5s_linear_infinite]"
        ></motion.span>
      </div>

      <div className="hidden lg:block">
        <CricketStumps />
      </div>

      <motion.div
        ref={refContent}
        initial={{ x: -100, opacity: 0 }}
        animate={inViewContent ? { x: 0, opacity: 1 } : { x: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="bg-goldx text-white w-full md:w-[950px] font-product-sans font-bold p-8 md:p-12 md:ml-28 rounded-3xl mt-8 md:mt-20"
      >
        <div className="flex flex-row md:flex-row justify-between gap-12 mb-8">
          <img className="h-12 w-12 md:h-20 md:w-20" src={helmet} alt="" />
          <div>
            CricArena connects passionate players from local, city, and interstate levels, offering competitive tournaments that push boundaries and challenge talent.
          </div>
        </div>
        <div className="flex flex-row md:flex-row justify-between gap-12 mb-8">
          <img className="h-12 w-12 md:h-20 md:w-20" src={wicket} alt="" />
          <div>
            Easily organize and manage tournaments, from registration to results, with our user-friendly platform designed for all cricket enthusiasts.
          </div>
        </div>
        <div className="flex flex-row md:flex-row justify-between gap-12">
          <img className="h-12 w-12 md:h-20 md:w-20" src={stadium} alt="" />
          <div>
            Experience cricket excellence, where passion meets pitch, in a dynamic environment fostering sportsmanship, growth, and community engagement.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Joinus;
