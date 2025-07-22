import React from "react";

interface HeaderProps {
  onShowMap: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowMap }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">Flight Tracker</div>
        <nav>
          <ul className="flex gap-6 text-gray-700 font-medium">
            <li>
              <button
                onClick={onShowMap}
                className="hover:text-blue-600 transition"
              >
                Live Map
              </button>
            </li>
            <li>
              <a href="#data-center" className="hover:text-blue-600 transition">
                Data Center
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-blue-600 transition">
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
