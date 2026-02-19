import React from 'react';
import '../css/CertificateCard.css';

const CertificateCard = ({ certificate }) => {
  return (
    <div className="certificate-card">
      <div className="certificate-card-header">
        <h3 className="certificate-title">Certificate Title</h3>
      </div>
      <div className="certificate-card-body">
        <p className="certificate-detail">Recipient: Name</p>
        <p className="certificate-detail">Issue Date: Date</p>
        <p className="certificate-detail">Status: Valid</p>
      </div>
      <div className="certificate-card-footer">
        <button className="certificate-button">View Details</button>
      </div>
    </div>
  );
};

export default CertificateCard;
