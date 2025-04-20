import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faGear, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ServicesHub = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    
    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%", // Starts animation when 80% of the section is in view
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div ref={sectionRef} className="bg-black text-white py-16 px-6 md:px-20 lg:px-8">
      <div id="heading1" className="md:ml-28 ml:4 lg:text-6xl text-3xl text-orangex font-cabinet-extrabold font-bold lg:mt-8 mt-4 w-[250px] lg:w-[470px] md:pr-20 h-16 lg:h-24 lg:pt-2 pt-1 flex items-center justify-evenly rounded-r-3xl bg-black">
        <span className="text-white md:mr-2">Services</span> Hub
      </div>
      <span id='abcd' className="hidden md:block absolute left-0 rounded-e-lg h-[4px] w-[150px] bg-gradient-to-r from-transparent to-orangex animate-[animate_5s_linear_infinite]"></span>
      
      <div className="flex flex-col md:flex-row md:gap-80 mx-auto">
        <div className="mt-32 md:ml-60">
          <ul className="mt-4 space-y-2 md:space-y-3 text-xl">
            <li className="flex items-center space-x-2">
              <span>&#10145;</span> <span>Challenge Local Teams For Matches</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>&#10145;</span> <span>Register Grounds For Cricket</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>&#10145;</span> <span>Manage Tournaments Like A Pro</span>
            </li>
          </ul>
          <button className="mt-6 bg-orangex hover:bg-blue-700 text-black font-semibold py-2 px-6 rounded-xl">
            See All Services
          </button>
        </div>

        <div className="relative mt-12 max-w-[700px] text-xl">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="md:-mt-12 mr-4">
              <div className="bg-[#082621] p-6 rounded-3xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faGear} className="text-[#149f88] text-4xl" />
                  <h3 className="text-xl font-semibold">Find Teams</h3>
                </div>
                <p className="mt-2 text-gray-100">
                  CricArena offers a suite of services connecting players, teams, organizers, and grounds,
                  enhancing local cricket experiences.
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <div className="bg-[#372911] p-6 rounded-3xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-200 text-4xl">📂</span>
                  <h3 className="text-xl font-semibold">Book Grounds</h3>
                </div>
                <p className="mt-2 text-gray-200">
                  Browse and book available cricket grounds, ensuring the perfect venue for your matches
                  and tournaments with ease and convenience.
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="md:-mt-12 mr-4">
              <div className="bg-blue-950 p-6 rounded-3xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faLightbulb} className="text-blue-400 text-4xl" />
                  <h3 className="text-xl font-semibold">Track Stats</h3>
                </div>
                <p className="mt-2 text-gray-300">
                  Track performance, statistics, and match history with ease, enhancing your competitive
                  edge and showcasing your cricketing journey.
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <div className="bg-[#370101] p-6 rounded-3xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faPaperPlane} className="text-red-600 text-4xl" />
                  <h3 className="text-xl font-semibold">Manage Tournaments</h3>
                </div>
                <p className="mt-2 text-gray-300">
                  Organize, track, and manage tournaments effortlessly, making competition management smooth and enjoyable.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesHub;
