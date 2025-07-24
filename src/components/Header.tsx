import React from "react";
import { useNavigate } from "react-router-dom";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
    window.scrollTo(0, 0);
  };

  const handleFlightSearchClick = () => {
    navigate("/search");
  };

  const handleLiveViewClick = () => {
    navigate("/search"); // Redirect to search for live view
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div
          onClick={handleHomeClick}
          className="flex items-center space-x-2 cursor-pointer group active:scale-95 transition-transform"
        >
          <PaperAirplaneIcon className="h-6 w-6 text-blue-200 group-hover:text-white transition-colors transform rotate-45" />
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-blue-100">Aero</span>
            <span className="text-white">Track</span>
          </h1>
        </div>

        <nav className="flex space-x-2 sm:space-x-4">
          <button
            onClick={handleFlightSearchClick}
            className="px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm uppercase tracking-wider flex items-center"
          >
            <span className="hidden sm:inline">Flight</span> Search
          </button>
          <button
            onClick={handleLiveViewClick}
            className="px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm uppercase tracking-wider flex items-center"
          >
            <span className="hidden sm:inline">Live</span> Radar
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
