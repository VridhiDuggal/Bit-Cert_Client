import React, { useState } from 'react';
import { verifierHistoryData } from '../../data/verifierHistoryData';
import VerificationHistoryTable from '../../components/verifier/VerificationHistoryTable';
import '../../css/VerificationHistory.css';

const ITEMS_PER_PAGE = 5;

const VerificationHistory = () => {
  const [history] = useState(verifierHistoryData);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const paginatedHistory = history.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="verification-history-page">
      <div className="page-header">
        <h1 className="page-title">Verification History</h1>
        <p className="page-subtitle">Track past certificate verification attempts</p>
      </div>

      <VerificationHistoryTable
        history={paginatedHistory}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={history.length}
      />
    </div>
  );
};

export default VerificationHistory;
