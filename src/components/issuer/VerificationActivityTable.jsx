import { useState } from 'react';
import '../../css/VerificationActivityTable.css';

const PAGE_SIZE = 5;

function VerificationActivityTable({ logs }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!logs || logs.length === 0) {
    return (
      <div className="vat-empty">
        <p>No verification activity found</p>
      </div>
    );
  }

  const totalPages = Math.ceil(logs.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginated = logs.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div className="vat-container">
      <div className="vat-scroll">
        <table className="vat-table">
          <thead>
            <tr>
              <th>Certificate ID</th>
              <th>Student Name</th>
              <th>Verifier Name</th>
              <th>Verifier Email</th>
              <th>Verified At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((log) => (
              <tr key={log.id}>
                <td className="vat-cell-id">{log.certificateId}</td>
                <td>{log.studentName}</td>
                <td>{log.verifierName}</td>
                <td>{log.verifierEmail}</td>
                <td>{log.verifiedAt}</td>
                <td>
                  <span
                    className={`vat-status-badge ${
                      log.status === 'Verified' ? 'vat-status-valid' : 'vat-status-invalid'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="vat-pagination">
          <span className="vat-page-info">
            {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, logs.length)} of {logs.length}
          </span>
          <button
            className="vat-page-btn"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            ‹ Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`vat-page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="vat-page-btn"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}

export default VerificationActivityTable;
