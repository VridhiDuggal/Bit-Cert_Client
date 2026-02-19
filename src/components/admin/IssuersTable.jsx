import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination';
import '../../css/IssuersTable.css';

const IssuersTable = ({ issuers, onStatusChange }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(issuers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIssuers = issuers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="issuers-table-card">
      <div className="issuers-table-scroll">
        <table className="issuers-table">
          <thead>
            <tr>
              <th>Organization Name</th>
              <th>Email</th>
              <th>Certificates Issued</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentIssuers.map((issuer) => (
              <tr key={issuer.id}>
                <td className="cell-org">{issuer.organizationName}</td>
                <td className="cell-email">{issuer.email}</td>
                <td className="cell-center">{issuer.totalCertificatesIssued}</td>
                <td>
                  <span
                    className={`issuer-badge ${
                      issuer.status === 'Active' ? 'badge-active' : 'badge-suspended'
                    }`}
                  >
                    {issuer.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className={`status-toggle-btn ${
                        issuer.status === 'Active' ? 'btn-suspend' : 'btn-activate'
                      }`}
                      onClick={() => onStatusChange(issuer.id)}
                    >
                      {issuer.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button
                      className="view-more-btn"
                      onClick={() => navigate(`/admin/issuers/${issuer.id}`)}
                    >
                      View More
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {issuers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={issuers.length}
        />
      )}
    </div>
  );
};

export default IssuersTable;
