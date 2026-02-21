import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentCertificatesData } from '../../data/studentCertificatesData';
import { studentInfo } from '../../data/studentLayoutData';
import '../../css/MyCertificates.css';

const MyCertificates = () => {
  const [certificates] = useState(studentCertificatesData);
  const navigate = useNavigate();

  return (
    <div className="my-certificates-page">
      <div className="my-certificates-header">
        <h1 className="my-certificates-title">My Certificates</h1>
        <p className="my-certificates-subtitle">View and manage your issued certificates</p>
      </div>

      {certificates.length === 0 ? (
        <p className="my-cert-empty">No certificates found.</p>
      ) : (
        <div className="my-cert-grid">
          {certificates.map((cert) => (
            <div key={cert.id} className="my-cert-card">
              <div className="my-cert-card-header">
                <h3 className="my-cert-card-title">{cert.courseName}</h3>
              </div>
              <div className="my-cert-card-divider" />
              <div className="my-cert-card-body">
                <p className="my-cert-card-row">
                  <span className="my-cert-label">Recipient:</span>
                  <span className="my-cert-value">{studentInfo.fullName}</span>
                </p>
                <p className="my-cert-card-row">
                  <span className="my-cert-label">Issuer:</span>
                  <span className="my-cert-value">{cert.issuerName}</span>
                </p>
                <p className="my-cert-card-row">
                  <span className="my-cert-label">Issue Date:</span>
                  <span className="my-cert-value">{cert.issuedAt}</span>
                </p>
                <p className="my-cert-card-row">
                  <span className="my-cert-label">Cert ID:</span>
                  <span className="my-cert-value cert-id-text">{cert.certificateId}</span>
                </p>
                <p className="my-cert-card-row">
                  <span className="my-cert-label">Status:</span>
                  <span className={`my-cert-status-badge ${cert.status === 'Valid' ? 'valid' : 'revoked'}`}>
                    {cert.status}
                  </span>
                </p>
              </div>
              <div className="my-cert-card-footer">
                <button
                  className="my-cert-view-btn"
                  onClick={() => navigate(`/student/certificates/${cert.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
