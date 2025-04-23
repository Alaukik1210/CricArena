import React from "react";
import { motion } from "framer-motion";
// import nobg from "../assets/nobg.png"
import { useNavigate } from "react-router-dom";

const Hero = () => {

  const navigate = useNavigate();
  return (
    <div className="z-10">
      {/* Main Hero Section with Smooth Scroll Effect */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="bg-hero mt-16 sm:mt-20 md:mt-32 min-h-[60vh] sm:h-[70vh] px-4 sm:px-10 md:px-20 lg:pl-40 flex flex-col justify-center font-display"
      >
        {/* Main Heading */}
        <div className="flex justify-between">

       
        <div className="w-full sm:w-[70%] md:w-[65%] lg:w-[55%]">

        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-white font-extrabold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-7xl w-full md:w-[90%] lg:w-[80%]"
        >
          Host Your <span className="text-orangex">Cricket</span> <br /> Tournament
          With <br /> Excellence
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6"
        >
          <button onClick={()=>navigate('/tournament')}  className="text-lg z-10 sm:text-xl font-bold px-6 sm:px-8 py-2 bg-orangex rounded-2xl">
            Host Tournament
          </button>
          <button onClick={()=>navigate('/score')} className="text-lg sm:text-xl font-bold z-10 px-6 sm:px-8 py-2 border-2 border-orangex text-white rounded-2xl">
            Ready To Play?
          </button>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col xs:flex-row gap-4 sm:gap-6 mt-6 sm:mt-8 md:mt-12 text-center sm:text-left"
        >
          <div className="flex justify-center sm:justify-start gap-4 sm:gap-6 text-xl sm:text-2xl md:text-3xl font-bold text-orangex">
            <span>10+ <br /> <span className="text-lg sm:text-xl font-semibold italic text-white">Cities</span></span>
            <span>50+ <br /> <span className="text-lg sm:text-xl font-semibold italic text-white">Tournaments</span></span>
            <span>500+ <br /> <span className="text-lg sm:text-xl font-semibold italic text-white">Players</span></span>
          </div>
        </motion.div>
        </div>
        <div className="hidden sm:block w-full sm:w-[35%] md:w-[30%]">
          {/* <img className="w-[90%]" src={nobg} alt="" /> */}
        </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
