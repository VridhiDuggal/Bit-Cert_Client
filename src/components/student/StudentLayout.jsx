import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import StudentNavbar from './StudentNavbar';
import '../../css/StudentLayout.css';

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="student-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="student-main">
        <StudentNavbar title="Student Panel" onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        <div className="student-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
