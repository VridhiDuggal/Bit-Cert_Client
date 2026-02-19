import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../css/VerifierDashboard.css';

const VerifierDashboard = () => {
  return (
    <div className="verifier-dashboard">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">
          <h1 className="dashboard-title">Verifier Dashboard</h1>
          <div className="dashboard-section">
            <h2 className="section-title">Verify Certificate</h2>
            <div className="verify-form">
              <input 
                type="text" 
                placeholder="Enter Certificate ID" 
                className="verify-input"
              />
              <button className="verify-button">Verify</button>
            </div>
          </div>
          <div className="dashboard-section">
            <h2 className="section-title">Recent Verifications</h2>
            <p>No recent verifications</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VerifierDashboard;
