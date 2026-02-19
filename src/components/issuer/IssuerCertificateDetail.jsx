import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { issuerIssuedCertificatesData } from '../../data/issuerIssuedCertificatesData';
import '../../css/IssuerCertificateDetail.css';

function IssuerCertificateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const qrCanvasRef = useRef(null);

  const cert = issuerIssuedCertificatesData.find((c) => c.id === Number(id));

  const handleDownloadQR = () => {
    const canvas = qrCanvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cert?.certificateId || 'certificate'}-QR.png`;
    link.click();
  };

  if (!cert) {
    return (
      <div className="icd-page">
        <button className="icd-back-btn" onClick={() => navigate('/issuer/certificates')}>
          ← Back to Certificates
        </button>
        <div className="icd-not-found">
          <p>Certificate not found.</p>
        </div>
      </div>
    );
  }

  const qrValue = `CERT:${cert.certificateId}|STUDENT:${cert.studentName}|ENROLLMENT:${cert.enrollmentNo}|COURSE:${cert.courseName}|GRADE:${cert.grade}|TX:${cert.blockchainTxId}|HASH:${cert.certHash}`;

  return (
    <div className="icd-page">
      <button className="icd-back-btn" onClick={() => navigate('/issuer/certificates')}>
        ← Back to Certificates
      </button>

      <div className="icd-header">
        <div>
          <h1 className="icd-title">{cert.certificateId}</h1>
          <p className="icd-subtitle">Certificate Details</p>
        </div>
        <span className={`icd-status-badge ${cert.status === 'Valid' ? 'icd-status-valid' : 'icd-status-revoked'}`}>
          {cert.status}
        </span>
      </div>

      <div className="icd-body">
        {/* Left — Details card */}
        <div className="icd-details-card">
          <h2 className="icd-section-title">Certificate Information</h2>
          <div className="icd-details-grid">
            <div className="icd-detail-item">
              <span className="icd-detail-label">Certificate ID</span>
              <span className="icd-detail-value icd-accent">{cert.certificateId}</span>
            </div>
            <div className="icd-detail-item">
              <span className="icd-detail-label">Student Name</span>
              <span className="icd-detail-value">{cert.studentName}</span>
            </div>
            <div className="icd-detail-item">
              <span className="icd-detail-label">Student Email</span>
              <span className="icd-detail-value">{cert.studentEmail}</span>
            </div>
            <div className="icd-detail-item">
              <span className="icd-detail-label">Enrollment No</span>
              <span className="icd-detail-value">{cert.enrollmentNo}</span>
            </div>
            <div className="icd-detail-item">
              <span className="icd-detail-label">Course Name</span>
              <span className="icd-detail-value">{cert.courseName}</span>
            </div>
            <div className="icd-detail-item">
              <span className="icd-detail-label">Grade</span>
              <span className="icd-detail-value">{cert.grade}</span>
            </div>
            <div className="icd-detail-item">
              <span className="icd-detail-label">Issued At</span>
              <span className="icd-detail-value">{cert.issuedAt}</span>
            </div>
            <div className="icd-detail-item">
              <span className="icd-detail-label">Status</span>
              <span className={`icd-status-badge ${cert.status === 'Valid' ? 'icd-status-valid' : 'icd-status-revoked'}`}>
                {cert.status}
              </span>
            </div>
          </div>

          <h2 className="icd-section-title icd-section-title--mt">Blockchain Data</h2>
          <div className="icd-blockchain-list">
            <div className="icd-blockchain-item">
              <span className="icd-detail-label">Blockchain TX ID</span>
              <span className="icd-detail-value icd-mono">{cert.blockchainTxId}</span>
            </div>
            <div className="icd-blockchain-item">
              <span className="icd-detail-label">Certificate Hash</span>
              <span className="icd-detail-value icd-mono icd-hash">{cert.certHash}</span>
            </div>
            <div className="icd-blockchain-item">
              <span className="icd-detail-label">IPFS Hash</span>
              <span className="icd-detail-value icd-mono">{cert.ipfsHash}</span>
            </div>
          </div>
        </div>

        {/* Right — QR card */}
        <div className="icd-qr-card">
          <h2 className="icd-section-title">Certificate QR Code</h2>
          <p className="icd-qr-hint">Scan to verify this certificate on the blockchain</p>
          <div className="icd-qr-wrapper" ref={qrCanvasRef}>
            <QRCodeCanvas
              value={qrValue}
              size={200}
              fgColor="#1a202c"
              bgColor="#ffffff"
              level="H"
            />
          </div>
          <p className="icd-qr-cert-id">{cert.certificateId}</p>
          <p className="icd-qr-student">{cert.studentName}</p>
          <button className="icd-download-btn" onClick={handleDownloadQR}>
            ↓ Download QR
          </button>
        </div>
      </div>
    </div>
  );
}

export default IssuerCertificateDetail;
