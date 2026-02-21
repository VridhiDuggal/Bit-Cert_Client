import React, { useState } from 'react';
import { studentProfileData } from '../../data/studentProfileData';
import '../../css/StudentProfile.css';

const StudentProfile = () => {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="stu-profile-page">
      <div className="stu-profile-header">
        <h1 className="stu-profile-title">My Profile</h1>
        <p className="stu-profile-subtitle">
          View your decentralized identity and academic information
        </p>
      </div>

      <div className="stu-profile-card">
        {/* SECTION 1 — Personal & Academic */}
        <div className="stu-profile-section">
          <h3 className="stu-profile-section-title">Personal & Academic Information</h3>
          <div className="stu-profile-grid">
            <div className="stu-profile-item">
              <span className="stu-profile-label">Full Name</span>
              <span className="stu-profile-value">{studentProfileData.fullName}</span>
            </div>
            <div className="stu-profile-item">
              <span className="stu-profile-label">Email</span>
              <span className="stu-profile-value">{studentProfileData.email}</span>
            </div>
            <div className="stu-profile-item">
              <span className="stu-profile-label">Enrollment No.</span>
              <span className="stu-profile-value">{studentProfileData.enrollmentNo}</span>
            </div>
            <div className="stu-profile-item">
              <span className="stu-profile-label">Program</span>
              <span className="stu-profile-value">{studentProfileData.programName}</span>
            </div>
            <div className="stu-profile-item">
              <span className="stu-profile-label">University</span>
              <span className="stu-profile-value">{studentProfileData.universityName}</span>
            </div>
            <div className="stu-profile-item">
              <span className="stu-profile-label">Member Since</span>
              <span className="stu-profile-value">{studentProfileData.memberSince}</span>
            </div>
            <div className="stu-profile-item">
              <span className="stu-profile-label">Account Status</span>
              <span className="stu-profile-status-badge active">
                {studentProfileData.accountStatus}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2 — Decentralized Identity */}
        <div className="stu-profile-section stu-profile-section-last">
          <h3 className="stu-profile-section-title">Decentralized Identity</h3>
          <div className="stu-profile-did-rows">
            <div className="stu-profile-did-item">
              <span className="stu-profile-label">DID</span>
              <div className="stu-profile-did-row">
                <span className="stu-profile-did-text">{studentProfileData.did}</span>
                <button
                  className="stu-profile-copy-btn"
                  onClick={() => handleCopy(studentProfileData.did, 'did')}
                >
                  {copiedField === 'did' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="stu-profile-did-item">
              <span className="stu-profile-label">Public Key</span>
              <div className="stu-profile-did-row">
                <span className="stu-profile-did-text">{studentProfileData.publicKey}</span>
                <button
                  className="stu-profile-copy-btn"
                  onClick={() => handleCopy(studentProfileData.publicKey, 'pubkey')}
                >
                  {copiedField === 'pubkey' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
