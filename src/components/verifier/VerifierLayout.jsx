import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import VerifierSidebar from './VerifierSidebar';
import VerifierNavbar from './VerifierNavbar';
import '../../css/VerifierLayout.css';

const VerifierLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="verifier-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <VerifierSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="verifier-main">
        <VerifierNavbar title="Verifier Panel" onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        <div className="verifier-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VerifierLayout;
