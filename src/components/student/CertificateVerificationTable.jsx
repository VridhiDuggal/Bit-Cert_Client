import React from 'react';
import { studentCertificateVerificationData } from '../../data/studentCertificateVerificationData';
import '../../css/CertificateVerificationTable.css';

const CertificateVerificationTable = ({ certificateId }) => {
  const logs = studentCertificateVerificationData.filter(
    (log) => log.certificateId === certificateId
  );

  return (
    <div className="cert-ver-table-section">
      <h3 className="cert-ver-table-title">Verification History</h3>

      {logs.length === 0 ? (
        <p className="cert-ver-table-empty">No verification activity for this certificate.</p>
      ) : (
        <div className="cert-ver-table-wrapper">
          <table className="cert-ver-table">
            <thead>
              <tr>
                <th>Verifier Name</th>
                <th>Verifier Email</th>
                <th>Verified At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.verifierName}</td>
                  <td className="cert-ver-email">{log.verifierEmail}</td>
                  <td className="cert-ver-date">{log.verifiedAt}</td>
                  <td>
                    <span
                      className={`cert-ver-status-badge ${
                        log.status === 'Valid' ? 'valid' : 'invalid'
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
      )}
    </div>
  );
};

export default CertificateVerificationTable;
