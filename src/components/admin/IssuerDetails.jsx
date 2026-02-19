import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { issuersData } from '../../data/issuersData';
import '../../css/IssuerDetails.css';

const IssuerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const issuer = issuersData.find((i) => i.id === Number(id));

  if (!issuer) {
    return (
      <div className="issuer-not-found">
        <h2>Issuer not found</h2>
        <p>No issuer exists with the given ID.</p>
        <button className="back-btn" onClick={() => navigate('/admin/issuers')}>
          Back to Issuers
        </button>
      </div>
    );
  }

  return (
    <div className="issuer-details">
      <button className="back-btn" onClick={() => navigate('/admin/issuers')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Issuers
      </button>

      <div className="issuer-details-card">
        <div className="issuer-details-header">
          <div>
            <h1 className="issuer-details-title">{issuer.organizationName}</h1>
            <span
              className={`issuer-details-badge ${
                issuer.status === 'Active' ? 'badge-active' : 'badge-suspended'
              }`}
            >
              {issuer.status}
            </span>
          </div>
        </div>

        <div className="issuer-details-grid">
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{issuer.email}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Contact Person</span>
            <span className="detail-value">{issuer.contactPerson}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Contact Phone</span>
            <span className="detail-value">{issuer.contactPhone}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Total Certificates Issued</span>
            <span className="detail-value detail-value-highlight">
              {issuer.totalCertificatesIssued}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Created At</span>
            <span className="detail-value">{issuer.createdAt}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className="detail-value">{issuer.status}</span>
          </div>

          <div className="detail-item detail-item-full">
            <span className="detail-label">DID (Decentralized Identifier)</span>
            <span className="detail-value detail-value-mono">{issuer.did}</span>
          </div>

          <div className="detail-item detail-item-full">
            <span className="detail-label">Public Key</span>
            <span className="detail-value detail-value-mono">{issuer.publicKey}</span>
          </div>

          <div className="detail-item detail-item-full">
            <span className="detail-label">Description</span>
            <span className="detail-value">{issuer.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuerDetails;
