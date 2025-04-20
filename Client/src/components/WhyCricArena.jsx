import React from "react";
import { motion } from "framer-motion";
import ball from "../assets/ball.png";

const fadeInVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } },
};

const WhyCricArena = () => {
  return (
    <div className="h-fit overflow-hidden">
      <motion.div
        className="md:ml-28 ml:4 lg:text-6xl text-3xl text-gold font-cabinet-extrabold font-bold lg:mt-8 mt-4 w-[250px] lg:w-[470px] md:pr-20 h-16 lg:h-24 lg:pt-2 pt-1 flex items-center justify-evenly rounded-r-3xl bg-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInVariants}
      >
        <span className="text-white md:mr-2">Why</span> CricArena?
      </motion.div>
      
      <div className="lg:block h-fit bg-black mx-4 lg:mx-20">
        {[{
          title: "No location Barrier:",
          content: "At CricArena, we organize tournaments from local to interstate levels, breaking geographical boundaries and challenging players to step out of their comfort zones.",
        }, {
          title: "Seamless Management:",
          content: "At CricArena, we handle every aspect of tournament management, from booking grounds and coordinating accommodations to organizing refreshments and rewards.",
        }, {
          title: "Live match Updates:",
          content: "At CricArena, we bring the excitement of the game straight to your screen with real-time live match updates.",
        }].map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col lg:flex-row items-center gap-4 my-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariants}
          >
            <motion.img
              src={ball}
              alt="ball"
              className="w-12 h-12 hidden lg:block"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 1 } }}
              viewport={{ once: true }}
            />
            <div className="bg-goldx w-full lg:w-[700px] rounded-3xl px-4 py-4 text-white font-product-sans font-semibold">
              <div className="text-gold text-xl lg:text-4xl pb-2 font-cabinet-bold">{item.title}</div>
              <p className="text-sm lg:text-base">{item.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WhyCricArena;
