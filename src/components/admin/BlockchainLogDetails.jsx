import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blockchainLogsData } from '../../data/blockchainLogsData';
import '../../css/BlockchainLogDetails.css';

const BlockchainLogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const transaction = blockchainLogsData.find((tx) => tx.id === parseInt(id));

  if (!transaction) {
    return (
      <div className="blockchain-log-details">
        <div className="blockchain-not-found">
          <h2>Transaction Not Found</h2>
          <p>The blockchain transaction you're looking for doesn't exist.</p>
          <button className="back-btn" onClick={() => navigate('/admin/blockchain')}>
            Back to Blockchain Logs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blockchain-log-details">
      <button className="back-btn" onClick={() => navigate('/admin/blockchain')}>
        ← Back to Blockchain Logs
      </button>

      <div className="blockchain-details-card">
        <div className="blockchain-details-header">
          <div>
            <h1 className="blockchain-details-title">{transaction.txId}</h1>
          </div>
          <span
            className={`blockchain-details-badge ${
              transaction.status === 'Committed' ? 'badge-committed' : 'badge-pending'
            }`}
          >
            {transaction.status}
          </span>
        </div>

        <div className="blockchain-details-grid">
          <div className="detail-item">
            <span className="detail-label">Transaction ID</span>
            <span className="detail-value">{transaction.txId}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Fabric Block ID</span>
            <span className="detail-value">{transaction.fabricBlockId}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Certificate ID</span>
            <span className="detail-value">{transaction.certificateId}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Timestamp</span>
            <span className="detail-value">{transaction.timestamp}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Student Name</span>
            <span className="detail-value">{transaction.studentName}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Issuer Name</span>
            <span className="detail-value">{transaction.issuerName}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Channel Name</span>
            <span className="detail-value">{transaction.channelName}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Gas Used</span>
            <span className="detail-value">{transaction.gasUsed}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Validation Code</span>
            <span className="detail-value detail-value-highlight">{transaction.validationCode}</span>
          </div>

          <div className="detail-item detail-item-full">
            <span className="detail-label">Certificate Hash</span>
            <span className="detail-value detail-value-mono">{transaction.certificateHash}</span>
          </div>

          <div className="detail-item detail-item-full">
            <span className="detail-label">Endorsing Peers</span>
            <div className="endorsers-list">
              {transaction.endorsers.map((endorser, index) => (
                <span key={index} className="endorser-badge">
                  {endorser}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainLogDetails;
