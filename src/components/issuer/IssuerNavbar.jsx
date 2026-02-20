import React from 'react';
import { issuerInfo } from '../../data/issuerLayoutData';
import '../../css/IssuerNavbar.css';

const IssuerNavbar = ({ title, onMenuToggle }) => {
  return (
    <header className="issuer-navbar">
      <div className="issuer-navbar-left">
        <button className="issuer-hamburger" onClick={onMenuToggle} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
        <h1 className="issuer-navbar-title">{title || 'Dashboard'}</h1>
      </div>

      <div className="issuer-navbar-right">
        <span className="issuer-org-name">{issuerInfo.organizationName}</span>
        <span className="issuer-role-badge">Issuer</span>
        <div className="issuer-profile-circle">I</div>
      </div>
    </header>
  );
};

export default IssuerNavbar;
