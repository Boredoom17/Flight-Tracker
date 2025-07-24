import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SearchOnlyMap from "./components/FlightSearch"; // Note: This was incorrect; we'll fix routing later

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchOnlyMap />} />
      </Routes>
    </Router>
  );
}

export default App;
