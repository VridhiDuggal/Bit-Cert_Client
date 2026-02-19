import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination';
import '../../css/BlockchainLogsTable.css';

const BlockchainLogsTable = ({ transactions }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!transactions || transactions.length === 0) {
    return (
      <div className="blockchain-table-card">
        <p className="blockchain-empty">No blockchain transactions found</p>
      </div>
    );
  }

  const truncateHash = (hash, len = 10) => {
    if (!hash) return '—';
    return hash.length > len ? `${hash.substring(0, len)}...` : hash;
  };

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="blockchain-table-card">
      <div className="blockchain-table-scroll">
        <table className="blockchain-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Certificate Hash</th>
              <th>Fabric Block ID</th>
              <th>Timestamp</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((tx) => (
              <tr key={tx.id}>
                <td className="cell-tx-id">{tx.txId}</td>
                <td>
                  <span className="hash-cell" title={tx.certificateHash}>
                    {truncateHash(tx.certificateHash)}
                  </span>
                </td>
                <td className="cell-block-id">{tx.fabricBlockId}</td>
                <td className="cell-timestamp">{tx.timestamp}</td>
                <td>
                  <span
                    className={`blockchain-badge ${
                      tx.status === 'Committed' ? 'badge-committed' : 'badge-pending'
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td>
                  <button
                    className="view-more-btn"
                    onClick={() => navigate(`/admin/blockchain/${tx.id}`)}
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
        totalItems={transactions.length}
      />
    </div>
  );
};

export default BlockchainLogsTable;
