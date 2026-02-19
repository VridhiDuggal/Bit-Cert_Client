import React, { useState, useEffect } from 'react';
import '../../css/UserForm.css';

const UserForm = ({ addUser, isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [organization, setOrganization] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFullName('');
      setEmail('');
      setPassword('');
      setRole('Student');
      setOrganization('');
      setEnrollmentNo('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!fullName.trim() || !email.trim() || !password.trim() || !role) return;
    if (role === 'Issuer' && !organization.trim()) return;
    if (role === 'Student' && !enrollmentNo.trim()) return;

    addUser({
      fullName,
      email,
      role,
      organization: role === 'Issuer' ? organization : null,
      enrollmentNo: role === 'Student' ? enrollmentNo : null,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="user-form-modal">
        <div className="modal-header">
          <h2 className="user-form-title">Add New User</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="user-form">
        <div className="user-form-grid">
          <div className="user-form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="user-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="user-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set password"
              required
            />
          </div>

          <div className="user-form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Issuer">Issuer</option>
              <option value="Student">Student</option>
              <option value="Verifier">Verifier</option>
            </select>
          </div>

          {role === 'Issuer' && (
            <div className="user-form-group">
              <label htmlFor="organization">Organization Name</label>
              <input
                type="text"
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Enter organization name"
                required
              />
            </div>
          )}

          {role === 'Student' && (
            <div className="user-form-group">
              <label htmlFor="enrollmentNo">Enrollment No</label>
              <input
                type="text"
                id="enrollmentNo"
                value={enrollmentNo}
                onChange={(e) => setEnrollmentNo(e.target.value)}
                placeholder="Enter enrollment number"
                required
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="user-form-submit">Add User</button>
        </div>
      </form>
      </div>
    </>
  );
};

export default UserForm;
