import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // If token does not exist, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role does not exist, redirect to login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // If role is not included in allowedRoles, redirect to login
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // If everything is valid, render children
  return children;
};

export default ProtectedRoute;
