import React, { useState, useMemo } from 'react';
import { certificatesData } from '../../data/certificatesData';
import CertificateFilters from './CertificateFilters';
import CertificatesTable from './CertificatesTable';
import '../../css/ManageCertificates.css';

const ManageCertificates = () => {
  const [certificates] = useState(certificatesData);
  const [selectedIssuer, setSelectedIssuer] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchesIssuer = selectedIssuer ? cert.issuerName === selectedIssuer : true;
      const matchesStatus = selectedStatus ? cert.status === selectedStatus : true;
      return matchesIssuer && matchesStatus;
    });
  }, [certificates, selectedIssuer, selectedStatus]);

  // Stats
  const totalCerts = certificates.length;
  const validCerts = certificates.filter((c) => c.status === 'Valid').length;
  const revokedCerts = certificates.filter((c) => c.status === 'Revoked').length;

  const statCards = [
    { label: 'Total Certificates', value: totalCerts },
    { label: 'Valid', value: validCerts },
    { label: 'Revoked', value: revokedCerts },
  ];

  return (
    <div className="manage-certificates">
      <div className="manage-certificates-header">
        <h1 className="manage-certificates-heading">Certificate Monitoring</h1>
        <p className="manage-certificates-subtitle">
          View and monitor issued certificates
        </p>
      </div>

      <div className="certificates-stats-grid">
        {statCards.map((card) => (
          <div className="certificates-stat-card" key={card.label}>
            <p className="certificates-stat-label">{card.label}</p>
            <p className="certificates-stat-value">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <CertificateFilters
        certificates={certificates}
        selectedIssuer={selectedIssuer}
        setSelectedIssuer={setSelectedIssuer}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <CertificatesTable certificates={filteredCertificates} />
    </div>
  );
};

export default ManageCertificates;
