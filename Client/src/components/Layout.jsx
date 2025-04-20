import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top of the page whenever the route changes
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <div className="bg-black h-fit flex flex-col justify-between relative">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default Layout;