import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/MyCertificatesTable.css';

const MyCertificatesTable = ({ certificates }) => {
  const navigate = useNavigate();

  if (!certificates || certificates.length === 0) {
    return (
      <div className="my-cert-table-empty">
        <p>No certificates found</p>
      </div>
    );
  }

  return (
    <div className="my-cert-table-wrapper">
      <table className="my-cert-table">
        <thead>
          <tr>
            <th>Certificate ID</th>
            <th>Course Name</th>
            <th>Issuer</th>
            <th>Issued Date</th>
            <th>Certificate Hash</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((cert) => (
            <tr key={cert.id}>
              <td className="cert-id-cell">{cert.certificateId}</td>
              <td>{cert.courseName}</td>
              <td>{cert.issuerName}</td>
              <td className="cert-date-cell">{cert.issuedAt}</td>
              <td className="cert-hash-cell" title={cert.certHash}>
                {cert.certHash.substring(0, 10)}...
              </td>
              <td>
                <span className={`cert-status-badge ${cert.status === 'Valid' ? 'valid' : 'revoked'}`}>
                  {cert.status}
                </span>
              </td>
              <td className="cert-actions-cell">
                <button
                  className="cert-action-btn view-btn"
                  onClick={() => navigate(`/student/certificates/${cert.id}`)}
                >
                  View Details
                </button>
                <button
                  className="cert-action-btn qr-btn"
                  onClick={() => console.log(cert.certificateId)}
                >
                  View QR
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyCertificatesTable;
