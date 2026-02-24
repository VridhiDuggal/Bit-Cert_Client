import React from 'react';
import { verifierInfo } from '../../data/verifierLayoutData';
import '../../css/VerifierNavbar.css';

const VerifierNavbar = ({ title, onMenuToggle }) => {
  return (
    <header className="verifier-navbar">
      <div className="verifier-navbar-left">
        <button className="verifier-hamburger" onClick={onMenuToggle} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
        <h1 className="verifier-navbar-title">{title || 'Dashboard'}</h1>
      </div>

      <div className="verifier-navbar-right">
        <span className="verifier-full-name">{verifierInfo.fullName}</span>
        <span className="verifier-org-name">{verifierInfo.organizationName}</span>
        <span className="verifier-role-badge">{verifierInfo.role}</span>
        <div className="verifier-profile-circle">
          {verifierInfo.fullName.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default VerifierNavbar;
