import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home"; // Create if not already
import MapComponent from "./components/MapComponent";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<MapComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
