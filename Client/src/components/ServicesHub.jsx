import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faGear, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ServicesHub = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const headingRef = useRef(null);
const [headingInView] = useInView({
  threshold: 0.3,
  triggerOnce: true
});

const headingVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    }
  }
};

const lineVariants = {
  hidden: { width: 0 },
  visible: { 
    width: "27%",
    transition: { 
      duration: 2, 
      ease: "easeInOut"
    }
  }
};

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const serviceCardVariants = {
    hidden: { 
      y: 50,
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.8,
        bounce: 0.3
      }
    }
  };

  const listItemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
  ref={headingRef}
  variants={headingVariants}
  initial="hidden"
  animate={headingInView ? "visible" : "hidden"}
  className="relative"
>
  <div className="md:ml-28 ml:4 lg:text-6xl text-3xl text-orangex font-cabinet-extrabold font-bold lg:mt-8 mt-4 w-[250px] lg:w-[470px] md:pr-20 h-16 lg:h-24 lg:pt-2 pt-1 flex items-center justify-evenly rounded-r-3xl bg-black">
    <span className="text-white md:mr-2">Services</span> Hub
  </div>
  
  <motion.span
    variants={lineVariants}
    initial="hidden"
    animate="visible"
    className="absolute left-0 rounded-e-lg h-[4px] md:w-[150px] w-[80px] bg-gradient-to-r from-transparent to-orangex"
  ></motion.span>
      
      <div className="flex flex-col md:flex-row md:gap-80 mx-auto">
        <motion.div 
          variants={containerVariants}
          className="mt-32 md:ml-60"
        >
          <motion.ul className="mt-4 space-y-2 text-white md:space-y-3 text-xl">
            {["Challenge Local Teams For Matches", "Register Grounds For Cricket", "Manage Tournaments Like A Pro"].map((text, index) => (
              <motion.li
                key={index}
                variants={listItemVariants}
                className="flex items-center space-x-2"
              >
                <span>&#10145;</span> <span>{text}</span>
              </motion.li>
            ))}
          </motion.ul>
          <motion.button
            variants={listItemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 bg-orangex hover:bg-blue-700 text-black font-semibold py-2 px-6 rounded-xl"
          >
            See All Services
          </motion.button>
        </motion.div>

        <div className="relative mt-12 max-w-[700px] text-xl">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                className: "md:-mt-12 mr-4",
                bg: "bg-[#082621]",
                icon: faGear,
                iconColor: "text-[#149f88]",
                title: "Find Teams",
                text: "CricArena offers a suite of services connecting players, teams, organizers, and grounds, enhancing local cricket experiences."
              },
              {
                bg: "bg-[#372911]",
                emoji: "📂",
                title: "Book Grounds",
                text: "Browse and book available cricket grounds, ensuring the perfect venue for your matches and tournaments with ease and convenience."
              },
              {
                className: "md:-mt-12 mr-4",
                bg: "bg-blue-950",
                icon: faLightbulb,
                iconColor: "text-blue-400",
                title: "Track Stats",
                text: "Track performance, statistics, and match history with ease, enhancing your competitive edge and showcasing your cricketing journey."
              },
              {
                bg: "bg-[#370101]",
                icon: faPaperPlane,
                iconColor: "text-red-600",
                title: "Manage Tournaments",
                text: "Organize, track, and manage tournaments effortlessly, making competition management smooth and enjoyable."
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={serviceCardVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className={service.className}
              >
                <div className={`${service.bg} p-6 rounded-3xl shadow-lg`}>
                  <div className="flex items-center space-x-3">
                    {service.emoji ? (
                      <span className="text-4xl">{service.emoji}</span>
                    ) : (
                      <FontAwesomeIcon icon={service.icon} className={`${service.iconColor} text-4xl`} />
                    )}
                    <h3 className="text-xl text-white font-semibold">{service.title}</h3>
                  </div>
                  <p className="mt-2 text-gray-300">{service.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServicesHub;