import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FlightSearch from "./components/FlightSeearch";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FlightSearch />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
