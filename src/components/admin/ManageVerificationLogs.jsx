import React, { useState } from 'react';
import { verificationLogsData } from '../../data/verificationLogsData';
import VerificationLogsTable from './VerificationLogsTable';
import '../../css/ManageVerificationLogs.css';

const ManageVerificationLogs = () => {
  const [logs] = useState(verificationLogsData);

  // Stats
  const totalLogs = logs.length;
  const validLogs = logs.filter((l) => l.status === 'Valid').length;
  const invalidLogs = logs.filter((l) => l.status === 'Invalid').length;

  const statCards = [
    { label: 'Total Verifications', value: totalLogs },
    { label: 'Valid', value: validLogs },
    { label: 'Invalid', value: invalidLogs },
  ];

  return (
    <div className="manage-verification-logs">
      <div className="manage-verification-logs-header">
        <h1 className="manage-verification-logs-heading">Verification Logs</h1>
        <p className="manage-verification-logs-subtitle">
          Monitor certificate verification activities
        </p>
      </div>

      <div className="verification-stats-grid">
        {statCards.map((card) => (
          <div className="verification-stat-card" key={card.label}>
            <p className="verification-stat-label">{card.label}</p>
            <p className="verification-stat-value">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <VerificationLogsTable logs={logs} />
    </div>
  );
};

export default ManageVerificationLogs;
