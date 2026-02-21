import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { studentCertificatesData } from '../../data/studentCertificatesData';
import CertificateVerificationTable from './CertificateVerificationTable';
import '../../css/StudentCertificateDetails.css';

const StudentCertificateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState(null);

  const certificate = studentCertificatesData.find(
    (cert) => cert.id === parseInt(id)
  );

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!certificate) {
    return (
      <div className="stu-cert-details-container">
        <div className="stu-cert-not-found">
          <h2>Certificate Not Found</h2>
          <p>The certificate you are looking for does not exist or has been removed.</p>
          <button
            className="stu-cert-back-btn"
            onClick={() => navigate('/student/certificates')}
          >
            Back to My Certificates
          </button>
        </div>
      </div>
    );
  }

  const qrData = JSON.stringify({
    certificateId: certificate.certificateId,
    certHash: certificate.certHash,
    verificationUrl: 'http://localhost:5173/verify',
  });

  return (
    <div className="stu-cert-details-container">
      <div className="stu-cert-details-header">
        <button
          className="stu-cert-back-btn"
          onClick={() => navigate('/student/certificates')}
        >
          &larr; Back to My Certificates
        </button>
      </div>

      {/* SECTION 1 — Certificate Overview */}
      <div className="stu-cert-card">
        <div className="stu-cert-section">
          <h3 className="stu-cert-section-title">Certificate Overview</h3>
          <div className="stu-cert-overview-top">
            <h2 className="stu-cert-course-name">{certificate.courseName}</h2>
            <span
              className={`stu-cert-badge ${
                certificate.status === 'Valid' ? 'badge-valid' : 'badge-revoked'
              }`}
            >
              {certificate.status}
            </span>
          </div>
          <div className="stu-cert-detail-grid">
            <div className="stu-cert-detail-item">
              <span className="stu-cert-label">Certificate ID</span>
              <span className="stu-cert-value">{certificate.certificateId}</span>
            </div>
            <div className="stu-cert-detail-item">
              <span className="stu-cert-label">Issued Date</span>
              <span className="stu-cert-value">{certificate.issuedAt}</span>
            </div>
            <div className="stu-cert-detail-item">
              <span className="stu-cert-label">Issuer</span>
              <span className="stu-cert-value">{certificate.issuerName}</span>
            </div>
          </div>
        </div>

        {/* SECTION 2 — Blockchain & Integrity */}
        <div className="stu-cert-section">
          <h3 className="stu-cert-section-title">Blockchain & Integrity</h3>
          <div className="stu-cert-hash-rows">
            <div className="stu-cert-hash-item">
              <span className="stu-cert-label">Certificate Hash</span>
              <div className="stu-cert-hash-row">
                <span className="stu-cert-hash-text">{certificate.certHash}</span>
                <button
                  className="stu-cert-copy-btn"
                  onClick={() => handleCopy(certificate.certHash, 'hash')}
                >
                  {copiedField === 'hash' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="stu-cert-hash-item">
              <span className="stu-cert-label">Blockchain Transaction ID</span>
              <div className="stu-cert-hash-row">
                <span className="stu-cert-hash-text">{certificate.blockchainTxId}</span>
                <button
                  className="stu-cert-copy-btn"
                  onClick={() => handleCopy(certificate.blockchainTxId, 'txId')}
                >
                  {copiedField === 'txId' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="stu-cert-hash-item">
              <span className="stu-cert-label">IPFS Hash</span>
              <div className="stu-cert-hash-row">
                <span className="stu-cert-hash-text">{certificate.ipfsHash}</span>
                <button
                  className="stu-cert-copy-btn"
                  onClick={() => handleCopy(certificate.ipfsHash, 'ipfs')}
                >
                  {copiedField === 'ipfs' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3 — QR Code */}
        <div className="stu-cert-section stu-cert-qr-section">
          <h3 className="stu-cert-section-title">QR Verification</h3>
          <div className="stu-cert-qr-wrapper">
            <div className="stu-cert-qr-box">
              <QRCodeSVG value={qrData} size={230} level="H" />
            </div>
            <p className="stu-cert-qr-caption">Scan to Verify Certificate</p>
            <div className="stu-cert-qr-actions">
              <button
                className="stu-cert-action-btn"
                onClick={() =>
                  handleCopy('http://localhost:5173/verify', 'link')
                }
              >
                {copiedField === 'link' ? 'Copied!' : 'Copy Verification Link'}
              </button>
              <button
                className="stu-cert-action-btn outline"
                onClick={() => console.log('Download QR for', certificate.certificateId)}
              >
                Download QR
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4 — Verification History */}
        <div className="stu-cert-section stu-cert-section-last">
          <CertificateVerificationTable certificateId={certificate.certificateId} />
        </div>
      </div>
    </div>
  );
};

export default StudentCertificateDetails;
