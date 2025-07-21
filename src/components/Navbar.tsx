import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-blue-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
    <h1 className="text-xl font-bold">✈️ Flight Tracker</h1>
    <div className="space-x-6">
      <Link to="/" className="hover:text-gray-200">Home</Link>
      <Link to="/search" className="hover:text-gray-200">Search</Link>
      <Link to="/map" className="hover:text-gray-200">Map</Link>
    </div>
  </nav>
);

export default Navbar;
