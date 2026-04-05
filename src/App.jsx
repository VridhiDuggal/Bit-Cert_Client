import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import IssuerLayout from './components/issuer/IssuerLayout';
import IssuerIssueCertificate from './components/issuer/IssuerIssueCertificate';
import IssuedCertificates from './components/issuer/IssuedCertificates';
import IssuerCertificateDetail from './components/issuer/IssuerCertificateDetail';
import VerificationActivity from './components/issuer/VerificationActivity';
import IssuerProfile from './components/issuer/IssuerProfile';
import StudentLayout from './components/student/StudentLayout';
import MyCertificates from './components/student/MyCertificates';
import CertificateLayout from './components/student/CertificateLayout';
import CertificatePreviewTab from './components/student/CertificatePreviewTab';
import CertificateDetailsTab from './components/student/CertificateDetailsTab';
import CertificateQRTab from './components/student/CertificateQRTab';
import CertificateHistoryTab from './components/student/CertificateHistoryTab';
import StudentProfile from './components/student/StudentProfile';
import StudentDashboard from './pages/StudentDashboard';
import VerifierLayout from './components/verifier/VerifierLayout';
import VerifyCertificateVerifier from './pages/verifier/VerifyCertificate';
import VerificationResultPage from './pages/verifier/VerificationResultPage';
import VerificationHistory from './pages/verifier/VerificationHistory';
import VerifierProfile from './pages/verifier/VerifierProfile';
import IssueCertificate from './pages/IssueCertificate';
import VerifyCertificate from './pages/VerifyCertificate';
import ProtectedRoute from './components/ProtectedRoute';
import ManageUsers from './components/admin/ManageUsers';
import ManageIssuers from './components/admin/ManageIssuers';
import IssuerDetails from './components/admin/IssuerDetails';
import ManageCertificates from './components/admin/ManageCertificates';
import CertificateDetails from './components/admin/CertificateDetails';
import ManageVerificationLogs from './components/admin/ManageVerificationLogs';
import ManageBlockchainLogs from './components/admin/ManageBlockchainLogs';
import BlockchainLogDetails from './components/admin/BlockchainLogDetails';
import LandingPage from './features/public/pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin nested routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="issuers" element={<ManageIssuers />} />
          <Route path="issuers/:id" element={<IssuerDetails />} />
          <Route path="certificates" element={<ManageCertificates />} />
          <Route path="certificates/:id" element={<CertificateDetails />} />
          <Route path="verification-logs" element={<ManageVerificationLogs />} />
          <Route path="blockchain" element={<ManageBlockchainLogs />} />
          <Route path="blockchain/:id" element={<BlockchainLogDetails />} />
        </Route>

        <Route
          path="/issuer"
          element={
            <ProtectedRoute allowedRoles={['Issuer']}>
              <IssuerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/issuer/certificates" replace />} />
          <Route path="issue" element={<IssuerIssueCertificate />} />
          <Route path="certificates" element={<IssuedCertificates />} />
          <Route path="certificates/:id" element={<IssuerCertificateDetail />} />
          <Route path="verifications" element={<VerificationActivity />} />
          <Route path="profile" element={<IssuerProfile />} />
        </Route>
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/student/certificates" replace />} />
          <Route path="certificates" element={<MyCertificates />} />
          <Route path="certificates/:id" element={<CertificateLayout />}>
            <Route index element={<Navigate to="preview" replace />} />
            <Route path="preview" element={<CertificatePreviewTab />} />
            <Route path="details" element={<CertificateDetailsTab />} />
            <Route path="qr" element={<CertificateQRTab />} />
            <Route path="history" element={<CertificateHistoryTab />} />
          </Route>
          <Route path="verifications" element={<div>Verification History</div>} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
        <Route
          path="/verifier"
          element={
            <ProtectedRoute allowedRoles={['Verifier']}>
              <VerifierLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<VerifyCertificateVerifier />} />
          <Route path="result/:certificateId" element={<VerificationResultPage />} />
          <Route path="history" element={<VerificationHistory />} />
          <Route path="profile" element={<VerifierProfile />} />
        </Route>
        <Route
          path="/issue-certificate"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Issuer']}>
              <IssueCertificate />
            </ProtectedRoute>
          }
        />
        <Route path="/verify-certificate" element={<VerifyCertificate />} />
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/verify/:hash" element={<VerifyCertificate />} />
        <Route path="/org/login" element={<Login />} />
        <Route path="/recipient/login" element={<Login />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
