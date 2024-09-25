import React,{useEffect,useRef} from "react";
import bg from '../assets/window.png'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)



const Hero = () => {
    useGSAP(() =>{
        gsap.to('#img-container',{
          scale:52,
          ease:"ease",
          scrollTrigger:{
            trigger:'.hero',
            scrub:1,
            start:"top top",
            end:"bottom",
            pin:true
              

            }
          })
    })
    useGSAP(()=>{
        gsap.from("#exp",{
            x:-200,
            duration:2,
            delay:1.5,
            opacity:0,
        })
        gsap.from("#a",{
          x:-200,
          duration:2,
          delay:1.5,
          opacity:0,
        })
        gsap.from("#crick",{
          x:-200,
          duration:2,
          delay:1.5,
          opacity:0,
        })
        gsap.from("#exel",{
          x:-200,
          duration:2,
          delay:1.5,
          opacity:0,
        })
        gsap.from("#slogan",{
            x:200,
            duration:2,
            delay:3.4,
            opacity:0,
        })
      })
      

  return (
    <div id="top" className="">
      <div className='hero top-0 absolute overflow-hidden object-cover md:h-[100vh] h-[60vh] w-full'>
        <img id='img-container' className='hidden md:block md:h-[100vh] h-[60vh] top-0 w-full absolute' src={bg} alt="" />
      </div>
      <div className='font-cabinet-extrabold md:ml-24 md:m-40 -mt-12 md:mt-32 w-fit ml-8 mr-8'>
      <div id='exp' className='md:text-7xl text-5xl  text-gold font-bold'>Experience a</div>
      <div id='a' className='md:text-7xl text-3xl text-gold font-semibold mt-4 md:mt-4' ><span id='crick' className='text-white'>cricket</span> Excellence </div>
      {/* <div id='exel'  className='md:text-8xl text-4xl text-gold font-semibold mt-4 md:mt-4'></div> */}
      <div id='slogan' className=' md:text-2xl text-l w-[300px] md:w-full  text-white mt-4'>With <span className='text-gold font-bold'>CricArena</span> Where passion meet the pitch.</div>
      </div>

     

      
    </div>
  )
}

export default Hero
