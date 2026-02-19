import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../../css/IssuedCertificatesTable.css';

const PAGE_SIZE = 5;

function IssuedCertificatesTable({ certificates }) {
  const navigate = useNavigate();
  const [qrCert, setQrCert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  if (!certificates || certificates.length === 0) {
    return (
      <div className="issued-table-empty">
        <p>No issued certificates found</p>
      </div>
    );
  }

  const totalPages = Math.ceil(certificates.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginated = certificates.slice(startIdx, startIdx + PAGE_SIZE);

  return (<>
    <div className="issued-table-container">
      <div className="issued-table-scroll">
        <table className="issued-table">
          <thead>
            <tr>
              <th>Certificate ID</th>
              <th>Student Name</th>
              <th>Enrollment No</th>
              <th>Course</th>
              <th>Certificate Hash</th>
              <th>Blockchain TX ID</th>
              <th>Issued Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((cert) => (
              <tr key={cert.id}>
                <td className="issued-cell-id">{cert.certificateId}</td>
                <td>{cert.studentName}</td>
                <td>{cert.enrollmentNo}</td>
                <td>{cert.courseName}</td>
                <td
                  className="issued-cell-hash"
                  title={cert.certHash}
                >
                  {cert.certHash.substring(0, 10)}...
                </td>
                <td className="issued-cell-tx">{cert.blockchainTxId}</td>
                <td>{cert.issuedAt}</td>
                <td>
                  <span
                    className={`issued-status-badge ${
                      cert.status === 'Valid'
                        ? 'issued-status-valid'
                        : 'issued-status-revoked'
                    }`}
                  >
                    {cert.status}
                  </span>
                </td>
                <td className="issued-cell-actions">
                  <button
                    className="issued-btn-details"
                    onClick={() => navigate(`/issuer/certificates/${cert.id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="issued-btn-qr"
                    onClick={() => setQrCert(cert)}
                  >
                    View QR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="issued-pagination">
          <span className="issued-page-info">
            {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, certificates.length)} of {certificates.length}
          </span>
          <button
            className="issued-page-btn"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            ‹ Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`issued-page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="issued-page-btn"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next ›
          </button>
        </div>
      )}
    </div>

    {/* QR Modal */}
    {qrCert && (
      <div className="qr-modal-overlay" onClick={() => setQrCert(null)}>
        <div className="qr-modal-card" onClick={(e) => e.stopPropagation()}>
          <button className="qr-modal-close" onClick={() => setQrCert(null)}>✕</button>
          <h2 className="qr-modal-title">Certificate QR Code</h2>
          <p className="qr-modal-cert-id">{qrCert.certificateId}</p>
          <div className="qr-modal-code">
            <QRCodeSVG
              value={`CERT:${qrCert.certificateId}|STUDENT:${qrCert.studentName}|COURSE:${qrCert.courseName}|TX:${qrCert.blockchainTxId}|HASH:${qrCert.certHash}`}
              size={200}
              fgColor="#1a202c"
              bgColor="#ffffff"
              level="H"
            />
          </div>
          <div className="qr-modal-meta">
            <div className="qr-meta-row">
              <span className="qr-meta-label">Student</span>
              <span className="qr-meta-value">{qrCert.studentName}</span>
            </div>
            <div className="qr-meta-row">
              <span className="qr-meta-label">Course</span>
              <span className="qr-meta-value">{qrCert.courseName}</span>
            </div>
            <div className="qr-meta-row">
              <span className="qr-meta-label">Grade</span>
              <span className="qr-meta-value">{qrCert.grade}</span>
            </div>
            <div className="qr-meta-row">
              <span className="qr-meta-label">Status</span>
              <span className={`issued-status-badge ${qrCert.status === 'Valid' ? 'issued-status-valid' : 'issued-status-revoked'}`}>{qrCert.status}</span>
            </div>
          </div>
          <p className="qr-modal-hint">Scan to verify this certificate on the blockchain</p>
        </div>
      </div>
    )}
  </>);
}

export default IssuedCertificatesTable;
