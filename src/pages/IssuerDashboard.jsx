import React from 'react';
import { issuerStats, recentCertificates } from '../data/issuerDashboardData';
import IssuerStatsCards from '../components/issuer/IssuerStatsCards';
import IssuerRecentCertificates from '../components/issuer/IssuerRecentCertificates';
import '../css/IssuerDashboard.css';

const IssuerDashboard = () => {
  return (
    <div className="issuer-dashboard-page">
      <div className="issuer-dashboard-header">
        <h1 className="issuer-dashboard-heading">Issuer Dashboard</h1>
        <p className="issuer-dashboard-subtitle">
          Overview of certificate issuance and activity
        </p>
      </div>

      <IssuerStatsCards stats={issuerStats} />
      <IssuerRecentCertificates certificates={recentCertificates} />
    </div>
  );
};

export default IssuerDashboard;
