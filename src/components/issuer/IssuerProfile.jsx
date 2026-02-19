import { useState } from 'react';
import { issuerProfileData } from '../../data/issuerProfileData';
import '../../css/IssuerProfile.css';

function IssuerProfile() {
  const [copied, setCopied] = useState(null);

  const profile = issuerProfileData;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className="ip-page">
      <div className="ip-header">
        <h1 className="ip-title">Issuer Profile</h1>
        <p className="ip-subtitle">Organization and identity information</p>
      </div>

      <div className="ip-body">
        {/* Organization Information */}
        <div className="ip-card">
          <h2 className="ip-section-title">Organization Information</h2>
          <div className="ip-grid">
            <div className="ip-field">
              <span className="ip-label">Organization Name</span>
              <span className="ip-value">{profile.organizationName}</span>
            </div>
            <div className="ip-field">
              <span className="ip-label">Issuer Email</span>
              <span className="ip-value">{profile.issuerEmail}</span>
            </div>
            <div className="ip-field">
              <span className="ip-label">Contact Person</span>
              <span className="ip-value">{profile.contactPerson}</span>
            </div>
            <div className="ip-field">
              <span className="ip-label">Contact Phone</span>
              <span className="ip-value">{profile.contactPhone}</span>
            </div>
            <div className="ip-field">
              <span className="ip-label">Member Since</span>
              <span className="ip-value">{profile.memberSince}</span>
            </div>
            <div className="ip-field">
              <span className="ip-label">Total Certificates Issued</span>
              <span className="ip-value ip-accent">{profile.totalCertificatesIssued}</span>
            </div>
            <div className="ip-field">
              <span className="ip-label">Status</span>
              <span className="ip-status-badge ip-status-active">{profile.status}</span>
            </div>
          </div>
        </div>

        {/* Identity Information */}
        <div className="ip-card">
          <h2 className="ip-section-title">Identity Information</h2>
          <div className="ip-identity-list">
            <div className="ip-identity-item">
              <span className="ip-label">Decentralized Identifier (DID)</span>
              <div className="ip-identity-row">
                <span className="ip-value ip-mono">{profile.did}</span>
                <button
                  className="ip-copy-btn"
                  onClick={() => handleCopy(profile.did, 'did')}
                >
                  {copied === 'did' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="ip-identity-item">
              <span className="ip-label">Public Key</span>
              <div className="ip-identity-row">
                <span className="ip-value ip-mono">{profile.publicKey}</span>
                <button
                  className="ip-copy-btn"
                  onClick={() => handleCopy(profile.publicKey, 'publicKey')}
                >
                  {copied === 'publicKey' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssuerProfile;
