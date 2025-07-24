import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SearchOnlyMap from "./components/FlightSearch"; // Adjusted to match your file name

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
