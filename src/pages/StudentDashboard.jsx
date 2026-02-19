import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CertificateCard from '../components/CertificateCard';
import '../css/StudentDashboard.css';

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">
          <h1 className="dashboard-title">Student Dashboard</h1>
          <div className="dashboard-section">
            <h2 className="section-title">My Certificates</h2>
            <div className="certificates-grid">
              <CertificateCard />
              <CertificateCard />
              <CertificateCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
