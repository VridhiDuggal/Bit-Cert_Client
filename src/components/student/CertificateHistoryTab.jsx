import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { studentCertificateVerificationData } from '../../data/studentCertificateVerificationData';
import '../../css/CertificateHistoryTab.css';

const CertificateHistoryTab = () => {
  const { certificate } = useOutletContext();

  const logs = studentCertificateVerificationData.filter(
    (log) => log.certificateId === certificate.certificateId
  );

  return (
    <div className="cert-hist-card">
      <h3 className="cert-hist-title">Verification History</h3>

      {logs.length === 0 ? (
        <p className="cert-hist-empty">No verification activity for this certificate.</p>
      ) : (
        <div className="cert-hist-table-wrapper">
          <table className="cert-hist-table">
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
                  <td className="cert-hist-email">{log.verifierEmail}</td>
                  <td className="cert-hist-date">{log.verifiedAt}</td>
                  <td>
                    <span className={`cert-hist-badge ${log.status === 'Valid' ? 'valid' : 'invalid'}`}>
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

export default CertificateHistoryTab;
