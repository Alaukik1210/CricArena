import React from "react";
import { motion } from "framer-motion";

const About_cric = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-white bg-black">
      

      {/* About Section */}
      <h1 className="text-4xl font-bold mb-6 mt-28 text-[#FFD070]">About CricArena</h1>
      <p className="text-lg mb-8 text-gray-300">
        <strong>CricArena</strong> is the ultimate digital platform that transforms how cricket is played, booked,
        and experienced — both competitively and recreationally. Whether you're a casual enthusiast, a college team,
        or a serious cricketer, CricArena is your go-to destination.
      </p>

      {/* Vision Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-[#FFD070] mb-4">🎯 Our Vision</h2>
        <p className="text-gray-300">
          To build a <strong>smart, accessible, and competitive cricketing ecosystem</strong> where players of all levels can
          connect, compete, and grow — beyond geographical boundaries.
        </p>
      </section>

      {/* What We Offer Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-[#FFD070] mb-4">🚀 What We Offer</h2>
        <ul className="space-y-4 list-disc list-inside text-gray-300">
          <li>
            <strong>🗓️ Real-Time Session Booking:</strong> Seamlessly browse and book nets or full-ground matches
            with <span className="text-[#FFD070] font-medium">live slot updates</span> powered by Socket.IO.
          </li>
          <li>
            <strong>👥 Player & Team Profiles:</strong> Track your journey, connect with players, and build or join
            teams.
          </li>
          <li>
            <strong>🏆 Tournaments Without Boundaries:</strong> Participate in or host intra/inter-college & interstate
            matches easily.
          </li>
          <li>
            <strong>📍 Location-Based Matchmaking:</strong> Discover matches and players nearby, ready to play.
          </li>
          <li>
            <strong>🔁 Automated Session Management:</strong> Our system auto-expires old sessions using cron jobs
            for freshness.
          </li>
        </ul>
      </section>

      {/* Why CricArena Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-[#FFD070] mb-4">💡 Why CricArena?</h2>
        <ul className="grid sm:grid-cols-2 gap-4 text-gray-300">
          <li>🔄 Real-Time Experience with WebSockets</li>
          <li>⚙️ Smooth UI using React, Tailwind, ShadCN UI & GSAP</li>
          <li>🔐 Scalable backend with Node.js, PostgreSQL & Prisma</li>
          <li>🧑‍🤝‍🧑 Built for and by cricket lovers</li>
          <li>🌐 Flexible for both casual games and major tournaments</li>
        </ul>
      </section>

      {/* Journey Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-[#FFD070] mb-4">🌱 Our Journey</h2>
        <p className="text-gray-300">
          CricArena started with a vision to eliminate the chaos of local cricket session arrangements.
          What began in our college corridors is now a regional platform where the spirit of cricket never sleeps.
        </p>
      </section>

      {/* Join the Movement Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-[#FFD070] mb-4">🤝 Join the Movement</h2>
        <p className="text-gray-300">
          Whether you're a <strong>player</strong>, <strong>team captain</strong>, <strong>venue owner</strong>,
          or <strong>tournament organizer</strong>, CricArena is built to empower <em>your cricketing journey</em>.
        </p>
      </section>

      {/* Contact Section */}
      <section>
        <h2 className="text-2xl font-semibold text-[#FFD070] mb-4">📲 Get in Touch</h2>
        <ul className="text-gray-300 space-y-2">
          <li>
            📧 Email:{" "}
            <a href="mailto:support@cricarena.com" className="text-blue-400 underline">
              support@cricarena.com
            </a>
          </li>
          <li>
            🏏 Instagram: <span className="text-blue-400">@cricarena_official</span>
          </li>
          <li>
            🐦 Twitter: <span className="text-blue-400">@CricArena</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default About_cric;