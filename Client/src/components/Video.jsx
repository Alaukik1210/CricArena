import React from "react";
import videowev from "../assets/lauki.mov";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const Video = () => {
  useGSAP(() => {
    gsap.from(" #video", {
      duration: 1,

      scrollTrigger: {
        trigger: " #video",
      },
    });
  });

  return (
    <div className="">
      <div className="">
        <video
          id="video"
          autoPlay
          loop
          muted
          playsInline
          className="w-full bg-white h-auto  "
          src={videowev}
        ></video>
      </div>
    </div>
  );
};

export default Video;
