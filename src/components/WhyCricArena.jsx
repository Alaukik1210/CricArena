import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Progressbar from "./ProgressBar";
gsap.registerPlugin(ScrollTrigger);
import ball from "../assets/ball.png";
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const WhyCricArena = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,   
  });
  useGSAP(() => {
    gsap.from("#box1", {
      x: 150,
      delay: 1.5,
      duration: 2,
      opacity: 0,

      scrollTrigger: {
        trigger: "#box1",
      },
    });
    gsap.from("#box2", {
      x: -150,
      delay: 2,
      duration: 2,
      opacity: 0,

      scrollTrigger: {
        trigger: "#box2",
      },
    });
    gsap.from("#box3", {
      x: 150,
      delay: 2.3,
      duration: 2,
      opacity: 0,

      scrollTrigger: {
        trigger: "#box3",
      },
    });
    gsap.from("#ball1", {
      x: 150,
      delay: 1.5,
      duration: 2,
      opacity: 0,

      scrollTrigger: {
        trigger: "#box1",
      },
    });
    gsap.to('#abcd',{
      x:390,
      duration:3,
      scrollTrigger:'#abcd'
    });
    gsap.from('#heading1',{
      x:-150,
      duration:2,
      opacity:1,
      scrollTrigger:'#heading1',
      // delay:1,
    })
  });

  return (
    <div className="h-fit overflow-hidden">
      <div id="heading1" className="md:ml-28 ml:4 lg:text-6xl text-3xl text-gold  font-cabinet-extrabold font-bold lg:mt-8 mt-4 w-[250px] lg:w-[470px] md:pr-20 h-16 lg:h-24 lg:pt-2 pt-1 flex items-center justify-evenly rounded-r-3xl  bg-black">
        <span className="text-white md:mr-2">Why  </span>   CricArena?
      </div>
      <span id='abcd' className=" hidden md:block absolute left-0  rounded-e-lg h-[4px] w-[150px] bg-gradient-to-r from-transparent to-gold animate-[animate_5s_linear_infinite]"></span>
      <motion.span
        animate={inView ? { x: 180 } : { x: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        ref={ref}
      
        className="block md:hidden absolute left-0 rounded-e-lg h-[4px] w-[80px] bg-gradient-to-r from-transparent to-gold animate-[animate_5s_linear_infinite]"
      ></motion.span>
      
      <div className="hidden lg:block h-[80vh] bg-black mx-20">
        {/* <Progressbar/> */}
        <div className="flex justify-end gap-8">
          <div className="flex gap-12">
          <div id="ball1" className="w-12">
        <img className="h-12 mt-4  " src={ball} alt="" />
      </div>
          </div>
        <div
          id="box1"
          className="bg-goldx w-[700px] rounded-3xl texl-3xl  font-product-sans font-semibold px-4  right-40 top-[3250px] pt-8 h-[25vh] text-white"
        >
          <div className="text-gold text-4xl pb-4 font-cabinet-bold ">
            No location Barrier: <br />
          </div>
          At cricArena, we organize tournaments from local to interstate levels,
          breaking geographical boundaries and challenging players to step out
          of their comfort zones. By competing against diverse opponents,
          players enhance their skills, grow, and embrace new challenges,
          promoting sportsmanship and development.
        </div>
        </div>
        
       
        <div className="flex justify-start gap-8">
          <div className="flex gap-12">
          <div id="ball1" className="w-12">
        <img className="h-12 mt-4  " src={ball} alt="" />
      </div>
          </div>
        <div
          id="box2"
          className="bg-goldx w-[700px] rounded-3xl texl-3xl  font-product-sans font-semibold px-4  right-40 top-[3250px] pt-8 h-[25vh] text-white"
        >
          <div className="text-gold text-4xl pb-4 font-cabinet-bold ">
          Seamless Managment: <br />
          </div>
          At cricArena, we handle every aspect of tournament management, from
          booking grounds and coordinating hotel accommodations to organizing
          refreshments and rewards. Our comprehensive approach ensures a
          seamless experience for players and teams, allowing them to focus on
          the game while we manage the logistics, creating a smooth and
          professional tournament environment.
        </div>
        </div>
        <div className="flex justify-end gap-8">
          <div className="flex gap-12">
          <div id="ball1" className="w-12">
        <img className="h-12 mt-4  " src={ball} alt="" />
      </div>
          </div>
        <div
          id="box3"
          className="bg-goldx w-[700px] rounded-3xl texl-3xl  font-product-sans font-semibold px-4  right-40 top-[3250px] pt-8 h-[25vh] text-white"
        >
          <div className="text-gold text-4xl pb-4 font-cabinet-bold ">
          Live match Updates: <br />
          </div>
          At cricArena, we bring the excitement of the game straight to your
          screen with real-time live match updates. Whether you're following
          your favorite local team or tracking an interstate tournament, our
          live scoreboard and scorecard keep you in the loop from the first ball
          to the final over.
        </div>
        </div>
        
      </div>
      {/* ---------------------------------------- */}
      <div className="lg:hidden">
        <div
          id="box1"
          className="bg-goldx w-fit mx-4 rounded-3xl texl-l pb-4 mt-4 font-product-sans font-semibold px-4 pt-1 h-fit text-white"
        >
          <div className="text-gold text-xl pb-4 font-cabinet-bold ">
          No location Barrier: <br />
          </div>
          At cricArena, we organize tournaments from local to interstate levels,
          breaking geographical boundaries and challenging players to step out
          of their comfort zones. By competing against diverse opponents,
          players enhance their skills, grow, and embrace new challenges,
          promoting sportsmanship and development.
        </div>
        <div
          id="box2"
          className="bg-goldx w-fit h-fit mx-4 rounded-3xl texl-l pb-4  mt-4 font-product-sans font-semibold px-4 pt-1 text-white"
        >
          <div className="text-gold text-xl pb-4 font-cabinet-bold ">
          Seamless Managment: <br />
          </div>
          At cricArena, we handle every aspect of tournament management, from
          booking grounds and coordinating hotel accommodations to organizing
          refreshments and rewards. Our comprehensive approach ensures a
          seamless experience for players and teams, allowing them to focus on
          the game while we manage the logistics, creating a smooth and
          professional tournament environment.
        </div>
        <div
          id="box3"
          className="bg-goldx w-fit h-fit mx-4 rounded-3xl texl-l pb-4  mt-4 font-product-sans font-semibold px-4 pt-1  text-white"
        >
          <div className="text-gold text-xl pb-4 font-cabinet-bold ">
          Live match Updates: <br />
          </div>
          At cricArena, we bring the excitement of the game straight to your
          screen with real-time live match updates. Whether you're following
          your favorite local team or tracking an interstate tournament, our
          live scoreboard and scorecard keep you in the loop from the first ball
          to the final over.
        </div>
      </div>
    </div>
  );
};

export default WhyCricArena;
