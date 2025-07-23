import React from "react";

interface HeaderProps {
  onShowMap: () => void;
  onLiveView: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowMap, onLiveView }) => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Flight Tracker</h1>
        <div className="flex gap-4">
          <button
            onClick={onShowMap}
            className="px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Search Flights
          </button>
          <button
            onClick={onLiveView}
            className="px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Live Map
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
