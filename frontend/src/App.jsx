import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ComputerVision from './pages/ComputerVision';
import Forecasting from './pages/Forecasting';
import AnomalyDetection from './pages/AnomalyDetection';
import Inventory from './pages/Inventory';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vision" element={<ComputerVision />} />
          <Route path="/forecast" element={<Forecasting />} />
          <Route path="/anomaly" element={<AnomalyDetection />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
