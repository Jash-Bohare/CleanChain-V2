import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import CompleteProfile from './pages/CompleteProfile';
import MapView from './pages/MapView';
import WelcomeStep1 from './pages/Welcome-step1';
import WelcomeStep2 from './pages/Welcome-step2';
import Gallery from './pages/Gallery';
import Dashboard from './pages/Dashboard';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0d0d0d]">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/Welcomestep1" element={<WelcomeStep1 />} />
          <Route path="/Welcomestep2" element={<WelcomeStep2 />} />
          <Route path="/Gallery" element={<Gallery/>} />
          <Route path="/dashboard" element={<Dashboard/>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;