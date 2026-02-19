import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../css/VerifyCertificate.css';

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    // Add verification logic here
  };

  return (
    <div className="verify-certificate">
      <Navbar />
      <main className="verify-content">
        <h1 className="verify-title">Verify Certificate</h1>
        <div className="verify-container">
          <form onSubmit={handleVerify} className="verify-form">
            <div className="form-group">
              <label htmlFor="certificateId">Certificate ID</label>
              <input
                type="text"
                id="certificateId"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="Enter certificate ID to verify"
              />
            </div>
            <button type="submit" className="verify-button">Verify Certificate</button>
          </form>
          
          {verificationResult && (
            <div className="verification-result">
              <h2>Verification Result</h2>
              <p>Result will be displayed here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerifyCertificate;
