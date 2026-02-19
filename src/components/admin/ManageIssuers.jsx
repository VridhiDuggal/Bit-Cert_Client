import React, { useState } from 'react';
import { issuersData } from '../../data/issuersData';
import IssuersTable from './IssuersTable';
import '../../css/ManageIssuers.css';

const ManageIssuers = () => {
  const [issuers, setIssuers] = useState(issuersData);

  // Calculate stats
  const totalIssuers = issuers.length;
  const activeIssuers = issuers.filter((issuer) => issuer.status === 'Active').length;
  const suspendedIssuers = issuers.filter((issuer) => issuer.status === 'Suspended').length;
  const totalCertificates = issuers.reduce((sum, issuer) => sum + issuer.totalCertificatesIssued, 0);

  const handleStatusChange = (issuerId) => {
    setIssuers((prevIssuers) =>
      prevIssuers.map((issuer) =>
        issuer.id === issuerId
          ? { ...issuer, status: issuer.status === 'Active' ? 'Suspended' : 'Active' }
          : issuer
      )
    );
  };

  const statCards = [
    { label: 'Total Issuers', value: totalIssuers },
    { label: 'Active Issuers', value: activeIssuers },
    { label: 'Suspended Issuers', value: suspendedIssuers },
    { label: 'Total Certificates', value: totalCertificates },
  ];

  return (
    <div className="manage-issuers">
      <div className="manage-issuers-header">
        <h1 className="manage-issuers-heading">Issuer Management</h1>
        <p className="manage-issuers-subtitle">
          Monitor and manage authorized certificate issuers
        </p>
      </div>

      <div className="issuers-stats-grid">
        {statCards.map((card) => (
          <div className="issuers-stat-card" key={card.label}>
            <p className="issuers-stat-label">{card.label}</p>
            <p className="issuers-stat-value">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <IssuersTable issuers={issuers} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default ManageIssuers;
