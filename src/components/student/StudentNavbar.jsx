import React from 'react';
import { studentInfo } from '../../data/studentLayoutData';
import '../../css/StudentNavbar.css';

const StudentNavbar = ({ title, onMenuToggle }) => {
  return (
    <header className="student-navbar">
      <div className="student-navbar-left">
        <button className="student-hamburger" onClick={onMenuToggle} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
        <h1 className="student-navbar-title">{title || 'Dashboard'}</h1>
      </div>

      <div className="student-navbar-right">
        <nav className="student-navbar-links">
          <a href="#home" className="student-nav-link">Home</a>
          <a href="#about" className="student-nav-link">About Us</a>
          <a href="#contact" className="student-nav-link">Contact</a>
        </nav>
        <span className="student-full-name">{studentInfo.fullName}</span>
        <span className="student-role-badge">Student</span>
        <div className="student-profile-circle">
          {studentInfo.fullName.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default StudentNavbar;
