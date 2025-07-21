import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-blue-700 text-white px-6 py-4 shadow-md flex justify-between items-center sticky top-0 z-50">
    {/* Logo */}
    <Link
      to="/"
      className="text-xl font-bold hover:text-blue-300 no-underline"
      style={{ textDecoration: "none" }}
    >
      ✈️ Flight Tracker
    </Link>

    {/* Nav Links */}
    <div className="space-x-8 text-lg font-medium">
      <Link to="/" className="hover:text-blue-300 transition-colors">
        Track Flights
      </Link>
      <a href="#datasources" className="hover:text-blue-300 transition-colors">
        Data Sources
      </a>
      <a href="#help" className="hover:text-blue-300 transition-colors">
        Help Center
      </a>
    </div>
  </nav>
);

export default Navbar;
