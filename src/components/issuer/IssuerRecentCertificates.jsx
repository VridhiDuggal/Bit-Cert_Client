import React, { useState } from 'react';
import '../../css/IssuerRecentCertificates.css';

const PAGE_SIZE = 5;

const IssuerRecentCertificates = ({ certificates }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!certificates || certificates.length === 0) {
    return (
      <div className="issuer-recent-card">
        <h3 className="issuer-recent-title">Recent Certificates</h3>
        <p className="issuer-recent-empty">No recent certificates found</p>
      </div>
    );
  }

  const totalPages = Math.ceil(certificates.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginated = certificates.slice(startIdx, startIdx + PAGE_SIZE);

  const handleView = (certId) => {
    console.log('View certificate:', certId);
  };

  return (
    <div className="issuer-recent-card">
      <h3 className="issuer-recent-title">Recent Certificates</h3>
      <div className="issuer-recent-scroll">
        <table className="issuer-recent-table">
          <thead>
            <tr>
              <th>Certificate ID</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Issued Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((cert) => (
              <tr key={cert.id}>
                <td className="cell-cert-id">{cert.certificateId}</td>
                <td>{cert.studentName}</td>
                <td>{cert.courseName}</td>
                <td className="cell-date">{cert.issuedAt}</td>
                <td>
                  <span
                    className={`cert-status-badge ${
                      cert.status === 'Valid' ? 'badge-valid' : 'badge-revoked'
                    }`}
                  >
                    {cert.status}
                  </span>
                </td>
                <td>
                  <button
                    className="cert-view-btn"
                    onClick={() => handleView(cert.certificateId)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="irc-pagination">
          <span className="irc-page-info">
            {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, certificates.length)} of {certificates.length}
          </span>
          <button
            className="irc-page-btn"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            ‹ Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`irc-page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="irc-page-btn"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
};

export default IssuerRecentCertificates;
