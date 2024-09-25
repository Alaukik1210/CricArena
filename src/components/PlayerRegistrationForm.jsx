// PlayerRegistrationForm.js
import { div } from 'framer-motion/client';
import React, { useState } from 'react';

const PlayerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    playingRole: '',
    experience: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Player Registration Form Data:', formData);
    // Add your form submission logic here
  };

  return (
    <div className='h-screen flex justify-center items-center font-cabinet-extrabold'>

   
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 bg-goldx text-gray-400 shadow rounded-lg">
      <h2 className="text-2xl text-gold font-bold mb-4">Player Registration</h2>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="border-0 rounded-xl bg-black  p-2  w-full"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="border-0 rounded-xl bg-black  p-2  w-full"
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        required
        className="border-0 rounded-xl bg-black  p-2  w-full"
      />
      <input
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required
        className="border-0 rounded-xl bg-black  p-2  w-full"
      />
      <select name="playingRole" value={formData.playingRole} onChange={handleChange} required className="border-0 rounded-xl bg-black  p-2  w-full">
        <option value="">Select Playing Role</option>
        <option value="batsman">Batsman</option>
        <option value="bowler">Bowler</option>
        <option value="all-rounder">All-rounder</option>
        <option value="wicket-keeper">Wicket-keeper</option>
      </select>
      <textarea
        name="experience"
        value={formData.experience}
        onChange={handleChange}
        placeholder="Cricket Experience"
        rows="3"
        required
        className="border-0 rounded-xl bg-black  p-2  w-full"
      />
      <div className='text-center '>
      <button type="submit" className="group relative h-8 w-40 overflow-hidden rounded-2xl bg-goldx text-lg font-bold border-2 border-gold text-gold text-center">Register
      <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
      </button>
      </div>
    </form>
    </div>
  );
};

export default PlayerRegistrationForm;
