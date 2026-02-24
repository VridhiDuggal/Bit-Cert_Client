import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifierMockCertificatesData } from '../../data/verifierMockCertificatesData';
import '../../css/VerificationResultPage.css';

const VerificationResultPage = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const isInvalid = certificateId === 'invalid';
  const certificate = !isInvalid
    ? verifierMockCertificatesData.find((c) => c.certificateId === certificateId)
    : null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Invalid UI
  if (isInvalid || !certificate) {
    return (
      <div className="verification-result-page">
        <button className="result-back-btn" onClick={() => navigate('/verifier')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Verification
        </button>

        <div className="invalid-result-card">
          <div className="invalid-icon-ring">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="invalid-title">Certificate Not Found</h2>
          <p className="invalid-subtitle">No valid blockchain record matches the provided Certificate ID or Hash.</p>

          <div className="invalid-actions">
            <button className="invalid-retry-btn" onClick={() => navigate('/verifier')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Valid UI
  return (
    <div className="verification-result-page">
      <button className="result-back-btn" onClick={() => navigate('/verifier')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Verification
      </button>

      <div className="result-details-card">
        <h3 className="details-title">Certificate Details</h3>

        <div className="result-details-grid">
          <div className="result-field">
            <span className="result-field-label">Student Name</span>
            <span className="result-field-value">{certificate.studentName}</span>
          </div>
          <div className="result-field">
            <span className="result-field-label">Course Name</span>
            <span className="result-field-value">{certificate.courseName}</span>
          </div>
          <div className="result-field">
            <span className="result-field-label">Issuer Name</span>
            <span className="result-field-value">{certificate.issuerName}</span>
          </div>
          <div className="result-field">
            <span className="result-field-label">Certificate ID</span>
            <span className="result-field-value">{certificate.certificateId}</span>
          </div>
          <div className="result-field">
            <span className="result-field-label">Issue Date</span>
            <span className="result-field-value">{certificate.issuedAt}</span>
          </div>
          <div className="result-field">
            <span className="result-field-label">Blockchain Tx ID</span>
            <span className="result-field-value">{certificate.blockchainTxId}</span>
          </div>
          <div className="result-field full-width">
            <span className="result-field-label">Certificate Hash (SHA-256)</span>
            <span className="result-field-value mono">
              <span>{certificate.certHash}</span>
              <button className="copy-btn" onClick={() => handleCopy(certificate.certHash)} title="Copy hash">
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#588157" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </span>
          </div>
          <div className="result-field full-width">
            <span className="result-field-label">Verification Timestamp</span>
            <span className="result-field-value">{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="result-banner success">
        <div className="banner-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 className="banner-title">Certificate Verified Successfully</h2>
        <p className="banner-message">This certificate is authentic and recorded on the blockchain.</p>
      </div>
    </div>
  );
};

export default VerificationResultPage;
