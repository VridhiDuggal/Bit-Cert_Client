import React, { useState } from 'react';
import { blockchainLogsData } from '../../data/blockchainLogsData';
import BlockchainLogsTable from './BlockchainLogsTable';
import '../../css/ManageBlockchainLogs.css';

const ManageBlockchainLogs = () => {
  const [transactions] = useState(blockchainLogsData);

  // Stats
  const totalTxns = transactions.length;
  const committed = transactions.filter((t) => t.status === 'Committed').length;
  const pending = transactions.filter((t) => t.status === 'Pending').length;

  const statCards = [
    { label: 'Total Transactions', value: totalTxns },
    { label: 'Committed', value: committed },
    { label: 'Pending', value: pending },
  ];

  return (
    <div className="manage-blockchain-logs">
      <div className="manage-blockchain-logs-header">
        <h1 className="manage-blockchain-logs-heading">Blockchain Transaction Logs</h1>
        <p className="manage-blockchain-logs-subtitle">
          View on-chain certificate proof records
        </p>
      </div>

      <div className="blockchain-stats-grid">
        {statCards.map((card) => (
          <div className="blockchain-stat-card" key={card.label}>
            <p className="blockchain-stat-label">{card.label}</p>
            <p className="blockchain-stat-value">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <BlockchainLogsTable transactions={transactions} />
    </div>
  );
};

export default ManageBlockchainLogs;
