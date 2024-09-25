import React from 'react';

const Login = () => {
  return (
    <div className="h-[60vh] mb-40 bg-black flex items-center justify-center">
      <div className="max-w-md w-full font-cabinet-extrabold p-6 bg-[#3d3d3d] rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-[#FFD070] text-center mb-6">Login to CricArena</h2>
        <form>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none "
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-md bg-[#2d2d2d] text-white focus:outline-none "
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-[#FFD070]  text-black font-bold py-2 px-4 rounded group relative h-10  overflow-hidden  text-md  border-gold  text-center"
            >
              Sign Up
              <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
            </button>
          </div>
        </form>
        <p className="text-center text-white mt-4">
          Don’t have an account?{' '}
          <a href="/signup" className="text-[#FFD070] hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
