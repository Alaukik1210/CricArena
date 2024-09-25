// TicketBookingForm.js
import { div } from 'framer-motion/client';
import React, { useState } from 'react';
import Navbar from './Navbar';

const TicketBookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    matchDate: '',
    tickets: 1,
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
    console.log('Ticket Booking Form Data:', formData);
   
  };

  return (
    <div className=' h-screen font-cabinet-extrabold'>
   
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 bg-goldx text-gray-400 shadow rounded-lg">
      <h2 className="text-2xl text-gold font-bold mb-4">Book Match Tickets</h2>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="border-0 rounded-xl bg-black text-gold p-2  w-full"
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
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Match Location"
        required
        className="border-0 rounded-xl bg-black  p-2  w-full"
      />
      <input
        type="date"
        name="matchDate"
        value={formData.matchDate}
        onChange={handleChange}
        required
        className="border-0 rounded-xl bg-black  p-2  w-full"
      />
      <input
        type="number"
        name="tickets"
        value={formData.tickets}
        onChange={handleChange}
        min="1"
        max="10"
        placeholder="Number of Tickets"
        required
        className="border-0 rounded-xl bg-black  p-2  w-full"
      />
      <div className='text-center '>
      <button type="submit" className="group relative h-8 w-40 overflow-hidden rounded-2xl bg-goldx text-lg font-bold border-2 border-gold text-gold text-center">Book Tickets
      <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
      </button>

      </div>
    </form>
    </div>
    
  );
};

export default TicketBookingForm;
