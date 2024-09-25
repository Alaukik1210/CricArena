import React from 'react'
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <div className="bg-black py-8 md:py-8">
      <div className="bg-goldx h-full rounded-3xl mx-4 md:mx-8 lg:mx-12">
        <div className="flex gap-2 items-center pt-8 pl-8 cursor-pointer w-fit">
          <div>
            <img id="logo" className="h-12 md:h-16" src={logo} alt="Logo" />
          </div>
          <div id="cric" className="text-gold font-cabinet-extrabold font-bold text-3xl md:text-4xl">
            Cric
          </div>
          <div id="arena" className="text-gold font-cabinet-extrabold font-bold text-3xl md:text-4xl">
            Arena
          </div>
        </div>
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mt-12 justify-evenly px-4 pb-12 md:px-8 lg:px-12">
          {/* Home Section */}
          <div>
            <h1 className="font-bold font-cabinet-black text-4xl text-gold">Home</h1>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">About</div>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Tournament</div>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Live Score</div>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Contact</div>
          </div>
          
          {/* Product Section */}
          <div>
            <h1 className="font-bold font-cabinet-black text-4xl text-gold">Product</h1>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Cricket Gear</div>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Apparel</div>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Accessories</div>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Equipment</div>
          </div>

          {/* Company Section */}
          <div>
            <h1 className="font-bold font-cabinet-black text-4xl text-gold">Company</h1>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Our Mission</div>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Our Team</div>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Our Values</div>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Careers</div>
          </div>

          {/* Partner Section */}
          <div>
            <h1 className="font-bold font-cabinet-black text-4xl text-gold">Partner</h1>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Our Partners</div>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Shell</div>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Adidas</div>
            <div className="font-semibold font-product-sans text-base md:text-lg text-gray-400 p-2 hover:text-gold cursor-pointer">Pepsi</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
