import React from 'react';
import { adminStats, recentActivities } from '../data/adminData';
import '../css/AdminDashboard.css';

const AdminDashboard = () => {
  const statCards = [
    { label: 'Total Users', value: adminStats.totalUsers, icon: 'users' },
    { label: 'Total Issuers', value: adminStats.totalIssuers, icon: 'issuers' },
    { label: 'Total Students', value: adminStats.totalStudents, icon: 'students' },
    { label: 'Certificates', value: adminStats.totalCertificates, icon: 'certificates' },
    { label: 'Verifications', value: adminStats.totalVerifications, icon: 'verifications' },
    { label: 'Blockchain Txns', value: adminStats.totalBlockchainTransactions, icon: 'blockchain' },
  ];

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard-heading">Dashboard Overview</h1>

      <div className="admin-stats-grid">
        {statCards.map((card) => (
          <div className="admin-stat-card" key={card.label}>
            <p className="admin-stat-label">{card.label}</p>
            <p className="admin-stat-value">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="admin-activity-section">
        <h2 className="admin-activity-heading">Recent Activity</h2>
        <div className="admin-activity-table-wrapper">
          <table className="admin-activity-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Performed By</th>
                <th>Role</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.activityType}</td>
                  <td>{activity.performedBy}</td>
                  <td>
                    <span className="admin-role-tag">{activity.role}</span>
                  </td>
                  <td>{activity.date}</td>
                  <td>
                    <span className={`admin-status-tag ${activity.status === 'Completed' ? 'completed' : 'pending'}`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
