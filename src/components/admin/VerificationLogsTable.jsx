import React, { useState } from 'react';
import Pagination from '../Pagination';
import '../../css/VerificationLogsTable.css';

const VerificationLogsTable = ({ logs }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!logs || logs.length === 0) {
    return (
      <div className="verification-table-card">
        <p className="verification-empty">No verification logs found</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = logs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="verification-table-card">
      <div className="verification-table-scroll">
        <table className="verification-table">
          <thead>
            <tr>
              <th>Verifier Name</th>
              <th>Verifier Email</th>
              <th>Certificate ID</th>
              <th>Student Name</th>
              <th>Verified At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log) => (
              <tr key={log.id}>
                <td className="cell-verifier">{log.verifierName}</td>
                <td className="cell-email">{log.verifierEmail}</td>
                <td className="cell-cert-id">{log.certificateId}</td>
                <td>{log.studentName}</td>
                <td className="cell-date">{log.verifiedAt}</td>
                <td>
                  <span
                    className={`verification-badge ${
                      log.status === 'Valid' ? 'badge-valid' : 'badge-invalid'
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={logs.length}
      />
    </div>
  );
};

export default VerificationLogsTable;
