import React from 'react';
import { verifierProfileData } from '../../data/verifierProfileData';
import '../../css/VerifierProfile.css';

const VerifierProfile = () => {
  const profile = verifierProfileData;

  return (
    <div className="verifier-profile-page">
      <div className="page-header">
        <h1 className="page-title">Verifier Profile</h1>
        <p className="page-subtitle">View your organization and verification summary</p>
      </div>

      {/* Section 1 — Verification Summary (top) */}
      <div className="verification-summary-grid">
        <div className="summary-stat-card">
          <p className="stat-label">Total Verifications</p>
          <p className="stat-value">{profile.totalVerifications}</p>
        </div>
        <div className="summary-stat-card">
          <p className="stat-label">Successful</p>
          <p className="stat-value">{profile.successfulVerifications}</p>
        </div>
        <div className="summary-stat-card">
          <p className="stat-label">Failed</p>
          <p className="stat-value">{profile.failedVerifications}</p>
        </div>
      </div>

      {/* Section 2 — Personal & Organization Info */}
      <div className="profile-info-card">
        <h3 className="section-title">Personal & Organization Information</h3>
        <div className="profile-info-grid">
          <div className="profile-info-item">
            <span className="profile-info-label">Full Name</span>
            <span className="profile-info-value">{profile.fullName}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Organization</span>
            <span className="profile-info-value">{profile.organizationName}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Email</span>
            <span className="profile-info-value">{profile.email}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Contact Number</span>
            <span className="profile-info-value">{profile.contactNumber}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Role</span>
            <span className="profile-badge role">{profile.role}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Member Since</span>
            <span className="profile-info-value">{profile.memberSince}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Account Status</span>
            <span className="profile-badge active">{profile.accountStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifierProfile;
