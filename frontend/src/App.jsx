import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DashboardLayout from "./components/DashboardLayout";

// Pages
import Dashboard from "./components/Dashboard";
import IrrigationCard from "./components/IrrigationCard";
import WeatherSearch from "./components/WeatherSearch";
import CropHealthMonitor from "./components/Crop Health Monitor/CropHealthMonitor";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Hero />} />
        {/* Dashboard Routes with Sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/weather" element={<WeatherSearch />} />
          <Route path="/irrigation" element={<IrrigationCard />} />
          <Route path="/crop-health" element={<CropHealthMonitor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
