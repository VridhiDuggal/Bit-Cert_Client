import React from 'react';
import '../../css/IssuerStatsCards.css';

const IssuerStatsCards = ({ stats }) => {
  const cards = [
    { label: 'Total Certificates Issued', value: stats.totalCertificatesIssued },
    { label: 'Valid Certificates', value: stats.totalValidCertificates },
    { label: 'Revoked Certificates', value: stats.totalRevokedCertificates },
    { label: 'Total Verifications', value: stats.totalVerifications },
  ];

  return (
    <div className="issuer-stats-grid">
      {cards.map((card) => (
        <div className="issuer-stat-card" key={card.label}>
          <p className="issuer-stat-label">{card.label}</p>
          <p className="issuer-stat-value">{card.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default IssuerStatsCards;
