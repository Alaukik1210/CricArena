import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Upcoming = () => {
  const navigate = useNavigate();
  
  // For the heading section
  const [headingRef, headingInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  // For the content section
  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  // For each match card
  const [cardsRef, cardsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
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
  
  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.3
      }
    }
  };
  
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut"
      }
    },
    hover: {
      scale: 0.95,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    }
  };

  // Custom line animation
  const lineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "35%",
      transition: { 
        duration: 2, 
        ease: "easeInOut"
        
      }
    }
  };

  const matchData = [
    {
      id: 1,
      title: "Match 1",
      teams: "IIT Delhi Vs IIT Roorkee",
      bgClass: "bg-matches"
    },
    {
      id: 2,
      title: "Match 2",
      teams: "IIT Delhi Vs IIT Roorkee",
      bgClass: "bg-matches1"
    },
    {
      id: 3,
      title: "Match 3",
      teams: "CU Vs VIT",
      bgClass: "bg-matches2"
    },
    {
      id: 4,
      title: "Match 4",
      teams: "LU Vs DU",
      bgClass: "bg-matches3"
    }
  ];

  return (
    <div id='tour' className='mt-20 overflow-hidden'>
      <motion.div
        ref={headingRef}
        variants={headingVariants}
        initial="hidden"
        animate={headingInView ? "visible" : "hidden"}
        className="relative"
      >
        <div id="heading" className="md:ml-28 ml-4 lg:text-6xl text-3xl text-gold font-cabinet-extrabold font-bold lg:mt-8 mt-4 w-[250px] lg:w-[470px] md:pr-20 h-16 lg:h-24 lg:pt-2 pt-1 flex items-center justify-evenly rounded-r-3xl bg-black">
          <span className="text-white md:mr-2">Upcoming</span> Matches
        </div>
        
        <motion.span
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="absolute left-0 rounded-e-lg h-[4px] md:w-[150px] w-[80px] bg-gradient-to-r from-transparent to-gold"
        ></motion.span>
      </motion.div>

      <div className='bg-ball bg-cover h-full'>
        <motion.div
          ref={contentRef}
          variants={contentVariants}
          initial="hidden"
          animate={contentInView ? "visible" : "hidden"}
          className='pt-12 md:mt-12 md:ml-36 ml-4'
        >
          <div className='md:text-5xl text-2xl font-cabinet-bold m-4 md:ml-20 text-gold font-semibold'>
            Mark your calendar
          </div>
          <div className='md:text-2xl text-md font-cabinet-bold md:ml-20 m-4 mt-6 text-white'>
            Check out the upcoming cricket matches officiated by <span className='text-gold'>CRICARENA</span>. Stay updated on the match schedules,<br className="hidden md:block"/> venues, and participating teams to witness the excitement of cricket 
          </div>
        </motion.div>
        
        <motion.div
          ref={cardsRef}
          variants={cardContainerVariants}
          initial="hidden"
          animate={cardsInView ? "visible" : "hidden"}
          className="w-full"
        >
          {/* Grid container for all cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-8 lg:px-20 mt-12">
            {matchData.map((match) => (
              <motion.div 
                key={match.id}
                variants={cardVariants}
                whileHover="hover"
                onClick={() => navigate("/score")} 
                className={`overflow-hidden h-[416px] rounded-3xl border-4 border-goldx cursor-pointer ${match.bgClass} bg-cover bg-no-repeat w-full mx-auto max-w-[650px]`}
              >
                <motion.div
                  initial={{ y: 20, opacity: 1 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-full relative flex flex-col justify-end"
                >
                  <div className="mt-auto">
                    <h1 className='text-gold bg-goldx text-4xl md:text-5xl font-cabinet-black font-bold flex justify-center items-baseline'>
                      {match.title}
                    </h1>
                    <span className='text-black text-xl md:text-2xl font-cabinet-bold bg-gold flex justify-center'>
                      click here
                    </span>
                    <span className='text-gold text-lg md:text-xl mb-4 font-cabinet-bold pb-2 bg-goldx flex justify-center'>
                      {match.teams}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upcoming;