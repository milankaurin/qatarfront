import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import './index.css'; 
import GrupaKomponenta from './Components/GrupaKomponenta.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/main" element={<GrupaKomponenta />} />
      </Routes>
    </Router>
  );
}

export default App;
