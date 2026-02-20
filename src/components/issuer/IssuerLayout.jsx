import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import IssuerSidebar from './IssuerSidebar';
import IssuerNavbar from './IssuerNavbar';
import '../../css/IssuerLayout.css';

const IssuerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="issuer-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <IssuerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="issuer-main">
        <IssuerNavbar title="Issuer Panel" onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        <div className="issuer-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default IssuerLayout;
