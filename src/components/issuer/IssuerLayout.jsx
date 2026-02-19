import React from 'react';
import { Outlet } from 'react-router-dom';
import IssuerSidebar from './IssuerSidebar';
import IssuerNavbar from './IssuerNavbar';
import '../../css/IssuerLayout.css';

const IssuerLayout = () => {
  return (
    <div className="issuer-layout">
      <IssuerSidebar />
      <div className="issuer-main">
        <IssuerNavbar title="Issuer Panel" />
        <div className="issuer-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default IssuerLayout;
