import React from 'react'
import vector from'../assets/Cricket-pana - Copy.png'
import ball from '../assets/ballsvg.svg'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import { useNavigate } from 'react-router-dom';
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(MotionPathPlugin);


const Join = () => {
  const navigate = useNavigate() 
  useGSAP(()=>{
    gsap.to('#b1', {
      duration: 3,
      scrollTrigger:'#b1',
      delay:1.5,
      
      motionPath: {
        path: [{ x: -1000, y: 800 }, { x: -700, y: 100 }], 
        curviness: 2, 
         
      },
      scale: 4,
      opacity: 0,
    });
    gsap.from('#text',{
      x:-200,
      opacity:0,
      duration:2,
      scrollTrigger:'#text'
    });
    gsap.from('#img',{
      // x:-200,
      opacity:0,
      duration:5,
    });
    
  })
  return (
    <div className='h-screen  pt-12 -translate-y-4 md:pt-40 bg-black '>
        <div className='hidden md:block'>

        
      <div className='flex justify-evenly text-xl font-semibold text-white font-product-sans '>
       
        <div id='text' className='mt-40 p-8 text-left w-[1500px] bg-goldx rounded-3xl  h-fit mb-8 ml-28 z-40'>
          <div className='font-cabinet-medium text-4xl  text-gold mb-8'>
          Together We Rise, Together We Play!
          </div>
            <div className=''>Join <span className='text-gold'>CricArena</span> and unleash your cricketing potential! Connect with teams, play in exciting local tournaments, and rise through the ranks. Whether you’re a seasoned pro or a passionate newcomer, the field is waiting for you. Ready to hit your way to glory? 
            </div > 
            <div className='text-left mt-4 '>
      <button onClick={()=>navigate("/SignUp")} type="submit" className="group relative h-8 w-40 overflow-hidden rounded-2xl bg-goldx text-lg font-bold border-2 border-gold text-gold text-center">JOIN NOW
      <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
      </button>
      </div>
         </div>      
        <div id='img' className='overflow-hidden '>
            <img className='w-[1700px] h-[80vh]' src={vector} alt="" />
            <img id='b1' className=' hidden md:block h-[100vh] top-[520px] right-[585px] absolute ' src={ball} alt="" />
            
        </div>
       
      </div>
      {/* ------------------------mobile---------------------------- */}
      </div>
      <div className='md:hidden block m-6'>
      <div className=' flex-row text-l  text-white font-product-sans '>
      <div className='overflow-hidden'>
           <img className='w-[1700px] h-[40vh]' src={vector} alt="" />
           <img id='b1' className=' hidden md:block h-[100vh] top-[1320px] right-[585px] absolute ' src={ball} alt="" />
           
       </div>
       <div className='mt-6 text-left ml-4'>
       <div className='font-cabinet-medium text-2xl hover:bg-black text-gold mb-8'>
          Together We Rise, Together We Play!
          </div>
       <div>Join <span className='text-gold'>CricArena</span> and unleash your cricketing potential! Connect with teams, play in exciting local tournaments, and rise through the ranks. Whether you’re a seasoned pro or a passionate newcomer, the field is waiting for you. Ready to hit your way to glory? 
       </div > 
       <div className='text-center'>
        <button className='bg-gold text-black mt-8 text-center font-cabinet-bold  px-8 text-2xl rounded-full '>join now</button>
       </div>
        </div>      
      
      
     </div>
      </div>
     
    </div>
  )
}

export default Join
