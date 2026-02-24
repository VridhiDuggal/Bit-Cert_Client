import React from 'react';
import Pagination from '../Pagination';
import '../../css/VerificationHistoryTable.css';

const VerificationHistoryTable = ({
  history,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  if (!history || totalItems === 0) {
    return (
      <div className="verification-history-table-wrapper">
        <p className="history-empty-message">No verification history found.</p>
      </div>
    );
  }

  return (
    <div className="verification-history-table-wrapper">
      <div className="table-scroll">
        <table className="verification-history-table">
          <thead>
            <tr>
              <th>Certificate ID</th>
              <th>Student Name</th>
              <th>Issuer Name</th>
              <th>Verified At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.certificateId}</td>
                <td>{item.studentName}</td>
                <td>{item.issuerName}</td>
                <td>{item.verifiedAt}</td>
                <td>
                  <span
                    className={`history-status-badge ${
                      item.status === 'Valid' ? 'valid' : 'invalid'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}
    </div>
  );
};

export default VerificationHistoryTable;
