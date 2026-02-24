import React from 'react';
import '../../css/VerificationResultCard.css';

const VerificationResultCard = ({ result }) => {
  if (result === null) {
    return (
      <div className="verification-result-card invalid">
        <span className="result-status-badge">Invalid</span>
        <h3 className="result-title">Invalid Certificate</h3>
        <p className="result-message">No matching certificate found.</p>
      </div>
    );
  }

  return (
    <div className="verification-result-card valid">
      <span className="result-status-badge">Valid Certificate</span>
      <div className="result-details">
        <div className="result-detail-item">
          <span className="result-detail-label">Student Name</span>
          <span className="result-detail-value">{result.studentName}</span>
        </div>
        <div className="result-detail-item">
          <span className="result-detail-label">Course Name</span>
          <span className="result-detail-value">{result.courseName}</span>
        </div>
        <div className="result-detail-item">
          <span className="result-detail-label">Issuer Name</span>
          <span className="result-detail-value">{result.issuerName}</span>
        </div>
        <div className="result-detail-item">
          <span className="result-detail-label">Certificate ID</span>
          <span className="result-detail-value">{result.certificateId}</span>
        </div>
        <div className="result-detail-item">
          <span className="result-detail-label">Issue Date</span>
          <span className="result-detail-value">{result.issuedAt}</span>
        </div>
        <div className="result-detail-item">
          <span className="result-detail-label">Blockchain Tx ID</span>
          <span className="result-detail-value">{result.blockchainTxId}</span>
        </div>
        <div className="result-detail-item full-width">
          <span className="result-detail-label">Certificate Hash</span>
          <span className="result-detail-value mono">
            {result.certHash.substring(0, 10)}...
          </span>
        </div>
        <div className="result-detail-item full-width">
          <span className="result-detail-label">Verification Timestamp</span>
          <span className="result-detail-value">{new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default VerificationResultCard;
