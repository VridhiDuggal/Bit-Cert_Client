import { useState } from 'react';
import { issuerIssuedCertificatesData } from '../../data/issuerIssuedCertificatesData';
import IssuedCertificatesTable from './IssuedCertificatesTable';
import '../../css/IssuedCertificates.css';

function IssuedCertificates() {
  const [certificates, setCertificates] = useState(issuerIssuedCertificatesData);

  const totalIssued = certificates.length;
  const totalValid = certificates.filter((c) => c.status === 'Valid').length;
  const totalRevoked = certificates.filter((c) => c.status === 'Revoked').length;
  const uniqueCourses = new Set(certificates.map((c) => c.courseName)).size;

  const stats = [
    { label: 'Total Certificates Issued', value: totalIssued },
    { label: 'Valid Certificates',        value: totalValid   },
    { label: 'Revoked Certificates',      value: totalRevoked },
    { label: 'Courses Covered',           value: uniqueCourses },
  ];

  return (
    <div className="issued-certificates-page">
      <div className="issued-certificates-header">
        <h1 className="issued-certificates-title">Issued Certificates</h1>
        <p className="issued-certificates-subtitle">Manage and monitor all issued certificates</p>
      </div>

      <div className="issued-stats-grid">
        {stats.map((stat) => (
          <div className="issued-stat-card" key={stat.label}>
            <div className="issued-stat-label">{stat.label}</div>
            <div className="issued-stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <IssuedCertificatesTable certificates={certificates} />
    </div>
  );
}

export default IssuedCertificates;
