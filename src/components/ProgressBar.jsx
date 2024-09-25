import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const Progressbar = () => {
 
  const progressRef = useRef(null);
  const ballRefs = useRef([]);
  useGSAP(()=>{
    gsap.to('#bar',{
        scaleY:1,
        transformOrigin: 'top',
        duration: 2,
        ease: 'power1.inOut',
        scrollTrigger:{
            trigger:progressRef.current,
           
            start:'top 150%'
           
        }
    });
    gsap.to('#ball1', {
        y: -380, 
        x:-850,
        duration: 2,
        scrollTrigger: {
          trigger: '#ball1',
           start:'top 150%'
          
          
        },
      });
      gsap.to('#ball2', {
        y: -580, 
        duration: 2,
        scrollTrigger: {
          trigger: '#ball2',
           start:'top 150%'
          
        },
      });
      gsap.to('#ball3', {
        y: -150, 
        duration: 2,
        opacity:1,
        scrollTrigger: {
          trigger: '#ball3',
           start:'top 150%'
          
        },
      });

  })



 
   
  return (
    <div className="mt-4 mx-auto max-w-[95%] md:max-w-[70%] lg:max-w-[50%] h-[70vh] lg:h-[700px] w-[1%] flex justify-center rounded-full relative">
      {/* Progress bar */}
      <div
        id="bar"
        ref={progressRef}
        className="w-full h-[70vh] bg- rounded-full"
        style={{ transform: 'scaleY(0)', transformOrigin: 'bottom' }} 
      />

      {/* Ball 1 */}
      <div id='ball1'
        ref={(el) => (ballRefs.current[0] = el)}
        className="absolute bottom-0 w-6 h-6 bg-gold rounded-full"
        
        style={{ transform: 'translateY(-50%)' }} 
      />

      {/* Ball 2 */}
      <div id='ball2'
        ref={(el) => (ballRefs.current[1] = el)} 
        className="absolute bottom-0 w-6 h-6 bg-gold rounded-full"
        style={{ transform: 'translateY(-50%)' }}
      />

      {/* Ball 3 */}
      <div id='ball3'
        ref={(el) => (ballRefs.current[2] = el)}
        className="absolute bottom-0 w-6 h-6 left-0 bg-gold rounded-full"
        style={{ transform: 'translateY(-50%)' }}
      />
    </div>
  );
};

export default Progressbar;
