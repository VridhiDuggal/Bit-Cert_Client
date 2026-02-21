import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import '../../css/CertificateTemplate.css';
import { studentInfo } from '../../data/studentLayoutData';

const CertificateTemplate = ({ certificate }) => {
  const qrData = JSON.stringify({
    certificateId: certificate.certificateId,
    certHash: certificate.certHash,
    verificationUrl: 'http://localhost:5173/verify',
  });

  return (
    <div className="cert-template-outer">
      <div className="cert-template-inner">
        {/* Top decorative line */}
        <div className="cert-template-top-accent" />

        {/* Header */}
        <div className="cert-template-header">
          <div className="cert-template-logo-row">
            <svg width="36" height="40" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1 H28 L39 12 V43 H6 V1 Z" fill="#f4f8f4" stroke="#588157" strokeWidth="2"/>
              <path d="M28 1 V12 H39" stroke="#588157" strokeWidth="2" fill="none"/>
              <line x1="0" y1="22" x2="40" y2="22" stroke="#588157" strokeWidth="1.8"/>
              <line x1="22" y1="0" x2="22" y2="44" stroke="#588157" strokeWidth="1.8"/>
              <rect x="0" y="17" width="9" height="10" rx="1" fill="#588157"/>
              <rect x="31" y="17" width="9" height="10" rx="1" fill="#588157"/>
              <rect x="17" y="0" width="10" height="9" rx="1" fill="#588157"/>
              <rect x="17" y="35" width="10" height="9" rx="1" fill="#588157"/>
              <path d="M22 13 L29 16.5 V23 C29 27.5 22 31 22 31 C22 31 15 27.5 15 23 V16.5 Z" fill="#588157"/>
              <polyline points="18.5,22.5 21,25.5 26,18.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="cert-template-brand">Bit-Cert</span>
          </div>
          <p className="cert-template-org">Blockchain-Verified Certificate Authority</p>
        </div>

        <div className="cert-template-divider-thin" />

        {/* Title */}
        <div className="cert-template-title-block">
          <h1 className="cert-template-title">Certificate of Achievement</h1>
          <p className="cert-template-subtitle">This is to certify that</p>
        </div>

        {/* Student Name */}
        <div className="cert-template-student-name">{studentInfo.fullName}</div>

        <p className="cert-template-has-completed">has successfully completed</p>

        {/* Course Name */}
        <div className="cert-template-course">{certificate.courseName}</div>

        {/* Issuer */}
        <p className="cert-template-issued-by">
          offered by <span className="cert-template-issuer">{certificate.issuerName}</span>
        </p>

        <div className="cert-template-divider-thin" />

        {/* Meta Row */}
        <div className="cert-template-meta">
          <div className="cert-template-meta-item">
            <span className="cert-template-meta-label">Certificate ID</span>
            <span className="cert-template-meta-value">{certificate.certificateId}</span>
          </div>
          <div className="cert-template-meta-item">
            <span className="cert-template-meta-label">Issue Date</span>
            <span className="cert-template-meta-value">{certificate.issuedAt}</span>
          </div>
          <div className="cert-template-meta-item">
            <span className="cert-template-meta-label">Hash Preview</span>
            <span className="cert-template-meta-value cert-template-hash">
              {certificate.certHash.substring(0, 10)}...
            </span>
          </div>
          {/* QR */}
          <div className="cert-template-qr">
            <QRCodeSVG value={qrData} size={100} level="H" />
            <span className="cert-template-qr-label">Scan to Verify</span>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="cert-template-bottom-accent" />
      </div>
    </div>
  );
};

export default CertificateTemplate;
