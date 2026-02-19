import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { certificatesData } from '../../data/certificatesData';
import '../../css/CertificateDetails.css';

const CertificateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const certificate = certificatesData.find(cert => cert.id === parseInt(id));

  if (!certificate) {
    return (
      <div className="certificate-details-container">
        <div className="certificate-not-found">
          <h2>Certificate Not Found</h2>
          <p>The certificate you're looking for doesn't exist.</p>
          <button className="back-btn" onClick={() => navigate('/admin/certificates')}>
            Back to Certificates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="certificate-details-container">
      <div className="certificate-details-header">
        <button className="back-btn" onClick={() => navigate('/admin/certificates')}>
          ← Back to Certificates
        </button>
        <h2>Certificate Details</h2>
      </div>

      <div className="certificate-details-card">
        <div className="detail-section">
          <h3>Basic Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Certificate ID:</span>
              <span className="detail-value">{certificate.certificateId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className={`cert-badge ${certificate.status === 'Valid' ? 'badge-valid' : 'badge-revoked'}`}>
                {certificate.status}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Issued Date:</span>
              <span className="detail-value">{new Date(certificate.issuedAt).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Completion Date:</span>
              <span className="detail-value">{new Date(certificate.completionDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Student Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Student Name:</span>
              <span className="detail-value">{certificate.studentName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Student ID:</span>
              <span className="detail-value">{certificate.studentId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Student Email:</span>
              <span className="detail-value">{certificate.studentEmail}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Course Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Course Name:</span>
              <span className="detail-value">{certificate.courseName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Grade:</span>
              <span className="detail-value grade-highlight">{certificate.grade}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Issuer Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Issuer Name:</span>
              <span className="detail-value">{certificate.issuerName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Issuer DID:</span>
              <span className="detail-value hash-text">{certificate.issuerDID}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Blockchain & Storage Details</h3>
          <div className="detail-grid">
            <div className="detail-item full-width">
              <span className="detail-label">Certificate Hash:</span>
              <span className="detail-value hash-text">{certificate.certHash}</span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Blockchain Transaction ID:</span>
              <span className="detail-value hash-text">{certificate.blockchainTxId}</span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">IPFS Hash:</span>
              <span className="detail-value hash-text">{certificate.ipfsHash}</span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Verification URL:</span>
              <a 
                href={certificate.verificationUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="detail-value link-value"
              >
                {certificate.verificationUrl}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetails;
