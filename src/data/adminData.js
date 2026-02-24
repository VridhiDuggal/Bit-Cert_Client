// Admin Mock Data for Frontend

export const adminStats = {
  totalUsers: 1248,
  totalIssuers: 36,
  totalStudents: 1185,
  totalCertificates: 3672,
  totalVerifications: 8419,
  totalBlockchainTransactions: 4210,
};

export const recentActivities = [
  {
    id: 1,
    activityType: 'Certificate Issued',
    performedBy: 'Dr. Ramesh Kumar',
    role: 'Issuer',
    date: '2026-02-16',
    status: 'Completed',
  },
  {
    id: 2,
    activityType: 'User Registered',
    performedBy: 'Ananya Sharma',
    role: 'Student',
    date: '2026-02-15',
    status: 'Completed',
  },
  {
    id: 3,
    activityType: 'Certificate Verified',
    performedBy: 'TCS Recruitment',
    role: 'Verifier',
    date: '2026-02-15',
    status: 'Completed',
  },
  {
    id: 4,
    activityType: 'Certificate Revoked',
    performedBy: 'Admin Panel',
    role: 'Admin',
    date: '2026-02-14',
    status: 'Completed',
  },
  {
    id: 5,
    activityType: 'Issuer Approved',
    performedBy: 'Admin Panel',
    role: 'Admin',
    date: '2026-02-14',
    status: 'Completed',
  },
  {
    id: 6,
    activityType: 'Blockchain Sync',
    performedBy: 'System',
    role: 'System',
    date: '2026-02-13',
    status: 'Completed',
  },
  {
    id: 7,
    activityType: 'Certificate Issued',
    performedBy: 'Prof. Meena Iyer',
    role: 'Issuer',
    date: '2026-02-13',
    status: 'Pending',
  },
  {
    id: 8,
    activityType: 'User Registered',
    performedBy: 'Vikram Patel',
    role: 'Student',
    date: '2026-02-12',
    status: 'Completed',
  },
];

export const adminSidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
  { name: 'Manage Users', path: '/admin/users', icon: 'users' },
  { name: 'Manage Issuers', path: '/admin/issuers', icon: 'issuers' },
  { name: 'Certificates', path: '/admin/certificates', icon: 'certificates' },
  { name: 'Verification Logs', path: '/admin/verification-logs', icon: 'verification' },
  { name: 'Blockchain Logs', path: '/admin/blockchain', icon: 'blockchain' },
];
