import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        <h2 className="sidebar-title">Menu</h2>
        <ul className="sidebar-menu">
          <li className="sidebar-item">Dashboard</li>
          <li className="sidebar-item">Certificates</li>
          <li className="sidebar-item">Settings</li>
          <li className="sidebar-item" onClick={handleLogout}>Logout</li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
