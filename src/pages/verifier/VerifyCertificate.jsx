import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifierMockCertificatesData } from '../../data/verifierMockCertificatesData';
import QRScannerSection from '../../components/verifier/QRScannerSection';
import '../../css/VerifyCertificate.css';

const VerifyCertificate = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual');
  const [certificateId, setCertificateId] = useState('');
  const [certHash, setCertHash] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const trimmedId = certificateId.trim();
    const trimmedHash = certHash.trim();
    if (!trimmedId && !trimmedHash) {
      setError('Please enter a Certificate ID or Certificate Hash.');
      return;
    }
    const found = verifierMockCertificatesData.find(
      (cert) => cert.certificateId === trimmedId || cert.certHash === trimmedHash
    );
    if (found) {
      navigate(`/verifier/result/${found.certificateId}`);
    } else {
      navigate('/verifier/result/invalid');
    }
  };

  return (
    <div className="verify-certificate-page">
      <div className="page-header">
        <h1 className="page-title">Verify Certificate</h1>
        <p className="page-subtitle">Validate authenticity of a blockchain-issued certificate</p>
      </div>

      {/* Glassmorphism Tab Navbar */}
      <div className="verify-tab-navbar">
        <button
          className={`verify-tab-btn${activeTab === 'manual' ? ' active' : ''}`}
          onClick={() => setActiveTab('manual')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
          Certificate ID / Hash
        </button>
        <button
          className={`verify-tab-btn${activeTab === 'qr' ? ' active' : ''}`}
          onClick={() => setActiveTab('qr')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <path d="M14 14h3v3h-3zM17 17h3M17 14v3" />
          </svg>
          QR Code
        </button>
      </div>

      {activeTab === 'manual' && (
        <div className="verify-form-card">
          <form onSubmit={handleSubmit}>
            <div className="verify-form-group">
              <label htmlFor="certificateId">Certificate ID</label>
              <input
                id="certificateId"
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="e.g. CERT-4821"
              />
            </div>
            <div className="divider-row">
              <span className="divider-line" />
              <span className="divider-text">or</span>
              <span className="divider-line" />
            </div>
            <div className="verify-form-group">
              <label htmlFor="certHash">Certificate Hash</label>
              <input
                id="certHash"
                type="text"
                value={certHash}
                onChange={(e) => setCertHash(e.target.value)}
                placeholder="Enter 64-character SHA-256 hash"
              />
            </div>
            {error && <p className="verify-form-error">{error}</p>}
            <button type="submit" className="verify-submit-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Verify Certificate
            </button>
          </form>
        </div>
      )}

      {activeTab === 'qr' && <QRScannerSection />}
    </div>
  );
};

export default VerifyCertificate;
