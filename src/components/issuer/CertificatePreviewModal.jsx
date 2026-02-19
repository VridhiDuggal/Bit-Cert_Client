import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import '../../css/CertificatePreviewModal.css';

const CertificatePreviewModal = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const qrData = JSON.stringify({
    certificateId: certificate.certificateId,
    certHash: certificate.certHash,
    verificationUrl: 'http://localhost:5173/verify',
  });

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="cert-modal-overlay" onClick={handleOverlayClick}>
      <div className="cert-modal-card">
        <div className="cert-modal-header">
          <h2>Certificate Preview</h2>
          <button className="cert-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cert-modal-body">
          <div className="cert-modal-qr">
            <QRCodeSVG value={qrData} size={180} level="H" />
          </div>

          <div className="cert-modal-details">
            <div className="cert-modal-item">
              <span className="cert-modal-label">Certificate ID</span>
              <span className="cert-modal-value">{certificate.certificateId}</span>
            </div>
            <div className="cert-modal-item">
              <span className="cert-modal-label">Student Name</span>
              <span className="cert-modal-value">{certificate.studentName}</span>
            </div>
            <div className="cert-modal-item">
              <span className="cert-modal-label">Student Email</span>
              <span className="cert-modal-value">{certificate.studentEmail}</span>
            </div>
            <div className="cert-modal-item">
              <span className="cert-modal-label">Course</span>
              <span className="cert-modal-value">{certificate.courseName}</span>
            </div>
            <div className="cert-modal-item">
              <span className="cert-modal-label">Grade</span>
              <span className="cert-modal-value cert-modal-grade">{certificate.grade}</span>
            </div>
            <div className="cert-modal-item">
              <span className="cert-modal-label">Issued Date</span>
              <span className="cert-modal-value">{certificate.issuedAt}</span>
            </div>
            <div className="cert-modal-item cert-modal-full">
              <span className="cert-modal-label">Certificate Hash</span>
              <span className="cert-modal-value cert-modal-hash">{certificate.certHash}</span>
            </div>
            <div className="cert-modal-item cert-modal-full">
              <span className="cert-modal-label">Blockchain TX ID</span>
              <span className="cert-modal-value cert-modal-hash">{certificate.blockchainTxId}</span>
            </div>
            <div className="cert-modal-item cert-modal-full">
              <span className="cert-modal-label">IPFS Hash</span>
              <span className="cert-modal-value cert-modal-hash">{certificate.ipfsHash}</span>
            </div>
          </div>
        </div>

        <div className="cert-modal-footer">
          <button className="cert-modal-btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreviewModal;
