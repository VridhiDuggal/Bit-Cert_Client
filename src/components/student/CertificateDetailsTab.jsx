import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import '../../css/CertificateDetailsTab.css';

const CertificateDetailsTab = () => {
  const { certificate } = useOutletContext();
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="cert-dt-card">
      {/* Overview */}
      <div className="cert-dt-section">
        <h3 className="cert-dt-section-title">Certificate Overview</h3>
        <div className="cert-dt-grid">
          <div className="cert-dt-item">
            <span className="cert-dt-label">Course Name</span>
            <span className="cert-dt-value cert-dt-course">{certificate.courseName}</span>
          </div>
          <div className="cert-dt-item">
            <span className="cert-dt-label">Status</span>
            <span className={`cert-dt-badge ${certificate.status === 'Valid' ? 'valid' : 'revoked'}`}>
              {certificate.status}
            </span>
          </div>
          <div className="cert-dt-item">
            <span className="cert-dt-label">Certificate ID</span>
            <span className="cert-dt-value">{certificate.certificateId}</span>
          </div>
          <div className="cert-dt-item">
            <span className="cert-dt-label">Issued Date</span>
            <span className="cert-dt-value">{certificate.issuedAt}</span>
          </div>
          <div className="cert-dt-item cert-dt-full">
            <span className="cert-dt-label">Issuer Name</span>
            <span className="cert-dt-value">{certificate.issuerName}</span>
          </div>
        </div>
      </div>

      {/* Blockchain & Integrity */}
      <div className="cert-dt-section">
        <h3 className="cert-dt-section-title">Blockchain & Integrity</h3>
        <div className="cert-dt-hash-list">
          {[
            { label: 'Certificate Hash (SHA-256)', value: certificate.certHash, key: 'hash' },
            { label: 'Blockchain Transaction ID', value: certificate.blockchainTxId, key: 'tx' },
            { label: 'IPFS Hash', value: certificate.ipfsHash, key: 'ipfs' },
          ].map(({ label, value, key }) => (
            <div key={key} className="cert-dt-hash-item">
              <span className="cert-dt-label">{label}</span>
              <div className="cert-dt-hash-row">
                <span className="cert-dt-hash-text">{value}</span>
                <button
                  className="cert-dt-copy-btn"
                  onClick={() => handleCopy(value, key)}
                >
                  {copiedField === key ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CertificateDetailsTab;
