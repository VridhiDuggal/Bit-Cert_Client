import React from 'react';
import '../../css/AdminNavbar.css';

const AdminNavbar = ({ title }) => {
  const role = localStorage.getItem('role') || 'Admin';

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-left">
        <h1 className="admin-navbar-title">{title || 'Dashboard'}</h1>
      </div>

      <div className="admin-navbar-right">
        <span className="admin-role-badge">{role}</span>
        <div className="admin-profile-circle">
          {role.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
