import React, { useState } from 'react';
import Pagination from '../Pagination';
import '../../css/UsersTable.css';

const UsersTable = ({ users }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getOrgOrEnrollment = (user) => {
    if (user.role === 'Issuer') return user.organization;
    if (user.role === 'Student') return user.enrollmentNo;
    return '—';
  };

  // Calculate pagination
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="users-table-card">
      <h2 className="users-table-title">All Users</h2>
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Org / Enrollment</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="users-table-empty">
                  No users found.
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`users-role-tag role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{getOrgOrEnrollment(user)}</td>
                  <td>
                    <span className={`users-status-badge ${user.status === 'Active' ? 'active' : 'suspended'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.createdAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {users.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={users.length}
        />
      )}
    </div>
  );
};

export default UsersTable;
