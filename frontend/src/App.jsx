import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import CompleteProfile from './pages/CompleteProfile';
import MapView from './pages/MapView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0d0d0d]">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/map" element={<MapView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
