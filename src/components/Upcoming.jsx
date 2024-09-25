import React,{useEffect} from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { easeIn } from 'framer-motion/dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);


const Upcoming = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,   
  });

  useGSAP(() => {
    gsap.from('#m1', {
      x: 200,
      opacity: 0,
      duration: 1,
      ease: easeIn,
      scrollTrigger: {
        trigger: '#m1',
        // scrub:1
      
      },
    });
    gsap.from('#m2', {
        x: -200,
        opacity: 0, 
        duration: 1,
        ease: easeIn, 
        scrollTrigger: {
          trigger: '#m2', 
          // scrub:1
         
        },
      });
      gsap.from('#m3', {
        x: 200,
        opacity: 0, 
        
        duration: 1,
        // ease: 'power3.out', 
        scrollTrigger: {
          trigger: '#m3', 
          // scrub:1
         
        },
      });
      gsap.from('#m4', {
        x: -200,
        opacity: 0, 
        duration: 1,
        
        // ease: 'power3.out', 
        scrollTrigger: {
          trigger: '#m4', 
          // scrub:1
           
        },
      });
      gsap.from('#m5', {
        x: 200,
        opacity: 0, 
        duration: 1,
        
        // ease: 'power3.out', 
        scrollTrigger: {
          trigger: '#m5', 
          // scrub:1
         
        },
      });
      gsap.from('#m6', {
        x: -200,
        opacity: 0, 
        duration: 1,
        
        ease: 'power3.out', 
        scrollTrigger: {
          trigger: '#m6', 
          // scrub:1
          
        },
      });
      gsap.to('#abcde',{
        x:480,
        duration:3,
        scrollTrigger:'#abcde'
      });
      gsap.from('#heading',{
        x:-150,
        duration:2,
        opacity:1,
        delay:0.6,
        scrollTrigger:'#heading'
      })
  });




  return (
    <div id='tour' className=' mt-20 '>
        <div id="heading" className="md:ml-28 ml:4 lg:text-6xl text-3xl text-gold  font-cabinet-extrabold font-bold lg:mt-8 mt-4 w-[250px] lg:w-[470px] md:pr-20 h-16 lg:h-24 lg:pt-2 pt-1 flex items-center justify-evenly rounded-r-3xl  bg-black">
        <span className="text-white md:mr-2">Upcoming  </span>   Matches
      </div>
      <span id='abcde' className=" hidden md:block absolute left-0  rounded-e-lg h-[4px] w-[150px] bg-gradient-to-r from-transparent to-gold animate-[animate_5s_linear_infinite]"></span>
      <motion.span
        animate={inView ? { x: 180 } : { x: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        ref={ref}
      
        className="block md:hidden absolute left-0 rounded-e-lg h-[4px] w-[80px] bg-gradient-to-r from-transparent to-gold animate-[animate_5s_linear_infinite]"
      ></motion.span>

        <div className=' bg-ball bg-cover h-full'>
          <div className='pt-12 md:mt-12  md:ml-36 ml-4'>
          <div className='md:text-5xl text-2xl font-cabinet-bold  m-4 md:ml-20 text-gold font-semibold '>
            Mark your calender
          </div>
          <div  className='md:text-2xl text-md font-cabinet-bold md:ml-20 m-4 mt-6 text-white font '>
            Check out the upcoming cricket matches officiated by <span className='text-gold'>CRICARENA</span> .Stay updated on the match schedules,<br/> venues, and participating teams to witness the excitment of cricket 
          </div>
          </div>
          
            <div className='md:flex md:justify-evenly md:m-20 grid-cols-1 m-4 overflow-hidden'>
            <div id='m1' onClick={()=>navigate("/score")} className=' overflow-hidden h-[416px] rounded-3xl border-1   hover:border-0.5   border-goldx cursor-pointer   ease-in-out duration-300 bg-matches bg-cover bg-no-repeat size-[250px] w-[350px] border-4 md:size-[400px] md:w-[650px] md:mt-20 m-4 '>
               
                <h1 className='text-gold bg-goldx text-5xl font-cabinet-black font bold flex justify-center items-baseline mt-[280px] '>Match 1</h1>
                <span className='text-black  text-2xl font-cabinet-bold bg-gold flex justify-center'>click here</span>
                <span className='text-gold  text-xl font-cabinet-bold pb-2 bg-goldx flex justify-center '>Bennett Vs Galgotia </span>
                
            </div>
           

                <div id='m2'  onClick={()=>navigate("/score")} className='  overflow-hidden h-[416px] rounded-3xl border-1  hover:border-0.5 m-4   border-goldx cursor-pointer hover:scale-95 ease-in-out duration-300 bg-matches1 bg-cover bg-no-repeat  size-[250px] w-[350px] border-4 md:size-[400px] md:w-[650px] md:mt-20 '>
               
                <h1 className='text-gold  bg-goldx text-5xl font-cabinet-black font bold flex justify-center items-baseline  mt-[280px]    '>Match 2</h1>
                <span className='text-black  text-2xl font-cabinet-bold bg-gold flex justify-center'>click here</span>
                <span className='text-gold  text-xl font-cabinet-bold pb-2 bg-goldx flex justify-center '>IIT Delhi Vs IIT Roorkee </span>
            </div>
            
            </div>
            <div className='md:flex md:justify-evenly md:m-20 grid-cols-1 m-4'>
            <div id='m3'  onClick={()=>navigate("/score")} className='  overflow-hidden h-[416px] rounded-3xl border-1  hover:border-0.5 m-4   border-goldx cursor-pointer hover:scale-95 ease-in-out duration-300 bg-matches2 bg-cover bg-no-repeat   size-[250px] w-[350px] border-4 md:size-[400px] md:w-[650px] '>
               
                <h1 className='text-gold  bg-goldx text-5xl font-cabinet-black font bold flex justify-center items-baseline  mt-[280px]    '>Match 3</h1>
                <span className='text-black  text-2xl font-cabinet-bold bg-gold flex justify-center'>click here</span>
                <span className='text-gold  text-xl font-cabinet-bold pb-2 bg-goldx flex justify-center '>CU Vs VIT </span>
            </div>
           

                <div id='m4'  onClick={()=>navigate("/score")} className='  overflow-hidden h-[416px] rounded-3xl border-1  hover:border-0.5 m-4   border-goldx cursor-pointer hover:scale-95 ease-in-out duration-300 bg-matches3 bg-cover bg-no-repeat   size-[250px] w-[350px] border-4 md:size-[400px] md:w-[650px] '>
               
                <h1 className='text-gold  bg-goldx text-5xl font-cabinet-black font bold flex justify-center items-baseline  mt-[280px]    '>Match 4</h1>
                <span className='text-black  text-2xl font-cabinet-bold bg-gold flex justify-center'>click here</span>
                <span className='text-gold  text-xl font-cabinet-bold pb-2 bg-goldx flex justify-center '>LU Vs DU </span>
            </div>
            
            </div>
           
            
            
           
        </div>
      
    </div>
  )
}

export default Upcoming
