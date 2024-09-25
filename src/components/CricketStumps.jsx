import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { div } from "framer-motion/client";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MotionPathPlugin);
import ball from "../assets/ball.png";

const CricketStumps = () => {
  const stump1Ref = useRef(null);
  const stump2Ref = useRef(null);
  const stump3Ref = useRef(null);
  const bail1Ref = useRef(null);
  const bail2Ref = useRef(null);
  // const ball = useRef(null);

  useEffect(() => {
    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

    // Animate the bails to fall off

    timeline.to(
      "#ball",
      {
        duration: 1.5,
        motionPath: {
          path: [
            { x: 0, y: 0 },
            { x: -150, y: -270 },
          ],
          // alignOrigin:[50,0],
        },
      },
      0
    );
    timeline.to(
      [bail1Ref.current],
      {
        y: 100,
        delay: 1,
        rotation: -145,
        duration: 1.8,
        ease: "power1.out",
        motionPath: {
          path: [
            { x: 0, y: 0 },
            { x: -50, y: -50 },
          ],
          alignOrigin: [-50, 0],
        },
      },
      0
    );
    timeline.to(
      [bail2Ref.current],
      {
        y: -30,
        delay: 1,
        rotation: 145,
        duration: 1.8,
        ease: "power1.out",
        motionPath: {
          path: [
            { x: 0, y: 0 },
            { x: 50, y: -70 },
          ],
          // alignOrigin:[50,0],
        },
      },
      0
    );

    // Animate the stumps to break apart
    timeline.to(
      [stump1Ref.current],
      {
        rotation: -10,
        x: -30,
        delay: 1,
        y: 10,
        duration: 0.8,
        // rotateX:50,
        ease: "power1.out",
      },
      0
    );
    timeline.to(
      stump3Ref.current,
      {
        rotation: 10,
        y: 10,
        x: 30,
        delay: 1,
        duration: 0.8,
        ease: "power1.out",
      },
      0
    );

    timeline.to(
      stump2Ref.current,
      {
        rotation: 0,
        y: 10,
        //   x: -20,
        duration: 0.8,
        delay: 1,
        ease: "power1.out",
      },
      0
    );

    // Reset everything to initial position
    timeline.to("#ball", {
      y: 0,
      x: 0,
      rotation: 0,
      duration: 1,
      ease: "power1.inOut",
    });
    timeline.to([stump1Ref.current, stump2Ref.current, stump3Ref.current], {
      rotation: 0,
      x: 0,
      y: 0,
      duration: 1,
      ease: "power1.inOut",
    });

    timeline.to([bail1Ref.current, bail2Ref.current], {
      y: 0,
      x: 0,
      rotation: 0,
      duration: 1,
      ease: "power1.inOut",
    });
    
  }, []);

  return (
    <div className="overflow-hidden">
      

      <div>
        <div className="ml-40 text-end">
          <div className="h-[50vh]  absolute pl-20 right-40 pb-20 bg-black">
            <div className="">
              {/* Stumps */}
              <div
                ref={stump1Ref}
                className="w-4 h-[40vh] bg-goldy rounded-t-lg absolute -bottom-8 left-[32px]"
              ></div>
              <div
                ref={stump2Ref}
                className="w-4 h-[40vh] bg-goldy rounded-t-lg absolute -bottom-8 left-[72px]"
              ></div>
              <div
                ref={stump3Ref}
                className="w-4 h-[40vh] bg-goldy rounded-t-lg absolute -bottom-8 left-28"
              ></div>

              {/* Bails */}
              <div
                ref={bail1Ref}
                className="w-10 h-2 bg-goldy rounded-s-md rounded-e-md absolute mt-96 -top-[268px] left-[34px]"
              ></div>
              <div
                ref={bail2Ref}
                className="w-10 h-2 bg-goldy absolute  rounded-s-md mt-96 rounded-e-md  -top-[268px] left-[85px]"
              ></div>
              <div id="ball" className="w-fit ">
                <img className="h-12 ml-40 mt-96" src={ball} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default CricketStumps;

