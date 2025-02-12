import React, { useState } from "react";

const NavBar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo Section */}
        <a href="#" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-semibold text-gray-900">InvestorMatch</span>
        </a>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 w-10 h-10 flex items-center justify-center text-gray-600 rounded-lg hover:bg-gray-100"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Navbar Links */}
        <div className={`w-full md:flex md:w-auto ${isDropdownOpen ? "block" : "hidden"}`}>
          <ul className="flex flex-col md:flex-row md:space-x-8 text-gray-800">
            <li>
              <a href="#" className="block py-2 px-4 hover:text-blue-600">Home</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:text-blue-600">Services</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:text-blue-600">Pricing</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:text-blue-600">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
