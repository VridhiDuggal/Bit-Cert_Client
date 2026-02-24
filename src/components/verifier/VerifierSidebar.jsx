import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { verifierSidebarLinks } from '../../data/verifierLayoutData';
import '../../css/VerifierSidebar.css';

const iconMap = {
  verify: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  history: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

const VerifierSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <aside className={`verifier-sidebar${isOpen ? ' open' : ''}`}>
      <div className="verifier-sidebar-brand">
        <span className="brand-logo">
          <svg width="34" height="37" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1 H28 L39 12 V43 H6 V1 Z" fill="#f4f8f4" stroke="#588157" strokeWidth="2"/>
            <path d="M28 1 V12 H39" stroke="#588157" strokeWidth="2" fill="none"/>
            <line x1="0" y1="22" x2="40" y2="22" stroke="#588157" strokeWidth="1.8"/>
            <line x1="22" y1="0" x2="22" y2="44" stroke="#588157" strokeWidth="1.8"/>
            <rect x="0" y="17" width="9" height="10" rx="1" fill="#588157"/>
            <rect x="31" y="17" width="9" height="10" rx="1" fill="#588157"/>
            <rect x="17" y="0" width="10" height="9" rx="1" fill="#588157"/>
            <rect x="17" y="35" width="10" height="9" rx="1" fill="#588157"/>
            <path d="M22 13 L29 16.5 V23 C29 27.5 22 31 22 31 C22 31 15 27.5 15 23 V16.5 Z" fill="#588157"/>
            <polyline points="18.5,22.5 21,25.5 26,18.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <div className="brand-text">
          <span className="brand-name">Bit-Cert</span>
          <span className="brand-role">Verifier Panel</span>
        </div>
      </div>

      <nav className="verifier-sidebar-nav">
        {verifierSidebarLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/verifier'}
            className={({ isActive }) =>
              `verifier-sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <span className="sidebar-link-icon">{iconMap[link.icon]}</span>
            <span className="sidebar-link-text">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="verifier-sidebar-footer">
        <button className="verifier-logout-button" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default VerifierSidebar;
