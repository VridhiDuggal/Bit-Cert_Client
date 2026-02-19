import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination';
import '../../css/CertificatesTable.css';

const CertificatesTable = ({ certificates }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!certificates || certificates.length === 0) {
    return (
      <div className="certificates-table-card">
        <p className="certificates-empty">No certificates found</p>
      </div>
    );
  }

  const truncateHash = (hash, len = 10) => {
    if (!hash) return '—';
    return hash.length > len ? `${hash.substring(0, len)}...` : hash;
  };

  // Calculate pagination
  const totalPages = Math.ceil(certificates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCertificates = certificates.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="certificates-table-card">
      <div className="certificates-table-scroll">
        <table className="certificates-table">
          <thead>
            <tr>
              <th>Certificate ID</th>
              <th>Issuer</th>
              <th>Student</th>
              <th>Certificate Hash</th>
              <th>Blockchain TX ID</th>
              <th>IPFS Hash</th>
              <th>Issued Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCertificates.map((cert) => (
              <tr key={cert.id}>
                <td className="cell-cert-id">{cert.certificateId}</td>
                <td>{cert.issuerName}</td>
                <td>{cert.studentName}</td>
                <td>
                  <span className="hash-cell" title={cert.certHash}>
                    {truncateHash(cert.certHash)}
                  </span>
                </td>
                <td>
                  <span className="hash-cell" title={cert.blockchainTxId}>
                    {truncateHash(cert.blockchainTxId)}
                  </span>
                </td>
                <td>
                  <span className="hash-cell" title={cert.ipfsHash}>
                    {truncateHash(cert.ipfsHash)}
                  </span>
                </td>
                <td className="cell-date">{cert.issuedAt}</td>
                <td>
                  <span
                    className={`cert-badge ${
                      cert.status === 'Valid' ? 'badge-valid' : 'badge-revoked'
                    }`}
                  >
                    {cert.status}
                  </span>
                </td>
                <td>
                  <button
                    className="view-more-btn"
                    onClick={() => navigate(`/admin/certificates/${cert.id}`)}
                  >
                    View More
                  </button>
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
        totalItems={certificates.length}
      />
    </div>
  );
};

export default CertificatesTable;
