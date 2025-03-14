import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import React from "react";
import Brand from "../assets/images/ticz.png";
import Logo from "../assets/images/Vector.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to determine if a link is active
  const isActive = ({ isActive }) => {
    return isActive ? "text-white" : "text-gray-300 hover:text-white transition-colors";
  };

  return (
    <div className="pt-7">
      <nav className="bg-transparent text-white p-2 md:p-4 flex w-full mx-auto justify-between items-center rounded-2xl border border-[#197686]">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          {/* Circular icon - styled to match the teal theme */}
          <span className="bg-[#052F35] rounded-xl p-2 flex items-center justify-center border border-teal-600">
            <img src={Logo} alt="" />
          </span>
          <span className="text-2xl font-bold">
            <img src={Brand} alt="" />
          </span>
        </div>

        {/* Navigation Links */}
        <div
          className={`flex flex-col space-y-4 absolute left-0 top-20 w-full bg-[#052F35] p-4 transition-all duration-300 ease-in-out md:flex md:flex-row md:space-x-4 md:space-y-0 md:static md:bg-transparent md:p-0 md:justify-center md:max-w-1/2 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          } md:max-h-none md:opacity-100 md:overflow-visible z-10`}
        >
          <NavLink to="/" className={isActive} end>
            Events
          </NavLink>
          <NavLink to="/" className='text-white/70 hover:text-white'>
            My Tickets
          </NavLink>
          <NavLink to="/" className='text-white/70 hover:text-white'>
            About Project
          </NavLink>
        </div>

        {/* Button */}
        <Link
          to="/"
          className="bg-white text-black baskervville p-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          MY TICKETS <span className="ml-2">→</span>
        </Link>



        {/* I intentionally left this as hidden because the figma design does not involve it */}
        {/* Hamburger Menu for Mobile */}
        <div className="hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;