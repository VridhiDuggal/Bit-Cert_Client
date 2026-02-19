import React, { useState } from 'react';
import { usersData } from '../../data/usersData';
import UserForm from './UserForm';
import UsersTable from './UsersTable';
import '../../css/ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState(usersData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addUser = (newUser) => {
    const user = {
      ...newUser,
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [user, ...prev]);
    setIsModalOpen(false); // Close modal after adding user
  };

  return (
    <div className="manage-users">
      <div className="manage-users-header">
        <h1 className="manage-users-heading">User Management</h1>
        <button className="add-user-btn" onClick={() => setIsModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add User
        </button>
      </div>
      <UserForm addUser={addUser} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <UsersTable users={users} />
    </div>
  );
};

export default ManageUsers;
